import {
  AUSTRALIAN_ENGLISH_LEVELS,
  CEFR_LEVELS,
  CLB_LEVELS,
  convertCertificateSectionToClbLevel,
  convertCertificateToAustralianEnglishLevel,
  convertCertificateToCefrLevel,
  convertCertificateToClbLevel,
  type IeltsScore,
  type LanguageCertificateInput,
  type ValidAustralianEnglishLevel,
  type ValidCefrLevel,
  type ValidClbLevel,
} from '@resettle/schema/intelligence'

import type { Context } from '../types'
import { getPercentageSimilarity } from '../utils/similarity'

export type Language = 'en' | 'fr'

export const DEFAULT_LANGUAGE_CERTIFICATES_SIMILARITY = 0.2

export type LanguageCertificatesStateInput = {
  language_certificates?: LanguageCertificateInput[]
}

export type LanguageCertificatesState =
  | {
      kind: 'language_certificates'
      op: 'auen-min'
      expected: ValidAustralianEnglishLevel[]
    }
  | {
      kind: 'language_certificates'
      op: 'cefr-min'
      expected: {
        level: ValidCefrLevel[]
        language?: Language[]
      }
    }
  | {
      kind: 'language_certificates'
      op: 'clb-min'
      expected: ValidClbLevel[]
    }
  | {
      kind: 'language_certificates'
      op: 'clb-sections-min'
      expected: {
        listening?: ValidClbLevel
        reading?: ValidClbLevel
        speaking?: ValidClbLevel
        writing?: ValidClbLevel
      }
    }
  | {
      kind: 'language_certificates'
      op: 'four-sections-certificate-min'
      type:
        | 'cae'
        | 'celpip-general'
        | 'cpe'
        | 'fce'
        | 'fce-for-schools'
        | 'ket'
        | 'oet'
        | 'pet'
        | 'tcf-canada'
        | 'tef-canada'
        | 'toefl'
      expected: {
        overall?: number
        listening?: number
        reading?: number
        speaking?: number
        writing?: number
      }
    }
  | {
      kind: 'language_certificates'
      op: 'ielts-min'
      type: 'ielts-academic' | 'ielts-general'
      expected: {
        overall?: IeltsScore
        listening?: IeltsScore
        reading?: IeltsScore
        writing?: IeltsScore
        speaking?: IeltsScore
      }
    }
  | {
      kind: 'language_certificates'
      op: 'gese-min'
      expected: number
    }
  | {
      kind: 'language_certificates'
      op: 'overall-certificate-min'
      type: 'pte-academic' | 'pte-core'
      expected: {
        listening?: number
        reading?: number
        writing?: number
        speaking?: number
        overall?: number
      }
    }

