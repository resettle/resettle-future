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
    q: z.string().min(1).max(500),
    fuzzy: z.stringbool().optional(),
    country_code: countryAlpha2CodeOptionalSchema,
    limit: z.coerce.number().int().min(1).max(100).optional(),
    scope: placeScopesSchema.optional(),
  }),
  responseData: z.array(placeSearchResponseSchema),
})

export const queryCostOfLiving = defineAPISchema({
  method: 'GET',
  route: INTELLIGENCE_API_ROUTES.place.query.costOfLiving,
  query: z.object({
    place_id: uuidSchema,
    currency_code: currencyCodeOptionalSchema,
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
