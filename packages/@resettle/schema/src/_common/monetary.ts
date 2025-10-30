import { z } from 'zod'

import { currencyCodeSchema } from './iso'
import { numberSchema } from './utils'

export const monetarySchema = z.object({
  amount: numberSchema,
  currency: currencyCodeSchema,
})

export const monetaryOptionalSchema = monetarySchema.optional()
export const monetaryNullableSchema = monetarySchema.nullable()
export const monetaryNullishSchema = monetarySchema.nullish()

export type Monetary = z.infer<typeof monetarySchema>
