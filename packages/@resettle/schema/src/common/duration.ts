import { z } from 'zod'

import { intSchema } from './utils'

export const DURATION_UNIT_OPTIONS = ['day', 'week', 'month', 'year'] as const

export const durationUnitSchema = z.enum(DURATION_UNIT_OPTIONS)
export const durationUnitOptionalSchema = durationUnitSchema.optional()
export const durationUnitNullableSchema = durationUnitSchema.nullable()
export const durationUnitNullishSchema = durationUnitSchema.nullish()

export const durationSchema = z.object({
  unit: durationUnitSchema,
  value: intSchema,
})

export const durationOptionalSchema = durationSchema.optional()
export const durationNullableSchema = durationSchema.nullable()
export const durationNullishSchema = durationSchema.nullish()

export const durationArraySchema = z.array(durationSchema)
export const durationArrayOptionalSchema = durationArraySchema.optional()
export const durationArrayNullableSchema = durationArraySchema.nullable()
export const durationArrayNullishSchema = durationArraySchema.nullish()

export type DurationUnit = z.infer<typeof durationUnitSchema>
export type Duration = z.infer<typeof durationSchema>

/**
 * Converts a duration to days.
 *
 * @param duration - The duration to convert to days.
 * @returns The duration in days.
 */
export const durationToDays = (duration: Duration): number => {
  switch (duration.unit) {
    case 'day':
      return duration.value
    case 'week':
      return duration.value * 7
    case 'month':
      return duration.value * 31
    case 'year':
      return duration.value * 366
    default:
      throw new Error(`Unsupported duration unit: ${duration.unit}`)
  }
}
