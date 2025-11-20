import z from 'zod'

import {
  dateNullableSchema,
  dateSchema,
  recordWithLimit100Schema,
  stringSchema,
  uuidSchema,
} from '../../_common'

export const userSchema = z.object({
  id: uuidSchema,
  tenant_id: uuidSchema,
  username: stringSchema,
  metadata: recordWithLimit100Schema,
  created_at: dateSchema,
  updated_at: dateSchema,
  deleted_at: dateNullableSchema,
})

export const userResponseSchema = userSchema.omit({
  tenant_id: true,
  deleted_at: true,
})

export type User = z.infer<typeof userSchema>
export type UserResponse = z.infer<typeof userResponseSchema>
