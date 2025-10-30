import { z } from 'zod'

import { intSchema } from '../../_common'
import { validCefrLevelsSchema, validClbLevelsSchema } from './levels'

const integerScoreSchema = intSchema

const optionalIntegerScoreSchema = integerScoreSchema.optional()

const cambridgeScoreSchema = integerScoreSchema.min(80).max(230)

const optionalCambridgeScoreSchema = cambridgeScoreSchema.optional()

const geseGradeSchema = integerScoreSchema.min(1).max(12)

const languageCertScoreSchema = integerScoreSchema.min(0).max(100)

const optionalLanguageCertScoreSchema = languageCertScoreSchema.optional()

const metScoreSchema = integerScoreSchema.min(0).max(80)

const optionalMetScoreSchema = metScoreSchema.optional()

const oetScoreSchema = integerScoreSchema.min(0).max(500)

const optionalOetScoreSchema = oetScoreSchema.optional()

const pteScoreSchema = integerScoreSchema.min(10).max(90)

const optionalPteScoreSchema = pteScoreSchema.optional()

const tcfComprehensionScoreSchema = integerScoreSchema.min(0).max(699)

const optionalTcfComprehensionScoreSchema =
  tcfComprehensionScoreSchema.optional()

const tcfSkillScoreSchema = integerScoreSchema.min(0).max(20)

const optionalTcfSkillScoreSchema = tcfSkillScoreSchema.optional()

const tefScoreSchema = integerScoreSchema.min(0).max(699)

const optionalTefScoreSchema = tefScoreSchema.optional()

const toeflScoreSchema = integerScoreSchema.min(0).max(30)

const optionalToeflScoreSchema = toeflScoreSchema.optional()

export const IELTS_SCORES = [
  '0',
  '0.5',
  '1',
  '1.5',
  '2',
  '2.5',
  '3',
  '3.5',
  '4',
  '4.5',
  '5',
  '5.5',
  '6',
  '6.5',
  '7',
  '7.5',
  '8',
  '8.5',
  '9',
] as const

const ieltsScoreSchema = z.enum(IELTS_SCORES)

export type IeltsScore = z.infer<typeof ieltsScoreSchema>

export const ieltsScoreGe = (a: IeltsScore, b: IeltsScore) =>
  Number(a) >= Number(b)

const optionalIeltsScoreSchema = ieltsScoreSchema.optional()

export const cambridgeCertificateTypesSchema = z.enum([
  'cae',
  'cpe',
  'fce-for-schools',
  'fce',
  'ket',
  'pet',
])

export const cambridgeCertificateInputSchema = z.object({
  type: cambridgeCertificateTypesSchema,
  listening: cambridgeScoreSchema,
  reading: cambridgeScoreSchema,
  speaking: cambridgeScoreSchema,
  writing: cambridgeScoreSchema,
  overall: optionalCambridgeScoreSchema,
})

export type CambridgeCertificateInput = z.infer<
  typeof cambridgeCertificateInputSchema
>

export const cambridgeCertificateOutputSchema = z.object({
  type: cambridgeCertificateTypesSchema,
  listening: optionalCambridgeScoreSchema,
  reading: optionalCambridgeScoreSchema,
  speaking: optionalCambridgeScoreSchema,
  writing: optionalCambridgeScoreSchema,
  overall: optionalCambridgeScoreSchema,
})

export type CambridgeCertificateOutput = z.infer<
  typeof cambridgeCertificateOutputSchema
>

const optionalValidClbLevelsSchema = validClbLevelsSchema.optional()

export const celpipGeneralLsCertificateInputSchema = z.object({
  type: z.literal('celpip-general-ls'),
  listening: validClbLevelsSchema,
  speaking: validClbLevelsSchema,
})

export type CelpipGeneralLsCertificateInput = z.infer<
  typeof celpipGeneralLsCertificateInputSchema
>

export const celpipGeneralLsCertificateOutputSchema = z.object({
  type: z.literal('celpip-general-ls'),
  listening: optionalValidClbLevelsSchema,
  speaking: optionalValidClbLevelsSchema,
  overall: optionalValidClbLevelsSchema,
})

export type CelpipGeneralLsCertificateOutput = z.infer<
  typeof celpipGeneralLsCertificateOutputSchema
>

export const celpipGeneralCertificateInputSchema = z.object({
  type: z.literal('celpip-general'),
  listening: validClbLevelsSchema,
  reading: validClbLevelsSchema,
  speaking: validClbLevelsSchema,
  writing: validClbLevelsSchema,
  overall: optionalValidClbLevelsSchema,
})

export type CelpipGeneralCertificateInput = z.infer<
  typeof celpipGeneralCertificateInputSchema
>

