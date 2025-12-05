import { z } from 'zod'

export const LATEST_OCCUPATION_CLASSIFICATIONS = [
  'isco-2008',
  'ussoc-2018',
  'uksoc-2020',
  'nol-2024',
  'noc-2021',
  'osca-2024',
] as const

export const OCCUPATION_CLASSIFICATIONS = [
  ...LATEST_OCCUPATION_CLASSIFICATIONS,
  'ussoc-2010',
  'noc-2016',
  'anzsco-2013',
  'anzsco-2022',
] as const

export const latestOccupationClassificationSchema = z.enum(
  LATEST_OCCUPATION_CLASSIFICATIONS,
)

export const occupationClassificationSchema = z.enum(OCCUPATION_CLASSIFICATIONS)

export type LatestOccupationClassification = z.infer<
  typeof latestOccupationClassificationSchema
>

export type OccupationClassification = z.infer<
  typeof occupationClassificationSchema
>

export const primaryOccupationCodeSchema = z.object({
  kind: latestOccupationClassificationSchema,
  code: z.string(),
})

export const equivalentOccupationCodeSchema = z.object({
  kind: occupationClassificationSchema,
  codes: z.array(z.string()),
})

export const occupationCodesSchema = z.object({
  primary: primaryOccupationCodeSchema,
  equivalent: z.array(equivalentOccupationCodeSchema),
})

export const occupationCodesOptionalSchema = occupationCodesSchema.optional()
export const occupationCodesNullableSchema = occupationCodesSchema.nullable()
export const occupationCodesNullishSchema = occupationCodesSchema.nullish()

export type PrimaryOccupationCode = z.infer<typeof primaryOccupationCodeSchema>

export type EquivalentOccupationCode = z.infer<
  typeof equivalentOccupationCodeSchema
>

export type OccupationCodes = z.infer<typeof occupationCodesSchema>
