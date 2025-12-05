import {
  type CountryAlpha2Code,
  type FamilyMember,
  type FamilyMemberType,
} from '@resettle/schema'
import { round2 } from '@resettle/utils'

import type { Context } from '../types'
import { getBooleanSimilarity } from '../utils/similarity'
import {
  applyFiltersToEducationExperiences,
  type EducationExperiencesStateFilters,
  type EducationExperiencesStateFiltersOutput,
} from './education-experiences'
import {
  applyFiltersToWorkExperiences,
  type WorkExperiencesStateFilters,
  type WorkExperiencesStateFiltersOutput,
} from './work-experiences'

export const DEFAULT_FAMILY_MEMBERS_SIMILARITY = 0.5

type FamilyMembersStateFilters = {
  citizenship_in?: CountryAlpha2Code[]
  permanent_residency_in?: CountryAlpha2Code[]
  country_of_birth_in?: CountryAlpha2Code[]
  type_in?: FamilyMemberType[]
  min_age?: number
  max_age?: number

  education_experiences?: EducationExperiencesStateFilters
  work_experiences?: WorkExperiencesStateFilters
}

type FamilyMembersStateFiltersOutput = {
  citizenship_in?: {
    expected: CountryAlpha2Code[]
    actual?: CountryAlpha2Code[]
    similarity: number
  }
  permanent_residency_in?: {
    expected: CountryAlpha2Code[]
    actual?: CountryAlpha2Code[]
    similarity: number
  }
  country_of_birth_in?: {
    expected: CountryAlpha2Code[]
    actual?: CountryAlpha2Code
    similarity: number
  }
  type_in?: {
    expected: FamilyMemberType[]
    actual?: FamilyMemberType
    similarity: number
  }
  min_age?: {
    expected: number
    actual?: number
    similarity: number
  }
  max_age?: {
    expected: number
    actual?: number
    similarity: number
  }

  education_experiences?: EducationExperiencesStateFiltersOutput[]
  work_experiences?: WorkExperiencesStateFiltersOutput[]
}

export type FamilyMembersStateInput = {
  family_members?: FamilyMember[]
}

export type FamilyMembersState =
  | {
      kind: 'family_members'
      op: 'exists'
      expected: boolean
    }
  | {
      kind: 'family_members'
      op: '<='
      expected: number
    }
  | {
      kind: 'family_members'
      op: 'contains'
      expected: FamilyMembersStateFilters
      count?: {
        min?: number
        max?: number
      }
    }
  | {
      kind: 'family_members'
      op: 'not_contains'
      expected: FamilyMembersStateFilters
    }

