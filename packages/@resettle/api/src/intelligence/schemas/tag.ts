import {
  tagNamespaceSchema,
  tagTemplateResponseSchema,
  userTagAttachBodySchema,
  userTagDetachBodySchema,
} from '@resettle/schema/intelligence'
import { z } from 'zod'

import { defineAPISchema } from '../../_common'
import { INTELLIGENCE_API_ROUTES } from '../routes'

export const attach = defineAPISchema({
  method: 'POST',
  route: INTELLIGENCE_API_ROUTES.tag.attach,
  body: z.array(userTagAttachBodySchema).min(1).max(10),
  responseData: z.array(userTagAttachBodySchema),
})

export const detach = defineAPISchema({
  method: 'POST',
  route: INTELLIGENCE_API_ROUTES.tag.detach,
  body: z.array(userTagDetachBodySchema).min(1).max(10),
  responseData: z.array(userTagDetachBodySchema),
})

export const search = defineAPISchema({
  method: 'GET',
  route: INTELLIGENCE_API_ROUTES.tag.search,
  query: z.object({
    q: z.string().min(1).max(100),
    fuzzy: z.stringbool().optional(),
    limit: z.coerce.number().int().min(1).max(100).optional(),
    namespace: tagNamespaceSchema.optional(),
  }),
  responseData: z.array(tagTemplateResponseSchema),
})
