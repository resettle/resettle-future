import { z } from 'zod'

import {
  countryAlpha2CodeSchema,
  intSchema,
  numberSchema,
  stringArraySchema,
  stringSchema,
  uuidNullableSchema,
  uuidSchema,
} from '../../common'

export const GENERAL_PLACE_FEATURE_CODES = [
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

export const generalPlaceFeatureCodesSchema = z.enum(
  GENERAL_PLACE_FEATURE_CODES,
)

export const generalPlaceSchema = z.object({
  id: intSchema,
  canonical_id: uuidNullableSchema,
  name: stringSchema,
  alternate_names: stringArraySchema,
  latitude: numberSchema,
  longitude: numberSchema,
  feature_code: generalPlaceFeatureCodesSchema,
  country: countryAlpha2CodeSchema,
  admin1_code: stringSchema,
  admin2_code: stringSchema,
  admin3_code: stringSchema,
  admin4_code: stringSchema,
  population: stringSchema,
  elevation: intSchema,
})

export const generalPlaceResponseSchema = generalPlaceSchema
  .pick({
    name: true,
    alternate_names: true,
    country: true,
  })
  .extend({
    id: uuidNullableSchema,
  })

export const generalPlaceDataResponseSchema = generalPlaceSchema
  .pick({
    name: true,
    alternate_names: true,
    country: true,
    latitude: true,
    longitude: true,
    population: true,
    elevation: true,
  })
  .extend({
    id: uuidSchema,
  })

export type GeneralPlaceFeatureCode = z.infer<
  typeof generalPlaceFeatureCodesSchema
>
export type GeneralPlace = z.infer<typeof generalPlaceSchema>
export type GeneralPlaceResponse = z.infer<typeof generalPlaceResponseSchema>
export type GeneralPlaceDataResponse = z.infer<
  typeof generalPlaceDataResponseSchema
>
