import {
  type CountryAlpha2Code,
  type Duration,
  type EducationExperience,
  type EmploymentType,
  type Monetary,
  type OccupationCodes,
  type WorkExperience,
} from '@resettle/schema'
import { round2 } from '@resettle/utils'

import type { Ref } from '../refs'
import type { Context } from '../types'
import { convertCurrency } from '../utils/currency'
import {
  getDurationBetweenDates,
  subtractDurationFromDate,
} from '../utils/date'
import {
  getOccupationCodesSimilarity,
  type OccupationCodesFilter,
} from '../utils/occupation'
import {
  getBooleanSimilarity,
  getDateSimilarity,
  getMonetarySimilarity,
  getPercentageSimilarity,
} from '../utils/similarity'

export const DEFAULT_WORK_EXPERIENCES_SIMILARITY = 0.2

export type WorkExperiencesStateFilters = {
  employment_type_in?: EmploymentType[]
  employer_country_in?: CountryAlpha2Code[]
  employer_country_not_in?: CountryAlpha2Code[]
  occupation_codes?: OccupationCodesFilter
  min_duration?: Duration
  min_annual_salary?: Monetary
  min_monthly_salary?: Monetary
  starts_before?: string | { $ref: Ref }
  starts_after?: string | { $ref: Ref }
  ends_before?: string | { $ref: Ref }
  ends_after?: string | { $ref: Ref }
  min_fortune_global_rank?: number
  is_present_or_completed_in?: Duration
  is_present?: boolean
  is_present_or_future?: boolean
  is_completed?: boolean
  is_remote?: boolean
}

