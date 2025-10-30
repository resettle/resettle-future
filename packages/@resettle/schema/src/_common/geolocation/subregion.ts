import { z } from 'zod'

export const SUBREGION_OPTIONS = [
  'central-africa',
  'eastern-africa',
  'northern-africa',
  'southern-africa',
  'western-africa',
  'central-asia',
  'eastern-asia',
  'southeast-asia',
  'southern-asia',
  'western-asia',
  'central-europe',
  'eastern-europe',
  'northern-europe',
  'southern-europe',
  'western-europe',
  'caribbean',
  'central-america',
  'northern-america',
  'south-america',
  'oceania',
] as const

export const subregionSchema = z.enum(SUBREGION_OPTIONS)
export const subregionOptionalSchema = subregionSchema.optional()
export const subregionNullableSchema = subregionSchema.nullable()
export const subregionNullishSchema = subregionSchema.nullish()

export type Subregion = z.infer<typeof subregionSchema>
