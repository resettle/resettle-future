import { type OccupationCodes } from '@resettle/schema'
import { round2 } from '@resettle/utils'

import type { Context } from '../../types'
import {
  getOccupationCodesSimilarity,
  type OccupationCodesFilter,
} from '../../utils/occupation'
import { getBooleanSimilarity } from '../../utils/similarity'

export const DEFAULT_AUSTRALIA_SIMILARITY = 0.2

type AssessedOccupation = { id: string; occupation_codes?: OccupationCodes }

type AustraliaStateFilters = {
  occupation_codes?: OccupationCodesFilter
}

type AustraliaStateFiltersOutput = {
  occupation_codes?: {
    expected: OccupationCodesFilter
    actual?: OccupationCodes
    similarity: number
  }
}

export type AustraliaStateInput = {
  assessed_occupations?: AssessedOccupation[]
  citizenship_test_passed?: boolean
}

export type AustraliaState =
  | {
      kind: 'australia'
      op: 'contains'
      expected: AustraliaStateFilters
      count?: {
        min?: number // the minimum number of children that match the filters (similarity >= 1)
        max?: number // the maximum number of children that match the filters (similarity >= 1)
      }
    }
  | {
      kind: 'australia'
      op: 'citizenship_test_passed'
      expected: boolean
    }

export type AustraliaStateOutput =
  | {
      kind: 'australia'
      op: 'contains'
      children: {
        id: string
        filters: AustraliaStateFiltersOutput
        similarity: number
      }[]
      count?: {
        min?: number // the minimum number of children that match the filters (similarity >= 1)
        max?: number // the maximum number of children that match the filters (similarity >= 1)
        actual?: number // the actual number of children that match the filters (similarity >= 1)
      }
      similarity: number // the average of the similarity of the children. if count is set, the similarity is a boolean value (0 or 1), indicating if the number of children that match the filters is within the range
    }
  | {
      kind: 'australia'
      op: 'citizenship_test_passed'
      expected: boolean
      actual?: boolean
      similarity: number
    }

const applyFiltersToAssessedOccupations = (
  context: Context,
  filters: AustraliaStateFilters,
  assessedOccupations: AssessedOccupation[],
): {
  id: string
  filters: AustraliaStateFiltersOutput
  similarity: number
}[] => {
  if (Object.keys(filters).length === 0) {
    throw new Error('must specify at least one filter')
  }

  return assessedOccupations.map(item => {
    const filtersOutput: AustraliaStateFiltersOutput = {}

    if (filters.occupation_codes !== undefined) {
      if (!item.occupation_codes) {
        filtersOutput.occupation_codes = {
          expected: filters.occupation_codes,
          similarity: DEFAULT_AUSTRALIA_SIMILARITY,
        }
      } else {
        filtersOutput.occupation_codes = {
          expected: filters.occupation_codes,
          actual: item.occupation_codes,
          similarity: getOccupationCodesSimilarity(
            context.occupationClassificationCrosswalksData,
            filters.occupation_codes,
            item.occupation_codes,
          ),
        }
      }
    }

    const filterValues = Object.values(filtersOutput)
    const overallSimilarity = round2(
      filterValues.reduce((acc, filter) => acc + filter.similarity, 0) /
        filterValues.length,
    )

    return {
      id: item.id,
      filters: filtersOutput,
      similarity: overallSimilarity,
    }
  })
}

const getContainsOutput = (
  context: Context,
  state: Extract<AustraliaState, { op: 'contains' }>,
  stateInput: AustraliaStateInput,
): Extract<AustraliaStateOutput, { op: 'contains' }> => {
  if (
    !stateInput.assessed_occupations ||
    stateInput.assessed_occupations.length === 0
  ) {
    return {
      kind: 'australia',
      op: 'contains',
      children: [],
      count: state.count,
      similarity: DEFAULT_AUSTRALIA_SIMILARITY,
    }
  }

  const children = applyFiltersToAssessedOccupations(
    context,
    state.expected,
    stateInput.assessed_occupations,
  )

  // If count is specified, calculate count-based similarity
  if (state.count !== undefined) {
    const matchingChildrenCount = children.filter(
      child => child.similarity >= 1,
    ).length

    let countSatisfied = true

    if (
      state.count.min !== undefined &&
      matchingChildrenCount < state.count.min
    ) {
      countSatisfied = false
    }

    if (
      state.count.max !== undefined &&
      matchingChildrenCount > state.count.max
    ) {
      countSatisfied = false
    }

    return {
      kind: 'australia',
      op: 'contains',
      children,
      count: {
        min: state.count.min,
        max: state.count.max,
        actual: matchingChildrenCount,
      },
      similarity: getBooleanSimilarity(countSatisfied),
    }
  }

  return {
    kind: 'australia',
    op: 'contains',
    children,
    similarity: round2(
      children.reduce((acc, child) => acc + child.similarity, 0) /
        children.length,
    ),
  }
}

export const getAustraliaStateOutput = (
  context: Context,
  state: AustraliaState,
  stateInput: AustraliaStateInput,
): AustraliaStateOutput => {
  switch (state.op) {
    case 'citizenship_test_passed':
      return {
        kind: state.kind,
        op: state.op,
        expected: state.expected,
        actual: stateInput.citizenship_test_passed,
        similarity: stateInput.citizenship_test_passed
          ? getBooleanSimilarity(
              stateInput.citizenship_test_passed === state.expected,
            )
          : DEFAULT_AUSTRALIA_SIMILARITY,
      }
    case 'contains':
      return getContainsOutput(context, state, stateInput)
  }
}
