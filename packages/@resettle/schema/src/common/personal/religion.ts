import { z } from 'zod'

export const RELIGION_OPTIONS = [
  'baha_i',
  'buddhist',
  'christian',
  'hindu',
  'jewish',
  'muslim',
  'shinto',
  'sikh',
  'muslim',
  'shinto',
  'sikh',
  'other',
  'unknown',
] as const

export const religionSchema = z.enum(RELIGION_OPTIONS)
export const religionOptionalSchema = religionSchema.optional()
export const religionNullableSchema = religionSchema.nullable()
export const religionNullishSchema = religionSchema.nullish()

export type Religion = z.infer<typeof religionSchema>
