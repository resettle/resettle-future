import { z } from 'zod'

export const GENDER_OPTIONS = ['male', 'female', 'other'] as const

export const genderSchema = z.enum(GENDER_OPTIONS)
export const genderOptionalSchema = genderSchema.optional()
export const genderNullableSchema = genderSchema.nullable()
export const genderNullishSchema = genderSchema.nullish()

export type Gender = z.infer<typeof genderSchema>
