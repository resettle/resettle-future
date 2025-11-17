import { z } from 'zod'

import { dateSchema, stringSchema, uuidSchema } from '../../_common'

export const shortLinkSchema = z.object({
  token: stringSchema,
  user_id: uuidSchema,
  opportunity_id: uuidSchema,
  session_id: uuidSchema,
  created_at: dateSchema,
})

export type ShortLink = z.infer<typeof shortLinkSchema>
