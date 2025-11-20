import { stringSchema, uuidSchema } from '@resettle/schema'
import {
  tagNamespaceSchema,
  tagTemplateResponseSchema,
} from '@resettle/schema/global'
import { z } from 'zod'

import { defineAPISchema } from '../../_common'
import { GLOBAL_API_ROUTES } from '../routes'

export const search = defineAPISchema({
  method: 'GET',
  route: GLOBAL_API_ROUTES.tag.search,
  query: z.object({
    q: z.string().min(1).max(500),
    fuzzy: z.stringbool().optional(),
    limit: z.coerce.number().int().min(1).max(100).optional(),
    namespace: tagNamespaceSchema.optional(),
  }),
  responseData: z.array(tagTemplateResponseSchema),
})

export const assign = defineAPISchema({
  method: 'POST',
  route: GLOBAL_API_ROUTES.tag.assign,
  body: z.array(
    z.union([
      z.object({
        user_id: uuidSchema,
        tag_id: uuidSchema,
      }),
      z.object({
        user_id: uuidSchema,
        tag_slug: stringSchema,
      }),
    ]),
  ),
  responseData: z.array(
    z.object({
      user_id: uuidSchema,
      tag_id: uuidSchema,
    }),
  ),
})
