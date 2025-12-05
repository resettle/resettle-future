import { z } from 'zod'

import {
  dateNullableSchema,
  dateSchema,
  stringSchema,
  uuidSchema,
} from '../../_common'

export const tagProfileSchema = z.object({
  id: uuidSchema,
  hash: stringSchema,
  created_at: dateSchema,
  computed_at: dateNullableSchema,
})

export type TagProfile = z.infer<typeof tagProfileSchema>
