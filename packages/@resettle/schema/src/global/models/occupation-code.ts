import { z } from 'zod'

import {
  intSchema,
  stringSchema,
  uuidNullableSchema,
  uuidSchema,
} from '../../common'

const OCCUPATION_CODE_CLASSIFICATIONS = [
  'isco-2008',
  'ussoc-2018',
  'uksoc-2020',
  'nol-2024',
  'noc-2021',
  'osca-2024',
  'ussoc-2010',
  'noc-2016',
  'anzsco-2013',
  'anzsco-2022',
] as const

const occupationCodeClassificationsSchema = z.enum(
  OCCUPATION_CODE_CLASSIFICATIONS,
)

export const occupationCodeSchema = z.object({
  id: uuidSchema,
  canonical_id: uuidNullableSchema,
  slug: stringSchema,
  classification: occupationCodeClassificationsSchema,
  code: stringSchema,
  level: intSchema,
  label: stringSchema,
})

export const occupationCodeResponseSchema = occupationCodeSchema
  .pick({
    slug: true,
    classification: true,
    code: true,
    label: true,
  })
  .extend({
    id: uuidNullableSchema,
  })

export type OccupationCodeClassification = z.infer<
  typeof occupationCodeClassificationsSchema
>
export type OccupationCode = z.infer<typeof occupationCodeSchema>
export type OccupationCodeResponse = z.infer<
  typeof occupationCodeResponseSchema
>