export type LanguageCertificatesStateOutput =
  | {
      kind: 'language_certificates'
      op: 'auen-min'
      expected: ValidAustralianEnglishLevel[]
      actual?: ValidAustralianEnglishLevel[]
      similarity: number
    }
  | {
      kind: 'language_certificates'
      op: 'cefr-min'
      expected: {
        level: ValidCefrLevel[]
        language?: Language[]
      }
      actual?: {
        level: ValidCefrLevel
        language: Language
      }[]
      similarity: number
    }
  | {
      kind: 'language_certificates'
      op: 'clb-min'
      expected: ValidClbLevel[]
      actual?: ValidClbLevel[]
      similarity: number
    }
  | {
      kind: 'language_certificates'
      op: 'clb-sections-min'
      filters: {
        listening?: {
          expected: ValidClbLevel
          actual?: ValidClbLevel
          similarity: number
        }
        reading?: {
          expected: ValidClbLevel
          actual?: ValidClbLevel
          similarity: number
        }
        speaking?: {
          expected: ValidClbLevel
          actual?: ValidClbLevel
          similarity: number
        }
        writing?: {
          expected: ValidClbLevel
          actual?: ValidClbLevel
          similarity: number
        }
      }
      similarity: number
    }
  | {
      kind: 'language_certificates'
      op: 'four-sections-certificate-min'
      type:
        | 'cae'
        | 'celpip-general'
        | 'cpe'
        | 'fce'
        | 'fce-for-schools'
        | 'ket'
        | 'oet'
        | 'pet'
        | 'tcf-canada'
        | 'tef-canada'
        | 'toefl'
      filters: {
        overall?: {
          expected: number
          actual?: number
          similarity: number
        }
        listening?: {
          expected: number
          actual?: number
          similarity: number
        }
        reading?: {
          expected: number
          actual?: number
          similarity: number
        }
        speaking?: {
          expected: number
          actual?: number
          similarity: number
        }
        writing?: {
          expected: number
          actual?: number
          similarity: number
        }
      }
      similarity: number
    }
  | {
      kind: 'language_certificates'
      op: 'ielts-min'
      type: 'ielts-academic' | 'ielts-general'
      filters: {
        overall?: {
          expected: IeltsScore
          actual?: IeltsScore
          similarity: number
        }
        listening?: {
          expected: IeltsScore
          actual?: IeltsScore
          similarity: number
        }
        reading?: {
          expected: IeltsScore
          actual?: IeltsScore
          similarity: number
        }
        writing?: {
          expected: IeltsScore
          actual?: IeltsScore
          similarity: number
        }
        speaking?: {
          expected: IeltsScore
          actual?: IeltsScore
          similarity: number
        }
      }
      similarity: number
    }
  | {
      kind: 'language_certificates'
      op: 'gese-min'
      expected: number
      actual?: number
      similarity: number
    }
  | {
      kind: 'language_certificates'
      op: 'overall-certificate-min'
      type: 'pte-academic' | 'pte-core'
      filters: {
        listening?: {
          expected: number
          actual?: number
          similarity: number
        }
        reading?: {
          expected: number
          actual?: number
          similarity: number
        }
        writing?: {
          expected: number
          actual?: number
          similarity: number
        }
        speaking?: {
          expected: number
          actual?: number
          similarity: number
        }
        overall?: {
          expected: number
          actual?: number
          similarity: number
        }
      }
      similarity: number
    }

// Utility functions for language level comparisons
const getLanguageLevelSimilarity = <T extends string>(
  expected: T[],
  actual: T[],
  levels: readonly T[],
): number => {
  if (expected.length === 0 || actual.length === 0) {
    return DEFAULT_LANGUAGE_CERTIFICATES_SIMILARITY
  }

  const expectedMinIndex = Math.min(
    ...expected.map(level => levels.indexOf(level)),
  )
  const actualMaxIndex = Math.max(...actual.map(level => levels.indexOf(level)))

  // Check if actual meets or exceeds the minimum expected level
  if (actualMaxIndex >= expectedMinIndex) {
    return 1
  }

  // Calculate percentage similarity based on level progression
  return actualMaxIndex / expectedMinIndex
}

const getIELTSScoreSimilarity = (
  expected: IeltsScore,
  actual: IeltsScore,
): number => {
  const expectedNum = parseFloat(expected)
  const actualNum = parseFloat(actual)

  return getPercentageSimilarity(expectedNum, actualNum, '>=')
}

const convertCertificateToLanguage = (
  cert: LanguageCertificateInput,
): Language => {
  switch (cert.type) {
    case 'tcf-canada':
    case 'tef-canada':
      return 'fr'
    default:
      return 'en'
  }
}

