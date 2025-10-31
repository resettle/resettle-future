import { z } from 'zod'

import {
  countryAlpha2CodeSchema,
  intSchema,
  numberSchema,
  stringArraySchema,
  stringSchema,
  uuidSchema,
} from '../../_common'

export const PLACE_FEATURE_CODES = [
  'ADM1',
  'ADM2',
  'ADM3',
  'ADM4',
  'ADM5',
  'ADMD',
  'PCL',
  'PCLD',
  'PCLF',
  'PCLI',
  'PCLIX',
  'PCLS',
  'TERR',
  'ZN',
  'ZNB',
  'PPL',
  'PPLA',
  'PPLA2',
  'PPLA3',
  'PPLA4',
  'PPLA5',
  'PPLC',
  'PPLCD',
  'PPLF',
  'PPLG',
  'PPLL',
  'PPLQ',
  'PPLR',
  'PPLW',
  'PPLX',
  'STLMT',
] as const

export const placeFeatureCodesSchema = z.enum(PLACE_FEATURE_CODES)

export const PLACE_SCOPES = ['cost-of-living', 'general-info'] as const

export const placeScopesSchema = z.enum(PLACE_SCOPES)

export const numbeoReferenceSchema = z.object({
  country_name: stringSchema,
  city_name: stringSchema,
})

export const placeSchema = z.object({
  id: uuidSchema,
  external_id: intSchema,
  name: stringSchema,
  aliases: stringArraySchema,
  latitude: numberSchema,
  longitude: numberSchema,
  feature_code: placeFeatureCodesSchema,
  country_code: countryAlpha2CodeSchema,
  admin1_code: stringSchema,
  admin2_code: stringSchema,
  admin3_code: stringSchema,
  admin4_code: stringSchema,
  population: stringSchema,
  elevation: intSchema,
  numbeo_reference: numbeoReferenceSchema.nullable(),
})

export const placeSearchSchema = placeSchema.pick({
  id: true,
  name: true,
  aliases: true,
  country_code: true,
  numbeo_reference: true,
})

export const placeSearchResponseSchema = placeSchema
  .pick({
    name: true,
    aliases: true,
    country_code: true,
  })
  .extend({
    place_id: uuidSchema,
    scopes: z.array(placeScopesSchema),
  })

export const placeGeneralInfoResponseSchema = placeSchema
  .pick({
    name: true,
    aliases: true,
    country_code: true,
    latitude: true,
    longitude: true,
    population: true,
    elevation: true,
  })
  .extend({
    place_id: uuidSchema,
  })

export type PlaceFeatureCode = z.infer<typeof placeFeatureCodesSchema>
export type PlaceScope = z.infer<typeof placeScopesSchema>
export type NumbeoReference = z.infer<typeof numbeoReferenceSchema>
export type Place = z.infer<typeof placeSchema>
export type PlaceSearch = z.infer<typeof placeSearchSchema>
export type PlaceSearchResponse = z.infer<typeof placeSearchResponseSchema>
export type PlaceGeneralInfoResponse = z.infer<
  typeof placeGeneralInfoResponseSchema
>
