import z from 'zod'

import { intSchema } from '../utils'

export const cutoffSchema = z.discriminatedUnion('unit', [
  z.object({
    unit: z.literal('days'),
    amount: intSchema.positive(),
  }),
  z.object({
    unit: z.literal('months'),
    amount: intSchema.positive(),
  }),
  z.object({
    unit: z.literal('years'),
    amount: intSchema.positive(),
  }),
])

export type Cutoff = z.infer<typeof cutoffSchema>
