import { z } from 'zod'

import { currencyCodeSchema, dateSchema, numberSchema } from '../../_common'

export const exchangeRateDataSchema = z.object({
  currency_code: currencyCodeSchema,
  rate_to_usd: numberSchema,
  created_at: dateSchema,
})

export const exchangeRateDataResponseSchema = exchangeRateDataSchema.omit({
  created_at: true,
})

export type ExchangeRateData = z.infer<typeof exchangeRateDataSchema>
export type ExchangeRateDataResponse = z.infer<
  typeof exchangeRateDataResponseSchema
>