export const celpipGeneralCertificateOutputSchema = z.object({
  type: z.literal('celpip-general'),
  listening: optionalValidClbLevelsSchema,
  reading: optionalValidClbLevelsSchema,
  speaking: optionalValidClbLevelsSchema,
  writing: optionalValidClbLevelsSchema,
  overall: optionalValidClbLevelsSchema,
})

export type CelpipGeneralCertificateOutput = z.infer<
  typeof celpipGeneralCertificateOutputSchema
>

export const geseCertificateInputSchema = z.object({
  type: z.literal('gese'),
  grade: geseGradeSchema,
})

export type GeseCertificateInput = z.infer<typeof geseCertificateInputSchema>

export type GeseCertificateOutput = GeseCertificateInput

export const ieltsCertificateTypesSchema = z.enum([
  'ielts-academic',
  'ielts-general',
])

export const ieltsCertificateInputSchema = z.object({
  type: ieltsCertificateTypesSchema,
  listening: ieltsScoreSchema,
  reading: ieltsScoreSchema,
  speaking: ieltsScoreSchema,
  writing: ieltsScoreSchema,
  overall: optionalIeltsScoreSchema,
})

export type IeltsCertificateInput = z.infer<typeof ieltsCertificateInputSchema>

export const ieltsCertificateOutputSchema = z.object({
  type: ieltsCertificateTypesSchema,
  listening: optionalIeltsScoreSchema,
  reading: optionalIeltsScoreSchema,
  speaking: optionalIeltsScoreSchema,
  writing: optionalIeltsScoreSchema,
  overall: optionalIeltsScoreSchema,
})

export type IeltsCertificateOutput = z.infer<
  typeof ieltsCertificateOutputSchema
>

export const selectedCefrBasedCertificateTypesSchema = z.enum([
  'ielts-life-skill',
  'pte-home',
])

export const selectedCefrBasedCertificateInputSchema = z.object({
  type: selectedCefrBasedCertificateTypesSchema,
  level: z.enum(['a1', 'a2', 'b1']),
})

export type SelectedCefrBasedCertificateInput = z.infer<
  typeof selectedCefrBasedCertificateInputSchema
>

export type SelectedCefrBasedCertificateOutput =
  SelectedCefrBasedCertificateInput

export const languageCertCertificateTypesSchema = z.enum([
  'languagecert-academic',
  'languagecert-general',
])

export const languageCertCertificateInputSchema = z.object({
  type: languageCertCertificateTypesSchema,
  listening: languageCertScoreSchema,
  reading: languageCertScoreSchema,
  speaking: languageCertScoreSchema,
  writing: languageCertScoreSchema,
  overall: optionalLanguageCertScoreSchema, // unknown algorithm
})

export type LanguageCertCertificateInput = z.infer<
  typeof languageCertCertificateInputSchema
>

export const languageCertCertificateOutputSchema = z.object({
  type: languageCertCertificateTypesSchema,
  listening: optionalLanguageCertScoreSchema,
  reading: optionalLanguageCertScoreSchema,
  speaking: optionalLanguageCertScoreSchema,
  writing: optionalLanguageCertScoreSchema,
  overall: optionalLanguageCertScoreSchema, // unknown algorithm
})

export type LanguageCertCertificateOutput = z.infer<
  typeof languageCertCertificateOutputSchema
>

export const metCertificateInputSchema = z.object({
  type: z.literal('met'),
  listening: metScoreSchema,
  reading: metScoreSchema,
  speaking: metScoreSchema,
  writing: metScoreSchema,
  overall: optionalMetScoreSchema, // average round down
})

export type MetCertificateInput = z.infer<typeof metCertificateInputSchema>

export const metCertificateOutputSchema = z.object({
  type: z.literal('met'),
  listening: optionalMetScoreSchema,
  reading: optionalMetScoreSchema,
  speaking: optionalMetScoreSchema,
  writing: optionalMetScoreSchema,
  overall: optionalMetScoreSchema, // average round down
})

export type MetCertificateOutput = z.infer<typeof metCertificateOutputSchema>

export const oetCertificateInputSchema = z.object({
  type: z.literal('oet'),
  listening: oetScoreSchema,
  reading: oetScoreSchema,
  speaking: oetScoreSchema,
  writing: oetScoreSchema,
  total: optionalIntegerScoreSchema,
})

export type OetCertificateInput = z.infer<typeof oetCertificateInputSchema>

export const oetCertificateOutputSchema = z.object({
  type: z.literal('oet'),
  listening: optionalOetScoreSchema,
  reading: optionalOetScoreSchema,
  speaking: optionalOetScoreSchema,
  writing: optionalOetScoreSchema,
  total: optionalIntegerScoreSchema,
})

export type OetCertificateOutput = z.infer<typeof oetCertificateOutputSchema>

export const pteCertificateTypesSchema = z.enum(['pte-academic', 'pte-core'])

