import { z } from 'zod'

import { uuidSchema } from '../../_common'
import { canonicalJobSchema } from './job'

export const OPPORTUNITY_TYPES = ['job'] as const

export const opportunityTypeSchema = z.enum(OPPORTUNITY_TYPES)

export const opportunitySchema = z.object({
  id: uuidSchema,
  type: opportunityTypeSchema,
})

export const opportunityResponseSchema = z.discriminatedUnion('type', [
  canonicalJobSchema.extend({
    type: z.literal('job'),
  }),
])

export type OpportunityType = z.infer<typeof opportunityTypeSchema>
export type Opportunity = z.infer<typeof opportunitySchema>
export type OpportunityResponse = z.infer<typeof opportunityResponseSchema>
