import { stringOptionalSchema } from '@resettle/schema'
import {
  occupationCodeClassificationsSchema,
  occupationCodeRefSchema,
  occupationCodeSchema,
} from '@resettle/schema/global'
import { z } from 'zod'

import { defineAPISchema, getCursorPaginationSchema } from '../../_common'
import { GLOBAL_API_ROUTES } from '../routes'

export const crosswalk = defineAPISchema({
  method: 'GET',
  route: GLOBAL_API_ROUTES.occupation.crosswalk,
  query: z.object({
    from: occupationCodeRefSchema,
    to: occupationCodeClassificationsSchema,
  }),
  responseData: z.array(occupationCodeSchema),
})

export const query = defineAPISchema({
  method: 'GET',
  route: GLOBAL_API_ROUTES.occupation.query,
  query: z.object({
    classification: occupationCodeClassificationsSchema,
    code: stringOptionalSchema,
    cursor: stringOptionalSchema,
    limit: z.coerce.number().int().min(1).max(100).optional(),
  }),
  responseData: getCursorPaginationSchema(occupationCodeSchema, z.enum(['id'])),
})

export const search = defineAPISchema({
  method: 'GET',
  route: GLOBAL_API_ROUTES.occupation.search,
  query: z.object({
    classification: occupationCodeClassificationsSchema.optional(),
    q: z.string().min(1).max(100),
    fuzzy: z.stringbool().optional(),
    limit: z.coerce.number().int().min(1).max(100).optional(),
  }),
  responseData: z.array(occupationCodeSchema),
})
