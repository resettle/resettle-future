import {
  EDUCATION_LEVEL_OPTIONS,
  type CountryAlpha2Code,
  type Duration,
  type EducationExperience,
  type EducationLevel,
} from '@resettle/schema'
import { round2 } from '@resettle/utils'

import type { Context } from '../types'
import { getDurationBetweenDates } from '../utils/date'
import {
  getBooleanSimilarity,
  getPercentageSimilarity,
} from '../utils/similarity'

export const DEFAULT_EDUCATION_EXPERIENCES_SIMILARITY = 0.2

export type EducationExperiencesStateFilters = {
  institution_id_in?: string[]
  institution_country_in?: CountryAlpha2Code[]
  max_completed_in?: Duration
  is_present?: boolean
  is_present_or_future?: boolean
  is_completed?: boolean
  is_remote?: boolean
  is_stem?: boolean
  min_highest_education_level?: EducationLevel
  min_duration?: Duration
  min_grade?: number
  min_qs_rank?: number
  min_arwu_rank?: number
  min_twur_rank?: number
  min_usnwr_rank?: number
}

export type EducationExperiencesStateFiltersOutput = {
  institution_id_in?: {
    expected: string[]
    actual?: string
    similarity: number
  }
  institution_country_in?: {
    expected: CountryAlpha2Code[]
    actual?: CountryAlpha2Code
    similarity: number
  }
  max_completed_in?: {
    expected: Duration
    actual?: Duration
    similarity: number
  }
  is_present?: {
    expected: boolean
    actual?: boolean
    similarity: number
  }
  is_present_or_future?: {
    expected: boolean
    actual?: boolean
    similarity: number
  }
  is_completed?: {
    expected: boolean
    actual?: boolean
    similarity: number
  }
  is_remote?: {
    expected: boolean
    actual?: boolean
    similarity: number
  }
  is_stem?: {
    expected: boolean
    actual?: boolean
    similarity: number
  }
  min_highest_education_level?: {
    expected: EducationLevel
    actual?: EducationLevel
    similarity: number
  }
  min_duration?: {
    expected: Duration
    actual?: Duration
    similarity: number
  }
  min_grade?: {
    expected: number
    actual?: number
    similarity: number
  }
  min_qs_rank?: {
    expected: number
    actual?: number
    similarity: number
  }
  min_arwu_rank?: {
    expected: number
    actual?: number
    similarity: number
  }
  min_twur_rank?: {
    expected: number
    actual?: number
    similarity: number
  }
  min_usnwr_rank?: {
    expected: number
    actual?: number
    similarity: number
  }
}

export type EducationExperiencesStateInput = {
  education_experiences?: EducationExperience[]
}

export type EducationExperiencesState =
  | {
      kind: 'education_experiences'
      op: 'contains'
      expected: EducationExperiencesStateFilters
      count?: {
        min?: number
        max?: number
      }
    }
  | {
      kind: 'education_experiences'
      op: 'not_contains'
      expected: EducationExperiencesStateFilters
    }
  | {
      kind: 'education_experiences'
      op: 'matches'
      expected: {
        filters?: EducationExperiencesStateFilters
        aggregation?: {
          min_sum_of_duration?: Duration
        }
      }
    }

