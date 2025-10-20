import { z } from 'zod'

import { dateSchema, numberSchema, uuidSchema } from '../../common'

export const exchangeRateDataSchema = z.object({
  entity_id: uuidSchema,
  rate_to_usd: numberSchema,
  created_at: dateSchema,
})

export const exchangeRateDataResponseSchema = exchangeRateDataSchema
  .omit({
    entity_id: true,
    created_at: true,
  })
  .extend({
    id: uuidSchema,
  })

export type ExchangeRateData = z.infer<typeof exchangeRateDataSchema>
export type ExchangeRateDataResponse = z.infer<
  typeof exchangeRateDataResponseSchema
>
