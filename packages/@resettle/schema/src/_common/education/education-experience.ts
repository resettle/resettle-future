import { z } from 'zod'

import { countryAlpha2CodeOptionalSchema } from '../iso'
import {
  booleanOptionalSchema,
  dateNullishSchema,
  stringOptionalSchema,
  uuidSchema,
} from '../utils'
import { educationLevelOptionalSchema } from './education-level'

export const educationExperienceSchema = z.object({
  id: uuidSchema,
  institution_name: stringOptionalSchema,
  institution_country: countryAlpha2CodeOptionalSchema,
  level: educationLevelOptionalSchema,
  field_of_study: stringOptionalSchema,
  grade: stringOptionalSchema,
  is_remote: booleanOptionalSchema,
  is_stem: booleanOptionalSchema,
  start_date: dateNullishSchema,
  end_date: dateNullishSchema,
})

export const educationExperienceOptionalSchema =
  educationExperienceSchema.optional()
export const educationExperienceNullableSchema =
  educationExperienceSchema.nullable()
export const educationExperienceNullishSchema =
  educationExperienceSchema.nullish()

export const educationExperienceArraySchema = z.array(educationExperienceSchema)
export const educationExperienceArrayOptionalSchema =
  educationExperienceArraySchema.optional()
export const educationExperienceArrayNullableSchema =
  educationExperienceArraySchema.nullable()
export const educationExperienceArrayNullishSchema =
  educationExperienceArraySchema.nullish()

export type EducationExperience = z.infer<typeof educationExperienceSchema>
