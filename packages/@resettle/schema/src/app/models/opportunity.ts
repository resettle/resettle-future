import { z } from 'zod'

import { dateSchema, uuidSchema } from '../../_common'

export const OPPORTUNITY_TYPES = ['job'] as const

export const opportunityTypeSchema = z.enum(OPPORTUNITY_TYPES)

export const rawOpportunitySchema = z.object({
  id: uuidSchema,
  created_at: dateSchema,
})

export const canonicalOpportunitySchema = z.object({
  id: uuidSchema,
  created_at: dateSchema,
})

export type OpportunityType = z.infer<typeof opportunityTypeSchema>
export type RawOpportunity = z.infer<typeof rawOpportunitySchema>
export type CanonicalOpportunity = z.infer<typeof canonicalOpportunitySchema>
