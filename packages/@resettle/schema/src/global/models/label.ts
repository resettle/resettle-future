import { z } from 'zod'

import { dateSchema, numberSchema, uuidSchema } from '../../_common'

export const labelSchema = z.object({
  user_id: uuidSchema,
  item_id: uuidSchema,
  value: numberSchema,
  created_at: dateSchema,
  updated_at: dateSchema,
})

export type Label = z.infer<typeof labelSchema>
