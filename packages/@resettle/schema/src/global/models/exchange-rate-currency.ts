import { z } from 'zod'

import {
  currencyCodeSchema,
  dateSchema,
  stringSchema,
  uuidNullableSchema,
  uuidSchema,
} from '../../common'

export const exchangeRateCurrencySchema = z.object({
  id: uuidSchema,
  canonical_id: uuidNullableSchema,
  slug: stringSchema,
  code: currencyCodeSchema,
  name: stringSchema,
  created_at: dateSchema,
})

export const exchangeRateCurrencyResponseSchema = exchangeRateCurrencySchema
  .pick({
    slug: true,
    code: true,
    name: true,
  })
  .extend({
    id: uuidNullableSchema,
  })

export type ExchangeRateCurrency = z.infer<typeof exchangeRateCurrencySchema>
export type ExchangeRateCurrencyResponse = z.infer<
  typeof exchangeRateCurrencyResponseSchema
>
