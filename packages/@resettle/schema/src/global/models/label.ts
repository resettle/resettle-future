import { z } from 'zod'

import { dateSchema, numberSchema, uuidSchema } from '../../_common'

export const labelSchema = z.object({
  user_id: uuidSchema,
  opportunity_id: uuidSchema,
  value: numberSchema,
  created_at: dateSchema,
  updated_at: dateSchema,
})

export const labelCreateBodySchema = labelSchema.pick({
  user_id: true,
  opportunity_id: true,
  value: true,
})

export const labelDeleteBodySchema = labelSchema.pick({
  user_id: true,
  opportunity_id: true,
})

export type Label = z.infer<typeof labelSchema>
export type LabelCreateBody = z.infer<typeof labelCreateBodySchema>
export type LabelDeleteBody = z.infer<typeof labelDeleteBodySchema>
