import { stringSchema, uuidSchema } from '@resettle/schema'
import {
  opportunitySchema,
  opportunityTypeSchema,
} from '@resettle/schema/global'
import z from 'zod'

import { defineAPISchema } from '../../_common'
import { GLOBAL_API_ROUTES } from '../routes'

export const recommend = defineAPISchema({
  method: 'POST',
  route: GLOBAL_API_ROUTES.recommend,
  body: z.object({
    types: z.array(opportunityTypeSchema).optional(),
    target: z.union([
      z.object({
        tags: z.array(stringSchema),
      }),
      z.object({
        user_id: uuidSchema,
      }),
    ]),
  }),
  responseData: z.array(opportunitySchema),
})
