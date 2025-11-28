import { stringSchema, uuidSchema } from '@resettle/schema'
import {
  opportunityResponseSchema,
  opportunityTypeSchema,
} from '@resettle/schema/global'
import z from 'zod'

import { defineAPISchema } from '../../_common'
import { GLOBAL_API_ROUTES } from '../routes'

export const recommendByUser = defineAPISchema({
  method: 'POST',
  route: GLOBAL_API_ROUTES.recommend.byUser,
  body: z.object({
    types: z.array(opportunityTypeSchema).optional(),
    user_id: uuidSchema,
    limit: z.coerce.number().int().min(1).max(100).optional(),
  }),
  responseData: z.array(opportunityResponseSchema),
})

export const recommendByTags = defineAPISchema({
  method: 'POST',
  route: GLOBAL_API_ROUTES.recommend.byTags,
  body: z.object({
    types: z.array(opportunityTypeSchema).optional(),
    tags: z.array(stringSchema).min(1).max(20),
    limit: z.coerce.number().int().min(1).max(100).optional(),
  }),
  responseData: z.array(opportunityResponseSchema),
})
