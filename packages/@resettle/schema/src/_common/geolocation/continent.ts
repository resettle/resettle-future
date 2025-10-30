import { z } from 'zod'

export const CONTINENT_OPTIONS = [
  'africa',
  'antarctica',
  'asia',
  'europe',
  'north-america',
  'oceania',
  'south-america',
] as const

export const continentSchema = z.enum(CONTINENT_OPTIONS)
export const continentOptionalSchema = continentSchema.optional()
export const continentNullableSchema = continentSchema.nullable()
export const continentNullishSchema = continentSchema.nullish()

export type Continent = z.infer<typeof continentSchema>
