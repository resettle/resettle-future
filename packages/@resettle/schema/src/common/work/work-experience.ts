import { z } from 'zod'

import { countryAlpha2CodeOptionalSchema } from '../iso'
import {
  booleanOptionalSchema,
  dateNullishSchema,
  stringOptionalSchema,
  uuidSchema,
} from '../utils'
import { employmentTypeOptionalSchema } from './employment-type'

export const workExperienceSchema = z.object({
  id: uuidSchema,
  employer_name: stringOptionalSchema,
  employer_country: countryAlpha2CodeOptionalSchema,
  employment_type: employmentTypeOptionalSchema,
  job_title: stringOptionalSchema,
  job_description: stringOptionalSchema,
  is_remote: booleanOptionalSchema,
  is_stem: booleanOptionalSchema,
  start_date: dateNullishSchema,
  end_date: dateNullishSchema,
})

export const workExperienceOptionalSchema = workExperienceSchema.optional()
export const workExperienceNullableSchema = workExperienceSchema.nullable()
export const workExperienceNullishSchema = workExperienceSchema.nullish()

export const workExperienceArraySchema = z.array(workExperienceSchema)
export const workExperienceArrayOptionalSchema =
  workExperienceArraySchema.optional()
export const workExperienceArrayNullableSchema =
  workExperienceArraySchema.nullable()
export const workExperienceArrayNullishSchema =
  workExperienceArraySchema.nullish()

export type WorkExperience = z.infer<typeof workExperienceSchema>
