import { stringSchema, uuidSchema } from '@resettle/schema'
import {
  userCreateBodySchema,
  userResponseSchema,
  userUpdateBodySchema,
} from '@resettle/schema/intelligence'
import { z } from 'zod'

import { defineAPISchema } from '../../_common'
import { INTELLIGENCE_API_ROUTES } from '../routes'

export const readUser = defineAPISchema({
  method: 'GET',
  route: INTELLIGENCE_API_ROUTES.user,
  query: z.object({
    user_id: uuidSchema,
  }),
  responseData: userResponseSchema,
})

export const createUsers = defineAPISchema({
  method: 'POST',
  route: INTELLIGENCE_API_ROUTES.user,
  body: z.array(userCreateBodySchema).min(1).max(10),
  responseData: z.array(userResponseSchema),
})

export const updateUsers = defineAPISchema({
  method: 'PATCH',
  route: INTELLIGENCE_API_ROUTES.user,
  body: z.array(userUpdateBodySchema).min(1).max(10),
  responseData: z.array(userResponseSchema),
})

export const deleteUsers = defineAPISchema({
  method: 'POST',
  route: INTELLIGENCE_API_ROUTES.user.delete,
  body: z
    .array(
      z.object({
        user_id: uuidSchema,
      }),
    )
    .min(1)
    .max(10),
  responseData: z.array(stringSchema),
})
