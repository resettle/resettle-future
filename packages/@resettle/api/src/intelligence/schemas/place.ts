import {
  countryAlpha2CodeOptionalSchema,
  currencyCodeOptionalSchema,
  uuidSchema,
} from '@resettle/schema'
import {
  costOfLivingDataResponseSchema,
  placeGeneralInfoResponseSchema,
  placeScopesSchema,
  placeSearchResponseSchema,
} from '@resettle/schema/intelligence'
import { z } from 'zod'

import { defineAPISchema } from '../../_common'
import { INTELLIGENCE_API_ROUTES } from '../routes'

export const search = defineAPISchema({
  method: 'GET',
  route: INTELLIGENCE_API_ROUTES.place.search,
  query: z.object({
    q: z.string().min(1).max(500).describe('The searched text'),
    fuzzy: z
      .stringbool()
      .optional()
      .describe('Whether to perform a fuzzy match or exact text match'),
    country_code: countryAlpha2CodeOptionalSchema.describe(
      'The ISO 3166-1 alpha-2 country code of the place',
    ),
    limit: z.coerce.number().int().min(1).max(100).optional(),
    scope: placeScopesSchema
      .optional()
      .describe('The scope of the searched places'),
  }),
  responseData: z.array(placeSearchResponseSchema),
})

export const queryCostOfLiving = defineAPISchema({
  method: 'GET',
  route: INTELLIGENCE_API_ROUTES.place.query.costOfLiving,
  query: z.object({
    place_id: uuidSchema,
    currency_code: currencyCodeOptionalSchema.describe(
      'The currency code to display',
    ),
  }),
  responseData: costOfLivingDataResponseSchema,
})

export const queryGeneralInfo = defineAPISchema({
  method: 'GET',
  route: INTELLIGENCE_API_ROUTES.place.query.generalInfo,
  query: z.object({
    place_id: uuidSchema,
  }),
  responseData: placeGeneralInfoResponseSchema,
})
