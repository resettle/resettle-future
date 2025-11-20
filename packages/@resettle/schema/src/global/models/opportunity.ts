import { z } from 'zod'
import { canonicalJobResponseSchema } from './job'

export const OPPORTUNITY_TYPES = ['job'] as const

export const opportunityTypeSchema = z.enum(OPPORTUNITY_TYPES)

export const opportunitySchema = z.discriminatedUnion('type', [
  z
    .object({
      type: z.literal('job'),
    })
    .extend(canonicalJobResponseSchema),
])

export type OpportunityType = z.infer<typeof opportunityTypeSchema>
export type Opportunity = z.infer<typeof opportunitySchema>