// Implementation functions for each operation type
const getAuenMinOutput = (
  _context: Context,
  state: Extract<LanguageCertificatesState, { op: 'auen-min' }>,
  stateInput: LanguageCertificatesStateInput,
): Extract<LanguageCertificatesStateOutput, { op: 'auen-min' }> => {
  if (
    !stateInput.language_certificates ||
    stateInput.language_certificates.length === 0
  ) {
    return {
      kind: 'language_certificates',
      op: 'auen-min',
      expected: state.expected,
      similarity: DEFAULT_LANGUAGE_CERTIFICATES_SIMILARITY,
    }
  }

  const actualLevels: ValidAustralianEnglishLevel[] = []
  stateInput.language_certificates.forEach(cert => {
    const level = convertCertificateToAustralianEnglishLevel(cert)
    if (level !== 'none') {
      actualLevels.push(level)
    }
  })

  return {
    kind: 'language_certificates',
    op: 'auen-min',
    expected: state.expected,
    actual: actualLevels,
    similarity: getLanguageLevelSimilarity(
      state.expected,
      actualLevels,
      AUSTRALIAN_ENGLISH_LEVELS.slice(1),
    ),
  }
}

const getCefrMinOutput = (
  _context: Context,
  state: Extract<LanguageCertificatesState, { op: 'cefr-min' }>,
  stateInput: LanguageCertificatesStateInput,
): Extract<LanguageCertificatesStateOutput, { op: 'cefr-min' }> => {
  if (
    !stateInput.language_certificates ||
    stateInput.language_certificates.length === 0
  ) {
    return {
      kind: 'language_certificates',
      op: 'cefr-min',
      expected: state.expected,
      similarity: DEFAULT_LANGUAGE_CERTIFICATES_SIMILARITY,
    }
  }

  const actualLevels: { level: ValidCefrLevel; language: Language }[] = []
  stateInput.language_certificates.forEach(cert => {
    const lang = convertCertificateToLanguage(cert)
    if (!state.expected.language || state.expected.language.includes(lang)) {
      const level = convertCertificateToCefrLevel(cert)
      if (level !== 'none' && level !== 'below-a1') {
        actualLevels.push({
          level,
          language: lang,
        })
      }
    }
  })

  return {
    kind: 'language_certificates',
    op: 'cefr-min',
    expected: state.expected,
    actual: actualLevels,
    similarity: getLanguageLevelSimilarity(
      state.expected.level,
      actualLevels.map(l => l.level).flat(),
      CEFR_LEVELS.slice(2),
    ),
  }
}

const getClbMinOutput = (
  _context: Context,
  state: Extract<LanguageCertificatesState, { op: 'clb-min' }>,
  stateInput: LanguageCertificatesStateInput,
): Extract<LanguageCertificatesStateOutput, { op: 'clb-min' }> => {
  if (
    !stateInput.language_certificates ||
    stateInput.language_certificates.length === 0
  ) {
    return {
      kind: 'language_certificates',
      op: 'clb-min',
      expected: state.expected,
      similarity: DEFAULT_LANGUAGE_CERTIFICATES_SIMILARITY,
    }
  }

  const actualLevels: ValidClbLevel[] = []
  stateInput.language_certificates.forEach(cert => {
    const level = convertCertificateToClbLevel(cert)
    if (level !== 'none') {
      actualLevels.push(level)
    }
  })

  return {
    kind: 'language_certificates',
    op: 'clb-min',
    expected: state.expected,
    actual: actualLevels,
    similarity: getLanguageLevelSimilarity(
      state.expected,
      actualLevels,
      CLB_LEVELS.slice(1),
    ),
  }
}