export type FamilyMembersStateOutput =
  | {
      kind: 'family_members'
      op: 'exists'
      expected: boolean
      actual?: boolean
      similarity: number
    }
  | {
      kind: 'family_members'
      op: '<='
      expected: number
      actual?: number
      similarity: number
    }
  | {
      kind: 'family_members'
      op: 'contains'
      children: {
        id: string
        filters: FamilyMembersStateFiltersOutput
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
      kind: 'family_members'
      op: 'not_contains'
      children: {
        id: string
        filters: FamilyMembersStateFiltersOutput
        similarity: number
      }[]
      similarity: number
    }

const applyFiltersToFamilyMembers = (
  context: Context,
  filters: FamilyMembersStateFilters,
  family_members: FamilyMember[],
): {
  id: string
  filters: FamilyMembersStateFiltersOutput
  similarity: number
}[] => {
  if (Object.keys(filters).length === 0) {
    throw new Error('must specify at least one filter')
  }

  return family_members.map(item => {
    const filtersOutput: FamilyMembersStateFiltersOutput = {}

    const age = item.date_of_birth
      ? Math.floor(
          (Date.now() - item.date_of_birth.getTime()) /
            (365.25 * 24 * 60 * 60 * 1000),
        )
      : undefined

    if (filters.citizenship_in !== undefined) {
      filtersOutput.citizenship_in = {
        expected: filters.citizenship_in,
        actual: item.citizenship,
        similarity: item.citizenship
          ? getBooleanSimilarity(
              filters.citizenship_in.some(country =>
                item.citizenship!.includes(country),
              ),
            )
          : DEFAULT_FAMILY_MEMBERS_SIMILARITY,
      }
    }

    if (filters.permanent_residency_in !== undefined) {
      filtersOutput.permanent_residency_in = {
        expected: filters.permanent_residency_in,
        actual: item.permanent_residency,
        similarity: item.permanent_residency
          ? getBooleanSimilarity(
              filters.permanent_residency_in.some(country =>
                item.permanent_residency!.includes(country),
              ),
            )
          : DEFAULT_FAMILY_MEMBERS_SIMILARITY,
      }
    }

    if (filters.country_of_birth_in !== undefined) {
      filtersOutput.country_of_birth_in = {
        expected: filters.country_of_birth_in,
        actual: item.country_of_birth,
        similarity: item.country_of_birth
          ? getBooleanSimilarity(
              filters.country_of_birth_in.some(
                country => item.country_of_birth === country,
              ),
            )
          : DEFAULT_FAMILY_MEMBERS_SIMILARITY,
      }
    }

    if (filters.type_in !== undefined) {
      filtersOutput.type_in = {
        expected: filters.type_in,
        actual: item.type,
        similarity: item.type
          ? getBooleanSimilarity(filters.type_in.includes(item.type))
          : DEFAULT_FAMILY_MEMBERS_SIMILARITY,
      }
    }

    if (filters.min_age !== undefined) {
      filtersOutput.min_age = {
        expected: filters.min_age,
        actual: age,
        similarity: age
          ? getBooleanSimilarity(age >= filters.min_age)
          : DEFAULT_FAMILY_MEMBERS_SIMILARITY,
      }
    }

    if (filters.max_age !== undefined) {
      filtersOutput.max_age = {
        expected: filters.max_age,
        actual: age,
        similarity: age
          ? getBooleanSimilarity(age <= filters.max_age)
          : DEFAULT_FAMILY_MEMBERS_SIMILARITY,
      }
    }

    if (filters.education_experiences !== undefined) {
      const allOutputs = applyFiltersToEducationExperiences(
        context,
        filters.education_experiences,
        item.education_experiences ?? [],
      )
      filtersOutput.education_experiences = allOutputs.map(o => o.filters)
    }

    if (filters.work_experiences !== undefined) {
      const allOutputs = applyFiltersToWorkExperiences(
        context,
        filters.work_experiences,
        item.work_experiences ?? [],
        {
          education_experiences: item.education_experiences,
          work_experiences: item.work_experiences,
        },
      )
      filtersOutput.work_experiences = allOutputs.map(o => o.filters)
    }

    const filterValues = Object.values(filtersOutput)
    const overallSimilarity = round2(
      filterValues.reduce(
        (acc, filter) =>
          acc +
          (Array.isArray(filter)
            ? filter
                .map(f => {
                  const subValues = Object.values(f)
                  return round2(
                    subValues.reduce(
                      (acc, filter) => acc + filter.similarity,
                      0,
                    ),
                  )
                })
                .reduce((p, v) => p + v, 0)
            : filter.similarity),
        0,
      ) / filterValues.length,
    )

    return {
      id: item.id,
      filters: filtersOutput,
      similarity: overallSimilarity,
    }
  })
}

const getContainsLikeOutput = (
  context: Context,
  state: Extract<FamilyMembersState, { op: 'contains' | 'not_contains' }>,
  stateInput: FamilyMembersStateInput,
): Extract<FamilyMembersStateOutput, { op: 'contains' | 'not_contains' }> => {
  if (!stateInput.family_members) {
    if (state.op === 'contains') {
      return {
        kind: 'family_members',
        op: state.op,
        children: [],
        count: state.count,
        similarity: 0,
      }
    }

    return {
      kind: 'family_members',
      op: state.op,
      children: [],
      similarity: 1,
    }
  }

  const children = applyFiltersToFamilyMembers(
    context,
    state.expected,
    stateInput.family_members,
  )

  // If count is specified, calculate count-based similarity
  if (state.op === 'contains' && state.count !== undefined) {
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
      kind: 'family_members',
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

  const overallSimilarity =
    children.length > 0
      ? round2(
          children.reduce((acc, child) => acc + child.similarity, 0) /
            children.length,
        )
      : 0

  return {
    kind: 'family_members',
    op: state.op,
    children,
    similarity:
      state.op === 'contains' ? overallSimilarity : 1 - overallSimilarity,
  }
}

export const getFamilyMembersStateOutput = (
  context: Context,
  state: FamilyMembersState,
  stateInput: FamilyMembersStateInput,
): FamilyMembersStateOutput => {
  switch (state.op) {
    case 'exists':
      return {
        kind: 'family_members',
        op: 'exists',
        expected: state.expected,
        actual: stateInput.family_members
          ? stateInput.family_members.length > 0
          : undefined,
        similarity: getBooleanSimilarity(
          !state.expected ||
            !!(
              stateInput.family_members && stateInput.family_members.length > 0
            ),
        ), // Since "exists" is a helper state, we can use the boolean similarity directly, no matter if the family members are defined or not
      }
    case '<=':
      return {
        kind: 'family_members',
        op: '<=',
        expected: state.expected,
        actual: stateInput.family_members
          ? stateInput.family_members.length
          : undefined,
        similarity: stateInput.family_members
          ? getBooleanSimilarity(
              stateInput.family_members.length <= state.expected,
            )
          : 1, // If the family members are not defined, we assume that the number of family members is 0, so the similarity is 1
      }
    case 'contains':
    case 'not_contains':
      return getContainsLikeOutput(context, state, stateInput)
  }
}
