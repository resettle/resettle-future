import { stringSchema, uuidSchema } from '@resettle/schema'
import {
  opportunityResponseSchema,
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
    target: z.object({
      user_id: uuidSchema,
      tags: z.array(stringSchema).optional(),
    }),
    limit: z.coerce.number().int().min(1).max(100).optional(),
  }),
  responseData: z.array(opportunityResponseSchema),
})
