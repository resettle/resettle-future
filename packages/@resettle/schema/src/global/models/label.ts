import { z } from 'zod'

import {
  dateSchema,
  numberSchema,
  stringSchema,
  uuidSchema,
} from '../../_common'

export const labelSchema = z.object({
  user_id: uuidSchema,
  opportunity_id: uuidSchema,
  name: stringSchema,
  value: numberSchema,
  created_at: dateSchema,
  updated_at: dateSchema,
})

export const labelCreateBodySchema = labelSchema.pick({
  user_id: true,
  opportunity_id: true,
  name: true,
  value: true,
})

export const labelDeleteBodySchema = labelSchema.pick({
  user_id: true,
  opportunity_id: true,
  name: true,
})

export type Label = z.infer<typeof labelSchema>
export type LabelCreateBody = z.infer<typeof labelCreateBodySchema>
export type LabelDeleteBody = z.infer<typeof labelDeleteBodySchema>
