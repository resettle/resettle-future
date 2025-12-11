import { stringOptionalSchema } from '@resettle/schema'
import {
  occupationCodeClassificationsSchema,
  occupationCodeRefSchema,
  occupationCodeSchema,
} from '@resettle/schema/intelligence'
import { z } from 'zod'

import { defineAPISchema, getCursorPaginationSchema } from '../../_common'
import { INTELLIGENCE_API_ROUTES } from '../routes'

export const crosswalk = defineAPISchema({
  method: 'GET',
  route: INTELLIGENCE_API_ROUTES.occupation.crosswalk,
  query: z.object({
    from: occupationCodeRefSchema,
    to: occupationCodeClassificationsSchema.describe(
      'The occupation classification',
    ),
  }),
  responseData: z.array(occupationCodeSchema),
})

export const query = defineAPISchema({
  method: 'GET',
  route: INTELLIGENCE_API_ROUTES.occupation.query,
  query: z.object({
    classification: occupationCodeClassificationsSchema.describe(
      'The occupation classification',
    ),
    code: stringOptionalSchema.describe(
      'The code of the occupation under the classification',
    ),
    cursor: stringOptionalSchema,
    limit: z.coerce.number().int().min(1).max(100).optional(),
  }),
  responseData: getCursorPaginationSchema(occupationCodeSchema, z.enum(['id'])),
})

export const search = defineAPISchema({
  method: 'GET',
  route: INTELLIGENCE_API_ROUTES.occupation.search,
  query: z.object({
    classification: occupationCodeClassificationsSchema
      .optional()
      .describe('The code of the occupation under the classification'),
    q: z.string().min(1).max(100).describe('The searched text'),
    fuzzy: z
      .stringbool()
      .optional()
      .describe('Whether to perform a fuzzy match or exact text match'),
    limit: z.coerce.number().int().min(1).max(100).optional(),
  }),
  responseData: z.array(occupationCodeSchema),
})
