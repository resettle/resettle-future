import { z } from 'zod'

import { countryAlpha2CodeSchema } from '../iso'
import {
  intSchema,
  numberSchema,
  stringNullableSchema,
  stringSchema,
} from '../utils'

export const fortuneGlobal500Schema = z.object({
  rank: intSchema,
  company: stringSchema,
  ticker: stringNullableSchema,
  revenue_in_millions: numberSchema,
  profit_in_millions: numberSchema,
  assets_in_millions: numberSchema,
  employees: intSchema,
  industry: stringSchema,
  city: stringSchema,
  state: stringNullableSchema,
  country: countryAlpha2CodeSchema,
})

export type FortuneGlobal500 = z.infer<typeof fortuneGlobal500Schema>
