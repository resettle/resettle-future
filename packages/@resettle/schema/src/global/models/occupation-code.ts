import { z } from 'zod'

import { stringSchema } from '../../common'

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

export const occupationCodeClassificationsSchema = z.enum(
  OCCUPATION_CODE_CLASSIFICATIONS,
)

export const occupationCodeSchema = z.object({
  id: stringSchema,
  classification: occupationCodeClassificationsSchema,
  code: stringSchema,
  label: stringSchema,
})

export const occupationCodeRefSchema = z.union([
  stringSchema,
  z.object({
    classification: occupationCodeClassificationsSchema,
    code: stringSchema,
  }),
])

export type OccupationCodeClassification = z.infer<
  typeof occupationCodeClassificationsSchema
>
export type OccupationCode = z.infer<typeof occupationCodeSchema>
export type OccupationCodeRef = z.infer<typeof occupationCodeRefSchema>
