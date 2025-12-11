import { z } from 'zod'

import { stringSchema } from '../../_common'

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
  id: stringSchema.describe(
    'The id of the occupation code in format {classification}-{code}',
  ),
  classification: occupationCodeClassificationsSchema.describe(
    'The occupation classification',
  ),
  code: stringSchema.describe(
    'The code of the occupation under the classification',
  ),
  label: stringSchema.describe('The name of the occupation'),
})

export const occupationCodeRefSchema = z.union([
  stringSchema.describe(
    'The id of the occupation code in format {classification}-{code}',
  ),
  z.object({
    classification: occupationCodeClassificationsSchema.describe(
      'The occupation classification',
    ),
    code: stringSchema.describe(
      'The code of the occupation under the classification',
    ),
  }),
])

export type OccupationCodeClassification = z.infer<
  typeof occupationCodeClassificationsSchema
>
export type OccupationCode = z.infer<typeof occupationCodeSchema>
export type OccupationCodeRef = z.infer<typeof occupationCodeRefSchema>