const getClbSectionsMinOutput = (
  _context: Context,
  state: Extract<LanguageCertificatesState, { op: 'clb-sections-min' }>,
  stateInput: LanguageCertificatesStateInput,
): Extract<LanguageCertificatesStateOutput, { op: 'clb-sections-min' }> => {
  const filters: Extract<
    LanguageCertificatesStateOutput,
    { op: 'clb-sections-min' }
  >['filters'] = {}

  if (
    !stateInput.language_certificates ||
    stateInput.language_certificates.length === 0
  ) {
    // Initialize filters with DEFAULT_LANGUAGE_CERTIFICATES_SIMILARITY similarity for missing data
    Object.keys(state.expected).forEach(section => {
      const key = section as keyof typeof state.expected

      if (state.expected[key]) {
        filters[key] = {
          expected: state.expected[key],
          similarity: DEFAULT_LANGUAGE_CERTIFICATES_SIMILARITY,
        }
      }
    })

    return {
      kind: 'language_certificates',
      op: 'clb-sections-min',
      filters,
      similarity: DEFAULT_LANGUAGE_CERTIFICATES_SIMILARITY,
    }
  }

  // Find best matching certificate for each section
  const sections = ['listening', 'reading', 'speaking', 'writing'] as const

  sections.forEach(section => {
    const expectedLevel = state.expected[section]

    if (!expectedLevel) {
      return
    }

    let bestActual: ValidClbLevel | undefined
    let bestSimilarity = 0

    stateInput.language_certificates!.forEach(cert => {
      const actualLevel = convertCertificateSectionToClbLevel(cert, section)

      if (actualLevel && actualLevel !== 'none') {
        const similarity = getLanguageLevelSimilarity(
          [expectedLevel],
          [actualLevel],
          CLB_LEVELS.slice(1),
        )

        if (similarity > bestSimilarity) {
          bestSimilarity = similarity
          bestActual = actualLevel
        }
      }
    })

    filters[section] = {
      expected: expectedLevel,
      actual: bestActual,
      similarity: bestActual
        ? bestSimilarity
        : DEFAULT_LANGUAGE_CERTIFICATES_SIMILARITY,
    }
  })

  const avgSimilarity =
    Object.values(filters).reduce((sum, filter) => sum + filter.similarity, 0) /
    Object.values(filters).length

  return {
    kind: 'language_certificates',
    op: 'clb-sections-min',
    filters,
    similarity: avgSimilarity,
  }
}

const getFourSectionsCertificateMinOutput = (
  _context: Context,
  state: Extract<
    LanguageCertificatesState,
    { op: 'four-sections-certificate-min' }
  >,
  stateInput: LanguageCertificatesStateInput,
): Extract<
  LanguageCertificatesStateOutput,
  { op: 'four-sections-certificate-min' }
> => {
  const filters: Extract<
    LanguageCertificatesStateOutput,
    { op: 'four-sections-certificate-min' }
  >['filters'] = {}

  if (
    !stateInput.language_certificates ||
    stateInput.language_certificates.length === 0
  ) {
    // Initialize filters with DEFAULT_LANGUAGE_CERTIFICATES_SIMILARITY similarity for missing data
    Object.keys(state.expected).forEach(section => {
      const key = section as keyof typeof state.expected

      if (state.expected[key] !== undefined) {
        filters[key] = {
          expected: state.expected[key],
          similarity: DEFAULT_LANGUAGE_CERTIFICATES_SIMILARITY,
        }
      }
    })

    return {
      kind: 'language_certificates',
      op: 'four-sections-certificate-min',
      type: state.type,
      filters,
      similarity: DEFAULT_LANGUAGE_CERTIFICATES_SIMILARITY,
    }
  }

  // Find matching certificate of the specified type
  const matchingCert = stateInput.language_certificates.find(
    cert => cert.type === state.type,
  ) as Extract<LanguageCertificateInput, { type: typeof state.type }>

  const sections = [
    'listening',
    'reading',
    'speaking',
    'writing',
    'overall',
  ] as const

  sections.forEach(section => {
    if (state.expected[section] === undefined) return
    if (section === 'overall') {
      const expectedOverall = state.expected.overall!
      const actualOverall = matchingCert
        ? matchingCert.type === 'oet' || matchingCert.type === 'toefl'
          ? matchingCert.total
          : matchingCert.type === 'tcf-canada'
            ? undefined
            : matchingCert.overall
        : undefined

      filters.overall = {
        expected: expectedOverall,
        actual: actualOverall === undefined ? undefined : Number(actualOverall),
        similarity:
          actualOverall !== undefined
            ? getPercentageSimilarity(
                expectedOverall,
                Number(actualOverall),
                '>=',
              )
            : DEFAULT_LANGUAGE_CERTIFICATES_SIMILARITY,
      }
    } else {
      const expectedScore = state.expected[section]
      const actualScore = matchingCert ? matchingCert[section] : undefined

      filters[section] = {
        expected: expectedScore,
        actual: actualScore === undefined ? undefined : Number(actualScore),
        similarity:
          actualScore !== undefined
            ? getPercentageSimilarity(expectedScore, Number(actualScore), '>=')
            : DEFAULT_LANGUAGE_CERTIFICATES_SIMILARITY,
      }
    }
  })

  const avgSimilarity =
    Object.values(filters).reduce((sum, filter) => sum + filter.similarity, 0) /
    Object.values(filters).length

  return {
    kind: 'language_certificates',
    op: 'four-sections-certificate-min',
    type: state.type,
    filters,
    similarity: avgSimilarity,
  }
}