export type EducationExperiencesStateOutput =
  | {
      kind: 'education_experiences'
      op: 'contains'
      children: {
        id: string
        filters: EducationExperiencesStateFiltersOutput
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
      kind: 'education_experiences'
      op: 'not_contains'
      children: {
        id: string
        filters: EducationExperiencesStateFiltersOutput
        similarity: number
      }[]
      similarity: number
    }
  | {
      kind: 'education_experiences'
      op: 'matches'
      children: {
        id: string
        filters: EducationExperiencesStateFiltersOutput
        similarity: number
      }[]
      aggregation: {
        min_sum_of_duration?: {
          expected: Duration
          actual?: Duration
          similarity: number
        }
      }
      similarity: number // the average of the similarity of the filters
    }

export const applyFiltersToEducationExperiences = (
  context: Context,
  filters: EducationExperiencesStateFilters,
  educationExperiences: EducationExperience[],
): {
  id: string
  filters: EducationExperiencesStateFiltersOutput
  similarity: number
}[] => {
  if (Object.keys(filters).length === 0) {
    throw new Error('must specify at least one filter')
  }

  const now = new Date()

  return educationExperiences.map(item => {
    const filtersOutput: EducationExperiencesStateFiltersOutput = {}

    if (filters.institution_id_in !== undefined) {
      filtersOutput.institution_id_in = {
        expected: filters.institution_id_in,
        actual: item.institution_id,
        similarity: item.institution_id
          ? getBooleanSimilarity(
              filters.institution_id_in.includes(item.institution_id),
            )
          : DEFAULT_EDUCATION_EXPERIENCES_SIMILARITY,
      }
    }

    if (filters.institution_country_in !== undefined) {
      filtersOutput.institution_country_in = {
        expected: filters.institution_country_in,
        actual: item.institution_country,
        similarity: item.institution_country
          ? getBooleanSimilarity(
              filters.institution_country_in.includes(item.institution_country),
            )
          : DEFAULT_EDUCATION_EXPERIENCES_SIMILARITY,
      }
    }

    if (filters.max_completed_in !== undefined) {
      const maxCompletedIn = item.end_date
        ? getDurationBetweenDates(
            {
              start_date: item.end_date,
              end_date: now,
            },
            filters.max_completed_in.unit,
          )
        : undefined

      filtersOutput.max_completed_in = {
        expected: filters.max_completed_in,
        actual: maxCompletedIn
          ? { unit: filters.max_completed_in.unit, value: maxCompletedIn }
          : undefined,
        similarity: maxCompletedIn
          ? getPercentageSimilarity(
              filters.max_completed_in.value,
              maxCompletedIn,
              '<=',
            )
          : DEFAULT_EDUCATION_EXPERIENCES_SIMILARITY,
      }
    }

    if (filters.is_present !== undefined) {
      if (!item.start_date) {
        filtersOutput.is_present = {
          expected: filters.is_present,
          similarity: DEFAULT_EDUCATION_EXPERIENCES_SIMILARITY,
        }
      } else {
        const isPresent = !item.end_date || item.end_date > now

        filtersOutput.is_present = {
          expected: filters.is_present,
          actual: isPresent,
          similarity: getBooleanSimilarity(filters.is_present === isPresent),
        }
      }
    }

    if (filters.is_present_or_future !== undefined) {
      if (!item.start_date) {
        filtersOutput.is_present_or_future = {
          expected: filters.is_present_or_future,
          similarity: DEFAULT_EDUCATION_EXPERIENCES_SIMILARITY,
        }
      } else {
        const isPresentOrFuture =
          !item.start_date ||
          item.start_date >= now ||
          !item.end_date ||
          item.end_date > now

        filtersOutput.is_present_or_future = {
          expected: filters.is_present_or_future,
          actual: isPresentOrFuture,
          similarity: getBooleanSimilarity(
            filters.is_present_or_future === isPresentOrFuture,
          ),
        }
      }
    }

    if (filters.is_completed !== undefined) {
      if (!item.start_date) {
        filtersOutput.is_completed = {
          expected: filters.is_completed,
          similarity: DEFAULT_EDUCATION_EXPERIENCES_SIMILARITY,
        }
      } else {
        const isCompleted = !!item.end_date && item.end_date <= now

        filtersOutput.is_completed = {
          expected: filters.is_completed,
          actual: isCompleted,
          similarity: getBooleanSimilarity(
            filters.is_completed === isCompleted,
          ),
        }
      }
    }

    if (filters.is_remote !== undefined) {
      filtersOutput.is_remote = {
        expected: filters.is_remote,
        actual: item.is_remote,
        similarity:
          item.is_remote !== undefined
            ? getBooleanSimilarity(filters.is_remote === item.is_remote)
            : DEFAULT_EDUCATION_EXPERIENCES_SIMILARITY,
      }
    }

    if (filters.is_stem !== undefined) {
      filtersOutput.is_stem = {
        expected: filters.is_stem,
        actual: item.is_stem,
        similarity: getBooleanSimilarity(filters.is_stem === item.is_stem),
      }
    }

    if (filters.min_highest_education_level !== undefined) {
      filtersOutput.min_highest_education_level = {
        expected: filters.min_highest_education_level,
        actual: item.level,
        similarity: item.level
          ? getBooleanSimilarity(
              EDUCATION_LEVEL_OPTIONS.indexOf(item.level) >=
                EDUCATION_LEVEL_OPTIONS.indexOf(
                  filters.min_highest_education_level,
                ),
            )
          : DEFAULT_EDUCATION_EXPERIENCES_SIMILARITY,
      }
    }

    if (filters.min_duration !== undefined) {
      if (!item.start_date) {
        filtersOutput.min_duration = {
          expected: filters.min_duration,
          similarity: DEFAULT_EDUCATION_EXPERIENCES_SIMILARITY,
        }
      } else {
        const actualDurationValue = getDurationBetweenDates(
          {
            start_date: item.start_date,
            end_date: item.end_date || now,
          },
          filters.min_duration.unit,
        )

        filtersOutput.min_duration = {
          expected: filters.min_duration,
          actual: {
            value: actualDurationValue,
            unit: filters.min_duration.unit,
          },
          similarity: getPercentageSimilarity(
            filters.min_duration.value,
            actualDurationValue,
          ),
        }
      }
    }

    if (filters.min_grade !== undefined) {
      if (!item.grade) {
        filtersOutput.min_grade = {
          expected: filters.min_grade,
          similarity: DEFAULT_EDUCATION_EXPERIENCES_SIMILARITY,
        }
      } else {
        filtersOutput.min_grade = {
          expected: filters.min_grade,
          actual: item.grade,
          similarity: getPercentageSimilarity(filters.min_grade, item.grade),
        }
      }
    }

    if (filters.min_qs_rank !== undefined) {
      if (!item.institution_name) {
        filtersOutput.min_qs_rank = {
          expected: filters.min_qs_rank,
          similarity: DEFAULT_EDUCATION_EXPERIENCES_SIMILARITY,
        }
      } else {
        const institution = item.institution_name
          ? context.institutionRankingsData.find(
              inst =>
                inst.name.toLowerCase() ===
                  item.institution_name!.toLowerCase() ||
                inst.id.toLowerCase() ===
                  item.institution_name!.toLowerCase().replace(/\s+/g, '-'),
            )
          : undefined

        const actualRank = institution?.qs

        filtersOutput.min_qs_rank = {
          expected: filters.min_qs_rank,
          actual: actualRank || undefined,
          similarity: getBooleanSimilarity(
            actualRank !== null &&
              actualRank !== undefined &&
              actualRank <= filters.min_qs_rank,
          ),
        }
      }
    }

    if (filters.min_arwu_rank !== undefined) {
      if (!item.institution_name) {
        filtersOutput.min_arwu_rank = {
          expected: filters.min_arwu_rank,
          similarity: DEFAULT_EDUCATION_EXPERIENCES_SIMILARITY,
        }
      } else {
        const institution = item.institution_name
          ? context.institutionRankingsData.find(
              inst =>
                inst.name.toLowerCase() ===
                  item.institution_name!.toLowerCase() ||
                inst.id.toLowerCase() ===
                  item.institution_name!.toLowerCase().replace(/\s+/g, '-'),
            )
          : undefined

        const actualRank = institution?.arwu

        filtersOutput.min_arwu_rank = {
          expected: filters.min_arwu_rank,
          actual: actualRank || undefined,
          similarity: getBooleanSimilarity(
            actualRank !== null &&
              actualRank !== undefined &&
              actualRank <= filters.min_arwu_rank,
          ),
        }
      }
    }

    if (filters.min_twur_rank !== undefined) {
      if (!item.institution_name) {
        filtersOutput.min_twur_rank = {
          expected: filters.min_twur_rank,
          similarity: DEFAULT_EDUCATION_EXPERIENCES_SIMILARITY,
        }
      } else {
        const institution = item.institution_name
          ? context.institutionRankingsData.find(
              inst =>
                inst.name.toLowerCase() ===
                  item.institution_name!.toLowerCase() ||
                inst.id.toLowerCase() ===
                  item.institution_name!.toLowerCase().replace(/\s+/g, '-'),
            )
          : undefined

        const actualRank = institution?.twur

        filtersOutput.min_twur_rank = {
          expected: filters.min_twur_rank,
          actual: actualRank || undefined,
          similarity: getBooleanSimilarity(
            actualRank !== null &&
              actualRank !== undefined &&
              actualRank <= filters.min_twur_rank,
          ),
        }
      }
    }

    if (filters.min_usnwr_rank !== undefined) {
      if (!item.institution_name) {
        filtersOutput.min_usnwr_rank = {
          expected: filters.min_usnwr_rank,
          similarity: DEFAULT_EDUCATION_EXPERIENCES_SIMILARITY,
        }
      } else {
        const institution = item.institution_name
          ? context.institutionRankingsData.find(
              inst =>
                inst.name.toLowerCase() ===
                  item.institution_name!.toLowerCase() ||
                inst.id.toLowerCase() ===
                  item.institution_name!.toLowerCase().replace(/\s+/g, '-'),
            )
          : undefined

        const actualRank = institution?.usnwr

        filtersOutput.min_usnwr_rank = {
          expected: filters.min_usnwr_rank,
          actual: actualRank || undefined,
          similarity: getBooleanSimilarity(
            actualRank !== null &&
              actualRank !== undefined &&
              actualRank <= filters.min_usnwr_rank,
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

const getContainsLikeOutput = (
  context: Context,
  state: Extract<
    EducationExperiencesState,
    { op: 'contains' | 'not_contains' }
  >,
  stateInput: EducationExperiencesStateInput,
): Extract<
  EducationExperiencesStateOutput,
  { op: 'contains' | 'not_contains' }
> => {
  if (!stateInput.education_experiences) {
    if (state.op === 'contains') {
      return {
        kind: 'education_experiences',
        op: state.op,
        children: [],
        count: state.count,
        similarity: 0,
      }
    }

    return {
      kind: 'education_experiences',
      op: state.op,
      children: [],
      similarity: 1,
    }
  }

  const children = applyFiltersToEducationExperiences(
    context,
    state.expected,
    stateInput.education_experiences,
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
      kind: 'education_experiences',
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
    kind: 'education_experiences',
    op: 'contains',
    children,
    similarity:
      state.op === 'contains' ? overallSimilarity : 1 - overallSimilarity,
  }
}

const getMatchesOutput = (
  context: Context,
  state: Extract<EducationExperiencesState, { op: 'matches' }>,
  stateInput: EducationExperiencesStateInput,
): Extract<EducationExperiencesStateOutput, { op: 'matches' }> => {
  if (
    state.expected.aggregation === undefined ||
    Object.keys(state.expected.aggregation).length === 0
  ) {
    throw new Error('must specify at least one aggregation')
  }

  if (
    !stateInput.education_experiences ||
    stateInput.education_experiences.length === 0
  ) {
    return {
      kind: 'education_experiences',
      op: 'matches',
      children: [],
      aggregation: {
        min_sum_of_duration: state.expected.aggregation?.min_sum_of_duration
          ? {
              expected: state.expected.aggregation.min_sum_of_duration,
              similarity: DEFAULT_EDUCATION_EXPERIENCES_SIMILARITY,
            }
          : undefined,
      },
      similarity: DEFAULT_EDUCATION_EXPERIENCES_SIMILARITY,
    }
  }

  // First, apply filters to get similarity of all education experiences
  const allChildren =
    state.expected.filters && Object.keys(state.expected.filters).length > 0
      ? applyFiltersToEducationExperiences(
          context,
          state.expected.filters,
          stateInput.education_experiences,
        )
      : stateInput.education_experiences.map(item => ({
          id: item.id,
          filters: {},
          similarity: 1, // No filters means all experiences match
        }))

  // Only consider education experiences with similarity >= 1 for aggregation
  const matchingEducationExperiences = stateInput.education_experiences.filter(
    (_, index) => allChildren[index].similarity >= 1,
  )

  // Calculate aggregation results
  const aggregation: Extract<
    EducationExperiencesStateOutput,
    { op: 'matches' }
  >['aggregation'] = {}

  if (state.expected.aggregation?.min_sum_of_duration) {
    const expectedDuration = state.expected.aggregation.min_sum_of_duration

    const experiences = matchingEducationExperiences
      .map(exp => ({
        start_date: exp.start_date ? new Date(exp.start_date) : null,
        end_date: exp.end_date ? new Date(exp.end_date) : new Date(),
      }))
      .filter(
        (exp): exp is { start_date: Date; end_date: Date } =>
          exp.start_date !== null,
      )
      .sort((a, b) => a.start_date.getTime() - b.start_date.getTime())

    if (experiences.length > 0) {
      const mergedIntervals: { start_date: Date; end_date: Date }[] = [
        {
          start_date: experiences[0].start_date,
          end_date: experiences[0].end_date,
        },
      ]

      for (let i = 1; i < experiences.length; i++) {
        const last = mergedIntervals[mergedIntervals.length - 1]
        const current = experiences[i]

        if (current.start_date <= last.end_date) {
          if (current.end_date > last.end_date) {
            last.end_date = current.end_date
          }
        } else {
          mergedIntervals.push({
            start_date: current.start_date,
            end_date: current.end_date,
          })
        }
      }

      const actualUnit = expectedDuration.unit
      const actualDurationValue = mergedIntervals.reduce(
        (acc, interval) => acc + getDurationBetweenDates(interval, actualUnit),
        0,
      )

      aggregation.min_sum_of_duration = {
        expected: expectedDuration,
        actual: {
          value: actualDurationValue,
          unit: actualUnit,
        },
        similarity: getPercentageSimilarity(
          expectedDuration.value,
          actualDurationValue,
        ),
      }
    } else {
      aggregation.min_sum_of_duration = {
        expected: expectedDuration,
        actual: {
          value: 0,
          unit: expectedDuration.unit,
        },
        similarity: 0,
      }
    }
  }

  // Calculate overall similarity based on aggregation results
  const aggregationValues = Object.values(aggregation)
  const aggregationSimilarity = round2(
    aggregationValues.reduce((acc, agg) => acc + (agg?.similarity || 0), 0) /
      aggregationValues.length,
  )

  return {
    kind: 'education_experiences',
    op: 'matches',
    children: allChildren,
    aggregation,
    similarity: aggregationSimilarity,
  }
}

export const getEducationExperiencesStateOutput = (
  context: Context,
  state: EducationExperiencesState,
  stateInput: EducationExperiencesStateInput,
): EducationExperiencesStateOutput => {
  switch (state.op) {
    case 'contains':
    case 'not_contains':
      return getContainsLikeOutput(context, state, stateInput)
    case 'matches':
      return getMatchesOutput(context, state, stateInput)
  }
}
