import { z } from 'zod'

export const EDUCATION_LEVEL_OPTIONS = [
  'middle_school',
  'high_school',
  'certificate',
  'associate',
  'bachelor',
  'master',
  'doctorate',
  'other',
] as const

export const educationLevelSchema = z.enum(EDUCATION_LEVEL_OPTIONS)
export const educationLevelOptionalSchema = educationLevelSchema.optional()
export const educationLevelNullableSchema = educationLevelSchema.nullable()
export const educationLevelNullishSchema = educationLevelSchema.nullish()

export type EducationLevel = z.infer<typeof educationLevelSchema>