const getIeltsMinOutput = (
  _context: Context,
  state: Extract<LanguageCertificatesState, { op: 'ielts-min' }>,
  stateInput: LanguageCertificatesStateInput,
): Extract<LanguageCertificatesStateOutput, { op: 'ielts-min' }> => {
  const filters: Extract<
    LanguageCertificatesStateOutput,
    { op: 'ielts-min' }
  >['filters'] = {}

  if (
    !stateInput.language_certificates ||
    stateInput.language_certificates.length === 0
  ) {
    // Initialize filters with DEFAULT_LANGUAGE_CERTIFICATES_SIMILARITY similarity for missing data
    Object.keys(state.expected).forEach(section => {
      const key = section as keyof typeof state.expected

      if (state.expected[key]) {
        filters[key] = {
          expected: state.expected[key],
          similarity: DEFAULT_LANGUAGE_CERTIFICATES_SIMILARITY,
        }
      }
    })

    return {
      kind: 'language_certificates',
      op: 'ielts-min',
      type: state.type,
      filters,
      similarity: DEFAULT_LANGUAGE_CERTIFICATES_SIMILARITY,
    }
  }

  // Find matching IELTS certificate
  const matchingCert = stateInput.language_certificates.find(
    cert => cert.type === state.type,
  ) as Extract<LanguageCertificateInput, { type: typeof state.type }>

  const sections = [
    'listening',
    'reading',
    'writing',
    'speaking',
    'overall',
  ] as const

  sections.forEach(section => {
    if (!state.expected[section]) return
    if (section === 'overall') {
      const expectedOverall = state.expected.overall!
      const actualOverall = matchingCert

      filters.overall = {
        expected: expectedOverall,
        actual: actualOverall?.toString() as IeltsScore,
        similarity:
          actualOverall !== undefined
            ? getIELTSScoreSimilarity(
                expectedOverall,
                actualOverall.toString() as IeltsScore,
              )
            : DEFAULT_LANGUAGE_CERTIFICATES_SIMILARITY,
      }
    } else {
      const expectedScore = state.expected[section]
      const actualScore = matchingCert ? matchingCert[section] : undefined

      filters[section] = {
        expected: expectedScore,
        actual: actualScore,
        similarity: actualScore
          ? getIELTSScoreSimilarity(expectedScore, actualScore)
          : DEFAULT_LANGUAGE_CERTIFICATES_SIMILARITY,
      }
    }
  })

  const avgSimilarity =
    Object.values(filters).reduce((sum, filter) => sum + filter.similarity, 0) /
    Object.values(filters).length

  return {
    kind: 'language_certificates',
    op: 'ielts-min',
    type: state.type,
    filters,
    similarity: avgSimilarity,
  }
}

