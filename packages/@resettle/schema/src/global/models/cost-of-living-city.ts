import { z } from 'zod'

import {
  countryAlpha2CodeSchema,
  dateSchema,
  stringSchema,
  uuidNullableSchema,
  uuidSchema,
} from '../../common'

export const costOfLivingCitySchema = z.object({
  id: uuidSchema,
  canonical_id: uuidNullableSchema,
  slug: stringSchema,
  country: countryAlpha2CodeSchema,
  name: stringSchema,
  created_at: dateSchema,
})

export const costOfLivingCityResponseSchema = costOfLivingCitySchema
  .pick({
    slug: true,
    country: true,
    name: true,
  })
  .extend({
    id: uuidNullableSchema,
  })

export type CostOfLivingCity = z.infer<typeof costOfLivingCitySchema>
export type costOfLivingCityResponse = z.infer<
  typeof costOfLivingCityResponseSchema
>
