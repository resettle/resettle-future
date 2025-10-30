import { z } from 'zod'

import { CONTINENT_OPTIONS } from './continent'
import { SUBREGION_OPTIONS } from './subregion'

export const REGION_SCOPE_OPTIONS = [
  ...CONTINENT_OPTIONS,
  ...SUBREGION_OPTIONS,
  'global',
] as const

export const regionScopeSchema = z.enum(REGION_SCOPE_OPTIONS)
export const regionScopeOptionalSchema = regionScopeSchema.optional()
export const regionScopeNullableSchema = regionScopeSchema.nullable()
export const regionScopeNullishSchema = regionScopeSchema.nullish()

export type RegionScope = z.infer<typeof regionScopeSchema>
