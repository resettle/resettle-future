import { z } from 'zod'

import { countryAlpha2CodeSchema } from '../iso'
import { intNullableSchema, stringSchema } from '../utils'

export const institutionRankingSchema = z.object({
  id: stringSchema,
  name: stringSchema,
  alternates: z.array(stringSchema),
  country: countryAlpha2CodeSchema,
  qs: intNullableSchema,
  arwu: intNullableSchema,
  twur: intNullableSchema,
  usnwr: intNullableSchema,
})

export type InstitutionRanking = z.infer<typeof institutionRankingSchema>
