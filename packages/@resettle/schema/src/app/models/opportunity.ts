import { z } from 'zod'

import {
  anySchema,
  booleanSchema,
  dateNullableSchema,
  dateSchema,
  mergeActionTypeSchema,
  stringSchema,
  urlNullableSchema,
  uuidNullableSchema,
  uuidOptionalSchema,
  uuidSchema,
} from '../../_common'

export const OPPORTUNITY_TYPES = ['job'] as const

export const opportunityTypeSchema = z.enum(OPPORTUNITY_TYPES)

export const rawOpportunitySchema = z.object({
  id: uuidSchema,
  type: opportunityTypeSchema,
  raw_organization_id: uuidNullableSchema,
  source: stringSchema,
  external_id: stringSchema,
  title: stringSchema,
  description: stringSchema,
  url: urlNullableSchema,
  location: stringSchema,
  posted_at: dateNullableSchema,
  created_at: dateSchema,
  updated_at: dateSchema,
})

export const canonicalOpportunitySchema = z.object({
  id: uuidSchema,
  type: opportunityTypeSchema,
  canonical_organization_id: uuidNullableSchema,
  title: stringSchema,
  description: stringSchema,
  url: urlNullableSchema,
  is_original: booleanSchema,
  posted_at: dateSchema,
  sources: z.object({
    title: uuidOptionalSchema,
    description: uuidOptionalSchema,
    url: uuidOptionalSchema,
    posted_at: uuidOptionalSchema,
  }),
  processed_at: dateNullableSchema,
  created_at: dateSchema,
  updated_at: dateSchema,
})

export const opportunityMergeActionSchema = z.object({
  id: stringSchema,
  raw_id: uuidSchema,
  canonical_id: uuidSchema,
  type: mergeActionTypeSchema,
  actor_id: uuidNullableSchema,
  data: z.record(stringSchema, anySchema).nullable(),
  created_at: dateSchema,
})

export type OpportunityType = z.infer<typeof opportunityTypeSchema>
export type RawOpportunity = z.infer<typeof rawOpportunitySchema>
export type CanonicalOpportunity = z.infer<typeof canonicalOpportunitySchema>
export type OpportunityMergeAction = z.infer<
  typeof opportunityMergeActionSchema
>
