import { z } from 'zod'

import {
  dateSchema,
  numberSchema,
  stringSchema,
  uuidSchema,
} from '../../_common'

export const rawScoreSchema = z.object({
  id: stringSchema,
  user_tag_profile_id: uuidSchema,
  item_tag_profile_id: uuidSchema,
  method: stringSchema,
  score: numberSchema,
  created_at: dateSchema,
})

// TODO: Find a way to mark dirty when rules change or labels update.
export const modifiedScoreSchema = z.object({
  id: stringSchema,
  user_id: uuidSchema,
  opportunity_id: uuidSchema,
  score: numberSchema,
  created_at: dateSchema,
  updated_at: dateSchema,
})

export type RawScore = z.infer<typeof rawScoreSchema>
export type ModifiedScore = z.infer<typeof modifiedScoreSchema>