export type WorkExperiencesStateFiltersOutput = {
  employment_type_in?: {
    expected: EmploymentType[]
    actual?: EmploymentType
    similarity: number
  }
  employer_country_in?: {
    expected: CountryAlpha2Code[]
    actual?: CountryAlpha2Code
    similarity: number
  }
  employer_country_not_in?: {
    expected: CountryAlpha2Code[]
    actual?: CountryAlpha2Code
    similarity: number
  }
  occupation_codes?: {
    expected: OccupationCodesFilter
    actual?: OccupationCodes
    similarity: number
  }
  min_duration?: {
    expected: Duration
    actual?: Duration
    similarity: number
  }
  min_annual_salary?: {
    expected: Monetary
    actual?: Monetary
    similarity: number
  }
  min_monthly_salary?: {
    expected: Monetary
    actual?: Monetary
    similarity: number
  }
  starts_before?: {
    expected: string
    actual?: string | null
    similarity: number
  }
  starts_after?: {
    expected: string
    actual?: string | null
    similarity: number
  }
  ends_before?: {
    expected: string
    actual?: string | null
    similarity: number
  }
  ends_after?: {
    expected: string
    actual?: string | null
    similarity: number
  }
  min_fortune_global_rank?: {
    expected: number
    actual?: number
    similarity: number
  }
  is_present_or_completed_in?: {
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
}

export type WorkExperiencesStateInput = {
  education_experiences?: EducationExperience[]
  work_experiences?: WorkExperience[]
}

export type WorkExperiencesState =
  | {
      kind: 'work_experiences'
      op: 'contains'
      expected: WorkExperiencesStateFilters
      count?: {
        min?: number // the minimum number of children that match the filters (similarity >= 1)
        max?: number // the maximum number of children that match the filters (similarity >= 1)
      }
    }
  | {
      kind: 'work_experiences'
      op: 'not_contains'
      expected: WorkExperiencesStateFilters
    }
  | {
      kind: 'work_experiences'
      op: 'matches'
      expected: {
        filters?: WorkExperiencesStateFilters
        aggregation?: {
          min_sum_of_duration?: Duration // do not double count overlapping durations
          min_sum_of_monthly_salary?: {
            duration?: Duration
          } & Monetary
          min_sum_of_annual_salary?: {
            duration?: Duration
          } & Monetary
        }
      }
    }

export type WorkExperiencesStateOutput =
  | {
      kind: 'work_experiences'
      op: 'contains'
      children: {
        id: string
        filters: WorkExperiencesStateFiltersOutput
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
      kind: 'work_experiences'
      op: 'not_contains'
      children: {
        id: string
        filters: WorkExperiencesStateFiltersOutput
        similarity: number
      }[]
      similarity: number
    }
  | {
      kind: 'work_experiences'
      op: 'matches'
      children: {
        id: string
        filters: WorkExperiencesStateFiltersOutput
        similarity: number
      }[]
      aggregation: {
        min_sum_of_duration?: {
          expected: Duration
          actual?: Duration
          similarity: number
        }
        min_sum_of_monthly_salary?: {
          expected: { duration?: Duration } & Monetary
          actual?: { duration?: Duration } & Monetary
          similarity: number
        }
        min_sum_of_annual_salary?: {
          expected: { duration?: Duration } & Monetary
          actual?: { duration?: Duration } & Monetary
          similarity: number
        }
      }
      similarity: number // the average of the similarity of the aggregation
    }

export const applyFiltersToWorkExperiences = (
  context: Context,
  filters: WorkExperiencesStateFilters,
  workExperiences: WorkExperience[],
  stateInput: WorkExperiencesStateInput,
): {
  id: string
  filters: WorkExperiencesStateFiltersOutput
  similarity: number
}[] => {
  if (Object.keys(filters).length === 0) {
    throw new Error('must specify at least one filter')
  }

  const now = new Date()

  return workExperiences.map(item => {
    const filtersOutput: WorkExperiencesStateFiltersOutput = {}

    if (filters.employment_type_in !== undefined) {
      filtersOutput.employment_type_in = {
        expected: filters.employment_type_in,
        actual: item.employment_type,
        similarity: item.employment_type
          ? getBooleanSimilarity(
              filters.employment_type_in.includes(item.employment_type),
            )
          : DEFAULT_WORK_EXPERIENCES_SIMILARITY,
      }
    }

    if (filters.employer_country_in !== undefined) {
      filtersOutput.employer_country_in = {
        expected: filters.employer_country_in,
        actual: item.employer_country,
        similarity: item.employer_country
          ? getBooleanSimilarity(
              filters.employer_country_in.includes(item.employer_country),
            )
          : DEFAULT_WORK_EXPERIENCES_SIMILARITY,
      }
    }

    if (filters.employer_country_not_in !== undefined) {
      filtersOutput.employer_country_not_in = {
        expected: filters.employer_country_not_in,
        actual: item.employer_country,
        similarity: item.employer_country
          ? getBooleanSimilarity(
              !filters.employer_country_not_in.includes(item.employer_country),
            )
          : DEFAULT_WORK_EXPERIENCES_SIMILARITY,
      }
    }

    if (filters.occupation_codes !== undefined) {
      if (!item.occupation_codes) {
        filtersOutput.occupation_codes = {
          expected: filters.occupation_codes,
          similarity: DEFAULT_WORK_EXPERIENCES_SIMILARITY,
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

    if (filters.min_duration !== undefined) {
      if (!item.start_date) {
        filtersOutput.min_duration = {
          expected: filters.min_duration,
          similarity: DEFAULT_WORK_EXPERIENCES_SIMILARITY,
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

    if (filters.min_annual_salary !== undefined) {
      const realFixedAnnualSalary = item.fixed_annual_salary
        ? item.fixed_annual_salary
        : item.fixed_monthly_salary
          ? {
              amount: item.fixed_monthly_salary.amount * 12,
              currency: item.fixed_monthly_salary.currency,
            }
          : undefined
      filtersOutput.min_annual_salary = {
        expected: filters.min_annual_salary,
        actual: realFixedAnnualSalary,
        similarity: realFixedAnnualSalary
          ? getMonetarySimilarity(
              filters.min_annual_salary,
              realFixedAnnualSalary,
              context.exchangeRatesData,
            )
          : DEFAULT_WORK_EXPERIENCES_SIMILARITY,
      }
    }

    if (filters.min_monthly_salary !== undefined) {
      const realFixedMonthlySalary = item.fixed_monthly_salary
        ? item.fixed_monthly_salary
        : item.fixed_annual_salary
          ? {
              amount: item.fixed_annual_salary.amount / 12,
              currency: item.fixed_annual_salary.currency,
            }
          : undefined
      filtersOutput.min_monthly_salary = {
        expected: filters.min_monthly_salary,
        actual: realFixedMonthlySalary,
        similarity: realFixedMonthlySalary
          ? getMonetarySimilarity(
              filters.min_monthly_salary,
              realFixedMonthlySalary,
              context.exchangeRatesData,
            )
          : DEFAULT_WORK_EXPERIENCES_SIMILARITY,
      }
    }

    if (filters.starts_before !== undefined) {
      const startsBefore =
        typeof filters.starts_before === 'string'
          ? new Date(filters.starts_before)
          : context.getRefValue<Date>(filters.starts_before.$ref, stateInput)

      if (startsBefore) {
        filtersOutput.starts_before = {
          expected: startsBefore.toISOString(),
          actual: item.start_date ? item.start_date.toISOString() : null,
          similarity: item.start_date
            ? getDateSimilarity(startsBefore, item.start_date, '<')
            : DEFAULT_WORK_EXPERIENCES_SIMILARITY,
        }
      }
    }

    if (filters.starts_after !== undefined) {
      const startsAfter =
        typeof filters.starts_after === 'string'
          ? new Date(filters.starts_after)
          : context.getRefValue<Date>(filters.starts_after.$ref, stateInput)

      if (startsAfter) {
        filtersOutput.starts_after = {
          expected: startsAfter.toISOString(),
          actual: item.start_date ? item.start_date.toISOString() : null,
          similarity: item.start_date
            ? getDateSimilarity(startsAfter, item.start_date, '>')
            : DEFAULT_WORK_EXPERIENCES_SIMILARITY,
        }
      }
    }

    if (filters.ends_before !== undefined) {
      const endsBefore =
        typeof filters.ends_before === 'string'
          ? new Date(filters.ends_before)
          : context.getRefValue<Date>(filters.ends_before.$ref, stateInput)

      if (endsBefore) {
        filtersOutput.ends_before = {
          expected: endsBefore.toISOString(),
          actual: item.end_date ? item.end_date.toISOString() : null,
          similarity: item.end_date
            ? getDateSimilarity(endsBefore, item.end_date, '<')
            : DEFAULT_WORK_EXPERIENCES_SIMILARITY,
        }
      }
    }

    if (filters.ends_after !== undefined) {
      const endsAfter =
        typeof filters.ends_after === 'string'
          ? new Date(filters.ends_after)
          : context.getRefValue<Date>(filters.ends_after.$ref, stateInput)

      if (endsAfter) {
        filtersOutput.ends_after = {
          expected: endsAfter.toISOString(),
          actual: item.end_date ? item.end_date.toISOString() : null,
          similarity: item.end_date
            ? getDateSimilarity(endsAfter, item.end_date, '>')
            : DEFAULT_WORK_EXPERIENCES_SIMILARITY,
        }
      }
    }

    if (filters.min_fortune_global_rank !== undefined) {
      if (!item.employer_name) {
        filtersOutput.min_fortune_global_rank = {
          expected: filters.min_fortune_global_rank,
          similarity: DEFAULT_WORK_EXPERIENCES_SIMILARITY,
        }
      } else {
        const institution = item.employer_name
          ? context.fortuneGlobal500Data.find(
              emp =>
                emp.company.toLowerCase() === item.employer_name!.toLowerCase(),
            )
          : undefined

        const actualRank = institution?.rank

        filtersOutput.min_fortune_global_rank = {
          expected: filters.min_fortune_global_rank,
          actual: actualRank || undefined,
          similarity: getBooleanSimilarity(
            actualRank !== null &&
              actualRank !== undefined &&
              actualRank <= filters.min_fortune_global_rank,
          ),
        }
      }
    }

    if (filters.is_present_or_completed_in !== undefined) {
      const maxCompletedIn = item.end_date
        ? getDurationBetweenDates(
            {
              start_date: item.end_date,
              end_date: now,
            },
            filters.is_present_or_completed_in.unit,
          )
        : 0

      filtersOutput.is_present_or_completed_in = {
        expected: filters.is_present_or_completed_in,
        actual:
          maxCompletedIn !== undefined
            ? {
                unit: filters.is_present_or_completed_in.unit,
                value: maxCompletedIn,
              }
            : undefined,
        similarity:
          maxCompletedIn !== undefined
            ? getPercentageSimilarity(
                filters.is_present_or_completed_in.value,
                maxCompletedIn,
                '<=',
              )
            : DEFAULT_WORK_EXPERIENCES_SIMILARITY,
      }
    }

    if (filters.is_present !== undefined) {
      const isPresent = !item.end_date || item.end_date > now

      filtersOutput.is_present = {
        expected: filters.is_present,
        actual: isPresent,
        similarity: getBooleanSimilarity(filters.is_present === isPresent),
      }
    }

    if (filters.is_present_or_future !== undefined) {
      const isPresentOrFuture = !item.start_date || item.start_date <= now

      filtersOutput.is_present_or_future = {
        expected: filters.is_present_or_future,
        actual: isPresentOrFuture,
        similarity: getBooleanSimilarity(
          filters.is_present_or_future === isPresentOrFuture,
        ),
      }
    }

    if (filters.is_completed !== undefined) {
      const isCompleted = Boolean(item.end_date && item.end_date <= now)

      filtersOutput.is_completed = {
        expected: filters.is_completed,
        actual: isCompleted,
        similarity: getBooleanSimilarity(filters.is_completed === isCompleted),
      }
    }

    if (filters.is_remote !== undefined) {
      filtersOutput.is_remote = {
        expected: filters.is_remote,
        actual: item.is_remote,
        similarity:
          item.is_remote !== undefined
            ? getBooleanSimilarity(filters.is_remote === item.is_remote)
            : DEFAULT_WORK_EXPERIENCES_SIMILARITY,
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
  state: Extract<WorkExperiencesState, { op: 'contains' | 'not_contains' }>,
  stateInput: WorkExperiencesStateInput,
): Extract<WorkExperiencesStateOutput, { op: 'contains' | 'not_contains' }> => {
  if (!stateInput.work_experiences) {
    if (state.op === 'contains') {
      return {
        kind: 'work_experiences',
        op: state.op,
        children: [],
        count: state.count,
        similarity: 0,
      }
    }

    return {
      kind: 'work_experiences',
      op: state.op,
      children: [],
      similarity: 1,
    }
  }

  const children = applyFiltersToWorkExperiences(
    context,
    state.expected,
    stateInput.work_experiences,
    stateInput,
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
      kind: 'work_experiences',
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
    kind: 'work_experiences',
    op: state.op,
    children,
    similarity:
      state.op === 'contains' ? overallSimilarity : 1 - overallSimilarity,
  }
}

const getMatchesOutput = (
  context: Context,
  state: Extract<WorkExperiencesState, { op: 'matches' }>,
  stateInput: WorkExperiencesStateInput,
): Extract<WorkExperiencesStateOutput, { op: 'matches' }> => {
  if (
    state.expected.aggregation === undefined ||
    Object.keys(state.expected.aggregation).length === 0
  ) {
    throw new Error('must specify at least one aggregation')
  }

  if (
    !stateInput.work_experiences ||
    stateInput.work_experiences.length === 0
  ) {
    return {
      kind: 'work_experiences',
      op: 'matches',
      children: [],
      aggregation: {
        min_sum_of_duration: state.expected.aggregation?.min_sum_of_duration
          ? {
              expected: state.expected.aggregation.min_sum_of_duration,
              similarity: DEFAULT_WORK_EXPERIENCES_SIMILARITY,
            }
          : undefined,
        min_sum_of_monthly_salary: state.expected.aggregation
          ?.min_sum_of_monthly_salary
          ? {
              expected: state.expected.aggregation.min_sum_of_monthly_salary,
              similarity: DEFAULT_WORK_EXPERIENCES_SIMILARITY,
            }
          : undefined,
        min_sum_of_annual_salary: state.expected.aggregation
          ?.min_sum_of_annual_salary
          ? {
              expected: state.expected.aggregation.min_sum_of_annual_salary,
              similarity: DEFAULT_WORK_EXPERIENCES_SIMILARITY,
            }
          : undefined,
      },
      similarity: DEFAULT_WORK_EXPERIENCES_SIMILARITY,
    }
  }

  // First, apply filters to get similarity of all work experiences
  const allChildren =
    state.expected.filters && Object.keys(state.expected.filters).length > 0
      ? applyFiltersToWorkExperiences(
          context,
          state.expected.filters,
          stateInput.work_experiences,
          stateInput,
        )
      : stateInput.work_experiences.map(item => ({
          id: item.id,
          filters: {},
          similarity: 1, // No filters means all experiences match
        }))

  // Only consider work experiences with similarity >= 1 for aggregation
  const matchingChildren = allChildren.filter(child => child.similarity >= 1)
  const matchingWorkExperiences = stateInput.work_experiences.filter(exp =>
    matchingChildren.some(child => child.id === exp.id),
  )

  // Calculate aggregation results
  const aggregation: Extract<
    WorkExperiencesStateOutput,
    { op: 'matches' }
  >['aggregation'] = {}

  if (state.expected.aggregation?.min_sum_of_duration) {
    const expectedDuration = state.expected.aggregation.min_sum_of_duration

    const experiences = matchingWorkExperiences
      .map(exp => ({
        id: exp.id,
        start_date: exp.start_date ? new Date(exp.start_date) : null,
        end_date: exp.end_date ? new Date(exp.end_date) : new Date(),
      }))
      .filter(
        (exp): exp is { id: string; start_date: Date; end_date: Date } =>
          exp.start_date !== null,
      )
      .sort((a, b) => a.start_date.getTime() - b.start_date.getTime())

    if (experiences.length > 0) {
      // Merge overlapping intervals to avoid double counting
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

      const actualDurationValue = mergedIntervals.reduce(
        (acc, interval) =>
          acc + getDurationBetweenDates(interval, expectedDuration.unit),
        0,
      )

      aggregation.min_sum_of_duration = {
        expected: expectedDuration,
        actual: {
          value: actualDurationValue,
          unit: expectedDuration.unit,
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

  if (state.expected.aggregation?.min_sum_of_monthly_salary) {
    const expectedSalary = state.expected.aggregation.min_sum_of_monthly_salary

    // Filter work experiences based on duration if specified
    let relevantExperiences = matchingWorkExperiences

    if (expectedSalary.duration) {
      const cutoffDate = subtractDurationFromDate(
        new Date(),
        expectedSalary.duration,
      )

      relevantExperiences = matchingWorkExperiences.filter(exp => {
        if (!exp.start_date) return false
        const startDate = new Date(exp.start_date)
        return startDate >= cutoffDate
      })
    }

    // Calculate sum of monthly salaries
    const totalMonthlySalary = relevantExperiences.reduce((sum, exp) => {
      if (!exp.fixed_monthly_salary && !exp.fixed_annual_salary) return sum
      const fixedMonthlySalary = exp.fixed_monthly_salary
        ? exp.fixed_monthly_salary.currency === expectedSalary.currency
          ? exp.fixed_monthly_salary.amount
          : convertCurrency(
              context.exchangeRatesData,
              exp.fixed_monthly_salary.amount,
              exp.fixed_monthly_salary.currency,
              expectedSalary.currency,
            )
        : exp.fixed_annual_salary!.currency === expectedSalary.currency
          ? exp.fixed_annual_salary!.amount / 12
          : convertCurrency(
              context.exchangeRatesData,
              exp.fixed_annual_salary!.amount / 12,
              exp.fixed_annual_salary!.currency,
              expectedSalary.currency,
            )
      return sum + fixedMonthlySalary
    }, 0)

    const actualSalary = {
      amount: totalMonthlySalary,
      currency: expectedSalary.currency,
      ...(expectedSalary.duration && { duration: expectedSalary.duration }),
    }

    aggregation.min_sum_of_monthly_salary = {
      expected: expectedSalary,
      actual: actualSalary,
      similarity: getMonetarySimilarity(
        expectedSalary,
        actualSalary,
        context.exchangeRatesData,
      ),
    }
  }

  if (state.expected.aggregation?.min_sum_of_annual_salary) {
    const expectedSalary = state.expected.aggregation.min_sum_of_annual_salary

    // Filter work experiences based on duration if specified
    let relevantExperiences = matchingWorkExperiences

    if (expectedSalary.duration) {
      const cutoffDate = subtractDurationFromDate(
        new Date(),
        expectedSalary.duration,
      )

      relevantExperiences = matchingWorkExperiences.filter(exp => {
        if (!exp.start_date) return false
        const startDate = new Date(exp.start_date)
        return startDate >= cutoffDate
      })
    }

    // Calculate sum of annual salaries
    const totalAnnualSalary = relevantExperiences.reduce((sum, exp) => {
      if (!exp.fixed_monthly_salary && !exp.fixed_annual_salary) return sum
      const fixedAnnualSalary = exp.fixed_annual_salary
        ? exp.fixed_annual_salary.currency === expectedSalary.currency
          ? exp.fixed_annual_salary.amount
          : convertCurrency(
              context.exchangeRatesData,
              exp.fixed_annual_salary.amount,
              exp.fixed_annual_salary.currency,
              expectedSalary.currency,
            )
        : exp.fixed_monthly_salary!.currency === expectedSalary.currency
          ? exp.fixed_monthly_salary!.amount * 12
          : convertCurrency(
              context.exchangeRatesData,
              exp.fixed_monthly_salary!.amount * 12,
              exp.fixed_monthly_salary!.currency,
              expectedSalary.currency,
            )
      return sum + fixedAnnualSalary
    }, 0)

    const actualSalary = {
      amount: totalAnnualSalary,
      currency: expectedSalary.currency,
      ...(expectedSalary.duration && { duration: expectedSalary.duration }),
    }

    aggregation.min_sum_of_annual_salary = {
      expected: expectedSalary,
      actual: actualSalary,
      similarity: getMonetarySimilarity(
        expectedSalary,
        actualSalary,
        context.exchangeRatesData,
      ),
    }
  }

  // Calculate overall similarity based on aggregation results
  const aggregationValues = Object.values(aggregation)
  const aggregationSimilarity = round2(
    aggregationValues.reduce((acc, agg) => acc + agg.similarity, 0) /
      aggregationValues.length,
  )

  return {
    kind: 'work_experiences',
    op: 'matches',
    children: allChildren,
    aggregation,
    similarity: aggregationSimilarity,
  }
}

export const getWorkExperiencesStateOutput = (
  context: Context,
  state: WorkExperiencesState,
  stateInput: WorkExperiencesStateInput,
): WorkExperiencesStateOutput => {
  switch (state.op) {
    case 'contains':
    case 'not_contains':
      return getContainsLikeOutput(context, state, stateInput)
    case 'matches':
      return getMatchesOutput(context, state, stateInput)
  }
}
