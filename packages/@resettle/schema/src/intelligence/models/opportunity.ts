import { z } from 'zod'

import {
  countryAlpha2CodeNullableSchema,
  dateSchema,
  stringNullableSchema,
  stringSchema,
  uuidNullableSchema,
  uuidSchema,
} from '../../_common'
import { canonicalJobSchema } from './job'
import { organizationTypeSchema } from './organization'

export const OPPORTUNITY_TYPES = ['job'] as const

export const opportunityTypeSchema = z.enum(OPPORTUNITY_TYPES)

export const opportunitySchema = z.object({
  id: uuidSchema,
  tag_profile_id: uuidNullableSchema,
  type: opportunityTypeSchema,
  updated_at: dateSchema,
})

export const opportunityResponseSchema = z.discriminatedUnion('type', [
  canonicalJobSchema
    .omit({
      canonical_organization_id: true,
      is_original: true,
      sources: true,
      processed_at: true,
      created_at: true,
    })
    .extend({
      type: z.literal('job'),
      organization_type: organizationTypeSchema,
      organization_name: stringSchema,
      organization_domain: stringNullableSchema,
      organization_country_code: countryAlpha2CodeNullableSchema,
    }),
])

export type OpportunityType = z.infer<typeof opportunityTypeSchema>
export type Opportunity = z.infer<typeof opportunitySchema>
export type OpportunityResponse = z.infer<typeof opportunityResponseSchema>
