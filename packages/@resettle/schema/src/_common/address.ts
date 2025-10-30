import { z } from 'zod'

import { countryAlpha2CodeOptionalSchema } from './iso'
import { dateNullishSchema, stringOptionalSchema } from './utils'

export const addressSchema = z.object({
  address_line_1: stringOptionalSchema,
  address_line_2: stringOptionalSchema,
  city: stringOptionalSchema,
  state: stringOptionalSchema,
  zip: stringOptionalSchema,
  country: countryAlpha2CodeOptionalSchema,
  start_date: dateNullishSchema,
  end_date: dateNullishSchema,
})

export type Address = z.infer<typeof addressSchema>
