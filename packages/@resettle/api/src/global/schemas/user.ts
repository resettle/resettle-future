import {
  recordWithLimit100Schema,
  stringSchema,
  uuidSchema,
} from '@resettle/schema'
import { userResponseSchema } from '@resettle/schema/global'
import { z } from 'zod'

import { defineAPISchema } from '../../_common'
import { GLOBAL_API_ROUTES } from '../routes'

export const createUsers = defineAPISchema({
  method: 'POST',
  route: GLOBAL_API_ROUTES.user,
  body: z
    .array(
      z.object({
        username: stringSchema,
        metadata: recordWithLimit100Schema,
      }),
    )
    .min(1)
    .max(500),
  responseData: z.array(userResponseSchema),
})

export const updateUsers = defineAPISchema({
  method: 'PATCH',
  route: GLOBAL_API_ROUTES.user,
  body: z
    .array(
      z.object({
        user_id: uuidSchema,
        username: stringSchema.optional(),
        metadata: recordWithLimit100Schema.optional(),
      }),
    )
    .min(1)
    .max(500),
  responseData: z.array(userResponseSchema),
})

export const deleteUsers = defineAPISchema({
  method: 'POST',
  route: GLOBAL_API_ROUTES.user.delete,
  body: z
    .array(
      z.object({
        user_id: uuidSchema,
      }),
    )
    .min(1)
    .max(500),
  responseData: z.array(userResponseSchema),
})