const getGeseMinOutput = (
  _context: Context,
  state: Extract<LanguageCertificatesState, { op: 'gese-min' }>,
  stateInput: LanguageCertificatesStateInput,
): Extract<LanguageCertificatesStateOutput, { op: 'gese-min' }> => {
  if (
    !stateInput.language_certificates ||
    stateInput.language_certificates.length === 0
  ) {
    return {
      kind: 'language_certificates',
      op: 'gese-min',
      expected: state.expected,
      similarity: DEFAULT_LANGUAGE_CERTIFICATES_SIMILARITY,
    }
  }

  // Find GESE certificate
  const geseCert = stateInput.language_certificates.find(
    cert => cert.type === 'gese',
  ) as Extract<LanguageCertificateInput, { type: 'gese' }>

  const actualGrade = geseCert ? geseCert.grade : undefined

  return {
    kind: 'language_certificates',
    op: 'gese-min',
    expected: state.expected,
    actual: actualGrade,
    similarity:
      actualGrade !== undefined
        ? getPercentageSimilarity(state.expected, actualGrade, '>=')
        : DEFAULT_LANGUAGE_CERTIFICATES_SIMILARITY,
  }
}

const getOverallCertificateMinOutput = (
  _context: Context,
  state: Extract<LanguageCertificatesState, { op: 'overall-certificate-min' }>,
  stateInput: LanguageCertificatesStateInput,
): Extract<
  LanguageCertificatesStateOutput,
  { op: 'overall-certificate-min' }
> => {
  const filters: Extract<
    LanguageCertificatesStateOutput,
    { op: 'overall-certificate-min' }
  >['filters'] = {}

  if (
    !stateInput.language_certificates ||
    stateInput.language_certificates.length === 0
  ) {
    // Initialize filters with DEFAULT_LANGUAGE_CERTIFICATES_SIMILARITY similarity for missing data
    Object.keys(state.expected).forEach(section => {
      const key = section as keyof typeof state.expected

      if (state.expected[key] !== undefined) {
        filters[key] = {
          expected: state.expected[key],
          similarity: DEFAULT_LANGUAGE_CERTIFICATES_SIMILARITY,
        }
      }
    })

    return {
      kind: 'language_certificates',
      op: 'overall-certificate-min',
      type: state.type,
      filters,
      similarity: DEFAULT_LANGUAGE_CERTIFICATES_SIMILARITY,
    }
  }

  // Find matching certificate of the specified type
  const matchingCert = stateInput.language_certificates.find(
    cert => cert.type === state.type,
  ) as Extract<LanguageCertificateInput, { type: typeof state.type }>

  const sections = [
    'listening',
    'reading',
    'speaking',
    'writing',
    'overall',
  ] as const

  sections.forEach(section => {
    if (state.expected[section] === undefined) return

    const expectedScore = state.expected[section]
    const actualScore = matchingCert ? matchingCert[section] : undefined

    filters[section] = {
      expected: expectedScore,
      actual: actualScore,
      similarity:
        actualScore !== undefined
          ? getPercentageSimilarity(expectedScore, actualScore, '>=')
          : DEFAULT_LANGUAGE_CERTIFICATES_SIMILARITY,
    }
  })

  const avgSimilarity =
    Object.values(filters).reduce((sum, filter) => sum + filter.similarity, 0) /
    Object.values(filters).length

  return {
    kind: 'language_certificates',
    op: 'overall-certificate-min',
    type: state.type,
    filters,
    similarity: avgSimilarity,
  }
}

// Main export function
export const getLanguageCertificatesStateOutput = (
  context: Context,
  state: LanguageCertificatesState,
  stateInput: LanguageCertificatesStateInput,
): LanguageCertificatesStateOutput => {
  switch (state.op) {
    case 'auen-min':
      return getAuenMinOutput(context, state, stateInput)
    case 'cefr-min':
      return getCefrMinOutput(context, state, stateInput)
    case 'clb-min':
      return getClbMinOutput(context, state, stateInput)
    case 'clb-sections-min':
      return getClbSectionsMinOutput(context, state, stateInput)
    case 'four-sections-certificate-min':
      return getFourSectionsCertificateMinOutput(context, state, stateInput)
    case 'ielts-min':
      return getIeltsMinOutput(context, state, stateInput)
    case 'gese-min':
      return getGeseMinOutput(context, state, stateInput)
    case 'overall-certificate-min':
      return getOverallCertificateMinOutput(context, state, stateInput)
  }
}
