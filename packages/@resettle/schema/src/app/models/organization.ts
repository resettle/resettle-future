import { z } from 'zod'

import {
  anySchema,
  booleanSchema,
  countryAlpha2CodeNullableSchema,
  dateSchema,
  mergeActionTypeSchema,
  stringNullableSchema,
  stringSchema,
  uuidNullableSchema,
  uuidOptionalSchema,
  uuidSchema,
} from '../../_common'

export const ORGANIZATION_TYPES = ['company'] as const

export const organizationTypeSchema = z.enum(ORGANIZATION_TYPES)

export const rawOrganizationSchema = z.object({
  id: uuidSchema,
  type: organizationTypeSchema,
  source: stringSchema,
  external_id: stringSchema,
  name: stringSchema,
  domain: stringNullableSchema,
  country_code: countryAlpha2CodeNullableSchema,
  created_at: dateSchema,
  updated_at: dateSchema,
})

export const canonicalOrganizationSchema = z.object({
  id: uuidSchema,
  type: organizationTypeSchema,
  slug: stringSchema,
  name: stringSchema,
  domain: stringNullableSchema,
  country_code: countryAlpha2CodeNullableSchema,
  // NOTE: It's possible to create an organization internally before capturing a mergeable one from some external data source, thus they can be `undefined`.
  sources: z.object({
    name: uuidOptionalSchema,
    domain: uuidOptionalSchema,
    country_code: uuidOptionalSchema,
  }),
  is_original: booleanSchema,
  created_at: dateSchema,
  updated_at: dateSchema,
})

export const organizationMergeActionSchema = z.object({
  id: stringSchema,
  raw_id: uuidSchema,
  canonical_id: uuidSchema,
  type: mergeActionTypeSchema,
  actor_id: uuidNullableSchema,
  data: z.record(stringSchema, anySchema).nullable(),
  created_at: dateSchema,
})

export type OrganizationType = z.infer<typeof organizationTypeSchema>
export type RawOrganization = z.infer<typeof rawOrganizationSchema>
export type CanonicalOrganization = z.infer<typeof canonicalOrganizationSchema>
export type OrganizationMergeAction = z.infer<
  typeof organizationMergeActionSchema
>
