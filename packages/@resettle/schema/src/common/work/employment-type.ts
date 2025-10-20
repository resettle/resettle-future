import { z } from 'zod'

export const EMPLOYMENT_TYPE_OPTIONS = [
  'full_time',
  'part_time',
  'self_employed',
  'freelance',
  'contract',
  'internship',
  'volunteer',
  'other',
] as const

export const employmentTypeSchema = z.enum(EMPLOYMENT_TYPE_OPTIONS)
export const employmentTypeOptionalSchema = employmentTypeSchema.optional()
export const employmentTypeNullableSchema = employmentTypeSchema.nullable()
export const employmentTypeNullishSchema = employmentTypeSchema.nullish()

export type EmploymentType = z.infer<typeof employmentTypeSchema>
