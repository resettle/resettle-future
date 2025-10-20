import { z } from 'zod'

export const AUSTRALIAN_ENGLISH_LEVELS = [
  'none',
  'functional',
  'vocational',
  'competent',
  'proficient',
  'superior',
] as const

export const australianEnglishLevelsSchema = z.enum(AUSTRALIAN_ENGLISH_LEVELS)

export type AustralianEnglishLevel = z.infer<
  typeof australianEnglishLevelsSchema
>

export const VALID_AUSTRALIAN_ENGLISH_LEVELS = [
  'functional',
  'vocational',
  'competent',
  'proficient',
  'superior',
] as const

export const validAustralianEnglishLevelsSchema = z.enum(
  VALID_AUSTRALIAN_ENGLISH_LEVELS,
)

export type ValidAustralianEnglishLevel = z.infer<
  typeof validAustralianEnglishLevelsSchema
>

export const CEFR_LEVELS = [
  'none',
  'below-a1',
  'a1',
  'a2',
  'b1',
  'b2',
  'c1',
  'c2',
] as const

export const cefrLevelsSchema = z.enum(CEFR_LEVELS)

export type CefrLevel = z.infer<typeof cefrLevelsSchema>

export const VALID_CEFR_LEVELS = ['a1', 'a2', 'b1', 'b2', 'c1', 'c2'] as const

export const validCefrLevelsSchema = z.enum(VALID_CEFR_LEVELS)

export type ValidCefrLevel = z.infer<typeof validCefrLevelsSchema>

export const CLB_LEVELS = [
  'none',
  '1',
  '2',
  '3',
  '4',
  '5',
  '6',
  '7',
  '8',
  '9',
  '10',
  '11',
  '12',
] as const

export const clbLevelsSchema = z.enum(CLB_LEVELS)

export type ClbLevel = z.infer<typeof clbLevelsSchema>

export const VALID_CLB_LEVELS = [
  '1',
  '2',
  '3',
  '4',
  '5',
  '6',
  '7',
  '8',
  '9',
  '10',
  '11',
  '12',
] as const

export const validClbLevelsSchema = z.enum(VALID_CLB_LEVELS)

export type ValidClbLevel = z.infer<typeof validClbLevelsSchema>

export const clbLevelGe = (a: ValidClbLevel, b: ValidClbLevel) =>
  Number(a) >= Number(b)
