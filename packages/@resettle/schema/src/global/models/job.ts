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

export const rawJobSchema = z.object({
  id: uuidSchema,
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

export const canonicalJobSchema = z.object({
  id: uuidSchema,
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

export const canonicalJobBodySchema = canonicalJobSchema.omit({
  id: true,
  created_at: true,
  updated_at: true,
})

export const canonicalJobResponseSchema = canonicalJobSchema.omit({
  is_original: true,
  sources: true,
  processed_at: true,
})

export const jobMergeActionSchema = z.object({
  id: stringSchema,
  raw_id: uuidSchema,
  canonical_id: uuidSchema,
  type: mergeActionTypeSchema,
  actor_id: uuidNullableSchema,
  data: z.record(stringSchema, anySchema).nullable(),
  created_at: dateSchema,
})

export type RawJob = z.infer<typeof rawJobSchema>
export type CanonicalJob = z.infer<typeof canonicalJobSchema>
export type CanonicalJobBody = z.infer<typeof canonicalJobBodySchema>
export type CanonicalJobResponse = z.infer<typeof canonicalJobResponseSchema>
export type JobMergeAction = z.infer<typeof jobMergeActionSchema>
