import type { Duration, DurationUnit } from '@resettle/schema'

/**
 * Get the duration in days between two dates
 * @param startDate - The start date
 * @param endDate - The end date
 * @returns The duration in days
 */
export const getDurationInDays = (startDate: Date, endDate: Date) => {
  const start = new Date(startDate)
  const end = new Date(endDate)

  return Math.floor((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24))
}

/**
 * Get the duration in weeks between two dates
 * @param startDate - The start date
 * @param endDate - The end date
 * @returns The duration in weeks
 */
export const getDurationInWeeks = (startDate: Date, endDate: Date) => {
  const start = new Date(startDate)
  const end = new Date(endDate)

  return Math.floor(
    (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24 * 7),
  )
}

/**
 * Get the duration in months between two dates
 * @param startDate - The start date
 * @param endDate - The end date
 * @returns The duration in months
 */
export const getDurationInMonths = (startDate: Date, endDate: Date) => {
  const start = new Date(startDate)
  const end = new Date(endDate)

  // Use UTC methods to avoid timezone issues
  // Calculate basic difference in months
  let months =
    (end.getUTCFullYear() - start.getUTCFullYear()) * 12 +
    (end.getUTCMonth() - start.getUTCMonth())

  // Calculate remaining days
  const startDay = start.getUTCDate()
  const endDay = end.getUTCDate()

  if (endDay < startDay) {
    // We need to borrow from the previous month
    months -= 1
    // Get the number of days in the month we're borrowing from
    const prevMonth = new Date(
      Date.UTC(end.getUTCFullYear(), end.getUTCMonth(), 0),
    )
    const daysInPrevMonth = prevMonth.getUTCDate()
    const remainingDays = daysInPrevMonth - startDay + endDay

    // Apply rounding strategy: if >= 10 days, round up
    if (remainingDays >= 10) {
      months += 1
    }
  } else {
    const remainingDays = endDay - startDay
    // Apply rounding strategy: if >= 10 days, round up
    if (remainingDays >= 10) {
      months += 1
    }
  }

  return Math.max(0, months)
}

/**
 * Get the duration in years between two dates
 * @param startDate - The start date
 * @param endDate - The end date
 * @returns The duration in years as a float
 */
export const getDurationInYears = (startDate: Date, endDate: Date) => {
  const start = new Date(startDate)
  const end = new Date(endDate)

  // Use UTC methods to avoid timezone issues
  // Calculate basic difference in years
  let years = end.getUTCFullYear() - start.getUTCFullYear()

  // Calculate remaining months and days for fractional part
  let remainingMonths = end.getUTCMonth() - start.getUTCMonth()
  let remainingDays = end.getUTCDate() - start.getUTCDate()

  // Adjust for negative days
  if (remainingDays < 0) {
    remainingMonths -= 1
    // Get days in the previous month
    const prevMonth = new Date(
      Date.UTC(end.getUTCFullYear(), end.getUTCMonth(), 0),
    )
    const daysInPrevMonth = prevMonth.getUTCDate()
    remainingDays += daysInPrevMonth
  }

  // Adjust for negative months
  if (remainingMonths < 0) {
    years -= 1
    remainingMonths += 12
  }

  // Calculate fractional years from remaining months and days
  const monthFraction = remainingMonths / 12
  const dayFraction = remainingDays / 365.25 // Using average year length

  return Math.max(0, years + monthFraction + dayFraction)
}

/**
 * Add a duration to a date
 * @param date - The date to add the duration to
 * @param duration - The duration to add
 * @returns The new date
 */
export const addDurationToDate = (date: Date, duration: Duration) => {
  const newDate = new Date(date)

  if (duration.unit === 'day') {
    newDate.setUTCDate(newDate.getUTCDate() + duration.value)
  } else if (duration.unit === 'week') {
    newDate.setUTCDate(newDate.getUTCDate() + duration.value * 7)
  } else if (duration.unit === 'month') {
    newDate.setUTCMonth(newDate.getUTCMonth() + duration.value)
  } else if (duration.unit === 'year') {
    newDate.setUTCFullYear(newDate.getUTCFullYear() + duration.value)
  }

  return newDate
}

/**
 * Subtract a duration from a date
 * @param date - The date to subtract the duration from
 * @param duration - The duration to subtract
 * @returns The new date
 */
export const subtractDurationFromDate = (date: Date, duration: Duration) => {
  const newDate = new Date(date)

  if (duration.unit === 'day') {
    newDate.setUTCDate(newDate.getUTCDate() - duration.value)
  } else if (duration.unit === 'week') {
    newDate.setUTCDate(newDate.getUTCDate() - duration.value * 7)
  } else if (duration.unit === 'month') {
    newDate.setUTCMonth(newDate.getUTCMonth() - duration.value)
  } else if (duration.unit === 'year') {
    newDate.setUTCFullYear(newDate.getUTCFullYear() - duration.value)
  }

  return newDate
}

/**
 * Get the duration between two dates
 *
 * @remarks
 * - For lifetime and flexible, we'll return the duration in days
 * - For week, we'll return the duration in weeks
 * - For day, we'll return the duration in days
 * - For month, we'll return the duration in months
 * - For year, we'll return the duration in years
 *
 * @param interval - The interval between the two dates
 * @param unit - The unit of the duration
 * @returns The duration
 */
export const getDurationBetweenDates = (
  interval: { start_date: Date; end_date: Date },
  unit: DurationUnit,
) => {
  switch (unit) {
    case 'year':
      return getDurationInYears(interval.start_date, interval.end_date)
    case 'month':
      return getDurationInMonths(interval.start_date, interval.end_date)
    case 'week':
      return getDurationInWeeks(interval.start_date, interval.end_date)
    case 'day':
      return getDurationInDays(interval.start_date, interval.end_date)
    default:
      return 0
  }
}
