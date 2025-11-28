import z from 'zod'

import {
  dateNullableSchema,
  dateSchema,
  recordWithLimit100Schema,
  stringOptionalSchema,
  stringSchema,
  uuidNullableSchema,
  uuidSchema,
} from '../../_common'

export const userSchema = z.object({
  id: uuidSchema,
  tenant_id: uuidSchema,
  tag_profile_id: uuidNullableSchema,
  username: stringSchema,
  metadata: recordWithLimit100Schema,
  created_at: dateSchema,
  updated_at: dateSchema,
  computed_at: dateNullableSchema,
  deleted_at: dateNullableSchema,
})

export const userCreateBodySchema = userSchema.pick({
  username: true,
  metadata: true,
})

export const userUpdateBodySchema = z.object({
  user_id: uuidSchema,
  username: stringOptionalSchema,
  metadata: recordWithLimit100Schema.optional(),
})

export const userResponseSchema = userSchema.omit({
  tenant_id: true,
  tag_profile_id: true,
  computed_at: true,
  deleted_at: true,
})

export type User = z.infer<typeof userSchema>
export type UserCreateBody = z.infer<typeof userCreateBodySchema>
export type UserUpdateBody = z.infer<typeof userUpdateBodySchema>
export type UserResponse = z.infer<typeof userResponseSchema>