export const pteCertificateInputSchema = z.object({
  type: pteCertificateTypesSchema,
  listening: pteScoreSchema,
  reading: pteScoreSchema,
  speaking: pteScoreSchema,
  writing: pteScoreSchema,
  overall: optionalPteScoreSchema,
})

export type PteCertificateInput = z.infer<typeof pteCertificateInputSchema>

export const pteCertificateOutputSchema = z.object({
  type: pteCertificateTypesSchema,
  listening: optionalPteScoreSchema,
  reading: optionalPteScoreSchema,
  speaking: optionalPteScoreSchema,
  writing: optionalPteScoreSchema,
  overall: optionalPteScoreSchema,
})

export type PteCertificateOutput = z.infer<typeof pteCertificateOutputSchema>

export const validCefrBasedCertificateTypesSchema = z.enum([
  'ise',
  'skills-for-english',
])

export const validCefrBasedCertificateInputSchema = z.object({
  type: validCefrBasedCertificateTypesSchema,
  level: validCefrLevelsSchema,
})

export type ValidCefrBasedCertificateInput = z.infer<
  typeof validCefrBasedCertificateInputSchema
>

export type ValidCefrBasedCertificateOutput = ValidCefrBasedCertificateInput

export const tcfCanadaCertificateInputSchema = z.object({
  type: z.literal('tcf-canada'),
  listening: tcfComprehensionScoreSchema,
  reading: tcfComprehensionScoreSchema,
  speaking: tcfSkillScoreSchema,
  writing: tcfSkillScoreSchema,
})

export type TcfCanadaCertificateInput = z.infer<
  typeof tcfCanadaCertificateInputSchema
>

export const tcfCanadaCertificateOutputSchema = z.object({
  type: z.literal('tcf-canada'),
  listening: optionalTcfComprehensionScoreSchema,
  reading: optionalTcfComprehensionScoreSchema,
  speaking: optionalTcfSkillScoreSchema,
  writing: optionalTcfSkillScoreSchema,
})

export type TcfCanadaCertificateOutput = z.infer<
  typeof tcfCanadaCertificateOutputSchema
>

export const tefCanadaCertificateInputSchema = z.object({
  type: z.literal('tef-canada'),
  listening: tefScoreSchema,
  reading: tefScoreSchema,
  speaking: tefScoreSchema,
  writing: tefScoreSchema,
  overall: optionalTefScoreSchema,
})

export type TefCanadaCertificateInput = z.infer<
  typeof tefCanadaCertificateInputSchema
>

export const tefCanadaCertificateOutputSchema = z.object({
  type: z.literal('tef-canada'),
  listening: optionalTefScoreSchema,
  reading: optionalTefScoreSchema,
  speaking: optionalTefScoreSchema,
  writing: optionalTefScoreSchema,
  overall: optionalTefScoreSchema,
})

export type TefCanadaCertificateOutput = z.infer<
  typeof tefCanadaCertificateOutputSchema
>

export const toeflCertificateInputSchema = z.object({
  type: z.literal('toefl'),
  listening: toeflScoreSchema,
  reading: toeflScoreSchema,
  speaking: toeflScoreSchema,
  writing: toeflScoreSchema,
  total: optionalIntegerScoreSchema,
})

export type ToeflCertificateInput = z.infer<typeof toeflCertificateInputSchema>

export const toeflCertificateOutputSchema = z.object({
  type: z.literal('toefl'),
  listening: optionalToeflScoreSchema,
  reading: optionalToeflScoreSchema,
  speaking: optionalToeflScoreSchema,
  writing: optionalToeflScoreSchema,
  total: optionalIntegerScoreSchema,
})

export type ToeflCertificateOutput = z.infer<
  typeof toeflCertificateOutputSchema
>

export type LanguageCertificateInput =
  | CambridgeCertificateInput
  | CelpipGeneralCertificateInput
  | CelpipGeneralLsCertificateInput
  | GeseCertificateInput
  | IeltsCertificateInput
  | LanguageCertCertificateInput
  | MetCertificateInput
  | OetCertificateInput
  | PteCertificateInput
  | SelectedCefrBasedCertificateInput
  | TcfCanadaCertificateInput
  | TefCanadaCertificateInput
  | ToeflCertificateInput
  | ValidCefrBasedCertificateInput

export type LanguageCertificateOutput =
  | CambridgeCertificateOutput
  | CelpipGeneralCertificateOutput
  | CelpipGeneralLsCertificateOutput
  | GeseCertificateOutput
  | IeltsCertificateOutput
  | LanguageCertCertificateOutput
  | MetCertificateOutput
  | OetCertificateOutput
  | PteCertificateOutput
  | SelectedCefrBasedCertificateOutput
  | TcfCanadaCertificateOutput
  | TefCanadaCertificateOutput
  | ToeflCertificateOutput
  | ValidCefrBasedCertificateOutput
