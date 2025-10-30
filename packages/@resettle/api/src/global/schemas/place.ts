import {
  costOfLivingDataResponseSchema,
  placeGeneralInfoResponseSchema,
  placeScopesSchema,
  placeSearchResponseSchema,
} from '@resettle/schema/global'
import { z } from 'zod'
import {
  countryAlpha2CodeOptionalSchema,
  currencyCodeOptionalSchema,
  uuidSchema,
} from '../../../../schema/src/_common'

import { defineAPISchema } from '../../_common'
import { GLOBAL_API_ROUTES } from '../routes'

export const search = defineAPISchema({
  method: 'GET',
  route: GLOBAL_API_ROUTES.place.search,
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
  route: GLOBAL_API_ROUTES.place.query.costOfLiving,
  query: z.object({
    place_id: uuidSchema,
    currency_code: currencyCodeOptionalSchema,
  }),
  responseData: costOfLivingDataResponseSchema,
})

export const queryGeneralInfo = defineAPISchema({
  method: 'GET',
  route: GLOBAL_API_ROUTES.place.query.generalInfo,
  query: z.object({
    place_id: uuidSchema,
  }),
  responseData: placeGeneralInfoResponseSchema,
})
