/*
import {
  AUSTRALIAN_ENGLISH_LEVELS,
  CEFR_LEVELS,
  CLB_LEVELS,
  convertCAEToAustralianEnglish,
  convertCAEToCEFR,
  convertCELPIPGeneralToCLB,
  convertCELPIPGeneralToCLBOverall,
  convertCPEToCEFR,
  convertFCEForSchoolsToCEFR,
  convertFCEToCEFR,
  convertGESEToCEFR,
  convertIELTSAcademicToAustralianEnglish,
  convertIELTSAcademicToCEFROverall,
  convertIELTSGeneralToAustralianEnglish,
  convertIELTSGeneralToCEFROverall,
  convertIELTSGeneralToCLBBySection,
  convertIELTSGeneralToCLBOverall,
  convertKETToCEFR,
  convertPETToCEFR,
  convertPTEAcademicToAustralianEnglish,
  convertPTECoreToCLBLevelBySection,
  convertPTECoreToCLBOverall,
  convertTCFCanadaToCLBLevelBySection,
  convertTCFCanadaToCLBOverall,
  convertTEFCanadaToCLBLevelBySection,
  convertTEFCanadaToCLBOverall,
  convertTOEFLToAustralianEnglish,
  convertTOEFLToCEFROverall,
  getCAEOverall,
  getCPEOverall,
  getFCEForSchoolsOverall,
  getFCEOverall,
  getIELTSAcademicOverall,
  getIELTSGeneralOverall,
  getKETOverall,
  getPETOverall,
  getTOEFLOverall,
  JLPT_LEVELS,
  type CLBLevel,
  type IELTSAcademicScore,
  type IELTSGeneralScore,
  type JLPTLevel,
  type Language,
  type LanguageCertificate,
  type ValidAustralianEnglishLevel,
  type ValidCEFRLevel,
  type ValidCLBLevel,
} from '@resettle/common'

import type { Context } from '../types'
import { getPercentageSimilarity } from '../utils/similarity'

export const DEFAULT_LANGUAGE_CERTIFICATES_SIMILARITY = 0.2

export type LanguageCertificatesStateInput = {
  language_certificates?: LanguageCertificate[]
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
        level: ValidCEFRLevel[]
        language?: Language[]
      }
    }
  | {
      kind: 'language_certificates'
      op: 'clb-min'
      expected: ValidCLBLevel[]
    }
  | {
      kind: 'language_certificates'
      op: 'clb-sections-min'
      expected: {
        listening?: ValidCLBLevel
        reading?: ValidCLBLevel
        speaking?: ValidCLBLevel
        writing?: ValidCLBLevel
      }
    }
  | {
      kind: 'language_certificates'
      op: 'four-sections-certificate-min'
      type:
        | 'CELPIP_GENERAL'
        | 'KET'
        | 'OET'
        | 'PET'
        | 'TCF_CANADA'
        | 'TEF_CANADA'
        | 'TOEFL'
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
      op: 'five-sections-certificate-min'
      type: 'CAE' | 'CPE' | 'FCE' | 'FCE_FOR_SCHOOLS'
      expected: {
        overall?: number
        listening?: number
        reading?: number
        writing?: number
        speaking?: number
        use_of_english?: number
      }
    }
  | {
      kind: 'language_certificates'
      op: 'ielts-academic-min'
      expected: {
        overall?: IELTSAcademicScore
        listening?: IELTSAcademicScore
        reading?: IELTSAcademicScore
        writing?: IELTSAcademicScore
        speaking?: IELTSAcademicScore
      }
    }
  | {
      kind: 'language_certificates'
      op: 'ielts-general-min'
      expected: {
        overall?: IELTSGeneralScore
        listening?: IELTSGeneralScore
        reading?: IELTSGeneralScore
        writing?: IELTSGeneralScore
        speaking?: IELTSGeneralScore
      }
    }
  | {
      kind: 'language_certificates'
      op: 'gese-min'
      expected: number
    }
  | {
      kind: 'language_certificates'
      op: 'jlpt-min'
      expected: JLPTLevel
    }
  | {
      kind: 'language_certificates'
      op: 'overall-certificate-min'
      type: 'PTE_ACADEMIC' | 'PTE_CORE'
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
        level: ValidCEFRLevel[]
        language?: Language[]
      }
      actual?: {
        level: ValidCEFRLevel[]
        language: Language
      }[]
      similarity: number
    }
  | {
      kind: 'language_certificates'
      op: 'clb-min'
      expected: ValidCLBLevel[]
      actual?: ValidCLBLevel[]
      similarity: number
    }
  | {
      kind: 'language_certificates'
      op: 'clb-sections-min'
      filters: {
        listening?: {
          expected: ValidCLBLevel
          actual?: ValidCLBLevel
          similarity: number
        }
        reading?: {
          expected: ValidCLBLevel
          actual?: ValidCLBLevel
          similarity: number
        }
        speaking?: {
          expected: ValidCLBLevel
          actual?: ValidCLBLevel
          similarity: number
        }
        writing?: {
          expected: ValidCLBLevel
          actual?: ValidCLBLevel
          similarity: number
        }
      }
      similarity: number
    }
  | {
      kind: 'language_certificates'
      op: 'four-sections-certificate-min'
      type:
        | 'CELPIP_GENERAL'
        | 'KET'
        | 'OET'
        | 'PET'
        | 'TCF_CANADA'
        | 'TEF_CANADA'
        | 'TOEFL'
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
      op: 'five-sections-certificate-min'
      type: 'CAE' | 'CPE' | 'FCE' | 'FCE_FOR_SCHOOLS'
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
        use_of_english?: {
          expected: number
          actual?: number
          similarity: number
        }
      }
      similarity: number
    }
  | {
      kind: 'language_certificates'
      op: 'ielts-academic-min'
      filters: {
        overall?: {
          expected: IELTSAcademicScore
          actual?: IELTSAcademicScore
          similarity: number
        }
        listening?: {
          expected: IELTSAcademicScore
          actual?: IELTSAcademicScore
          similarity: number
        }
        reading?: {
          expected: IELTSAcademicScore
          actual?: IELTSAcademicScore
          similarity: number
        }
        writing?: {
          expected: IELTSAcademicScore
          actual?: IELTSAcademicScore
          similarity: number
        }
        speaking?: {
          expected: IELTSAcademicScore
          actual?: IELTSAcademicScore
          similarity: number
        }
      }
      similarity: number
    }
  | {
      kind: 'language_certificates'
      op: 'ielts-general-min'
      filters: {
        overall?: {
          expected: IELTSGeneralScore
          actual?: IELTSGeneralScore
          similarity: number
        }
        listening?: {
          expected: IELTSGeneralScore
          actual?: IELTSGeneralScore
          similarity: number
        }
        reading?: {
          expected: IELTSGeneralScore
          actual?: IELTSGeneralScore
          similarity: number
        }
        writing?: {
          expected: IELTSGeneralScore
          actual?: IELTSGeneralScore
          similarity: number
        }
        speaking?: {
          expected: IELTSGeneralScore
          actual?: IELTSGeneralScore
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
      op: 'jlpt-min'
      expected: JLPTLevel
      actual?: JLPTLevel
      similarity: number
    }
  | {
      kind: 'language_certificates'
      op: 'overall-certificate-min'
      type: 'PTE_ACADEMIC' | 'PTE_CORE'
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

const getIELTSAcademicScoreSimilarity = (
  expected: IELTSAcademicScore,
  actual: IELTSAcademicScore,
): number => {
  const expectedNum = parseFloat(expected)
  const actualNum = parseFloat(actual)

  return getPercentageSimilarity(expectedNum, actualNum, '>=')
}

const getIELTSGeneralScoreSimilarity = (
  expected: IELTSGeneralScore,
  actual: IELTSGeneralScore,
): number => {
  const expectedNum = parseFloat(expected)
  const actualNum = parseFloat(actual)

  return getPercentageSimilarity(expectedNum, actualNum, '>=')
}

const getJLPTLevelSimilarity = (
  expected: JLPTLevel,
  actual: JLPTLevel,
): number => {
  const expectedIndex = JLPT_LEVELS.indexOf(expected)
  const actualIndex = JLPT_LEVELS.indexOf(actual)

  if (actualIndex <= expectedIndex) {
    return 1
  }

  const maxIndex = JLPT_LEVELS.length - 1
  const expectedValue = maxIndex - expectedIndex
  const actualValue = maxIndex - actualIndex

  if (expectedValue === 0) {
    // This case should ideally not be hit if actualIndex > expectedIndex,
    // as N5 is the lowest level, but as a safeguard:
    return 0
  }

  return actualValue / expectedValue
}

// Convert language certificates to their equivalent levels using common package functions
const convertCertificateToAustralianEnglish = (
  cert: LanguageCertificate,
): ValidAustralianEnglishLevel[] => {
  const levels: ValidAustralianEnglishLevel[] = []

  const convertedLevel = (() => {
    switch (cert.type) {
      case 'IELTS_ACADEMIC':
        return convertIELTSAcademicToAustralianEnglish(cert)
      case 'IELTS_GENERAL':
        return convertIELTSGeneralToAustralianEnglish(cert)
      case 'CAE':
        return convertCAEToAustralianEnglish(cert)
      case 'TOEFL':
        return convertTOEFLToAustralianEnglish(cert)
      case 'PTE_ACADEMIC':
        return convertPTEAcademicToAustralianEnglish(cert)
      default:
        return 'None' as const
    }
  })()

  if (convertedLevel !== 'None') {
    levels.push(convertedLevel)
  }

  return levels
}

const convertCertificateToCEFR = (
  cert: LanguageCertificate,
): ValidCEFRLevel[] => {
  const levels: ValidCEFRLevel[] = []

  const convertedLevel = (() => {
    switch (cert.type) {
      case 'IELTS_ACADEMIC':
        return convertIELTSAcademicToCEFROverall(cert)
      case 'IELTS_GENERAL':
        return convertIELTSGeneralToCEFROverall(cert)
      case 'CAE':
        return convertCAEToCEFR(cert)
      case 'CPE':
        return convertCPEToCEFR(cert)
      case 'FCE':
        return convertFCEToCEFR(cert)
      case 'FCE_FOR_SCHOOLS':
        return convertFCEForSchoolsToCEFR(cert)
      case 'KET':
        return convertKETToCEFR(cert)
      case 'PET':
        return convertPETToCEFR(cert)
      case 'TOEFL':
        return convertTOEFLToCEFROverall(cert)
      case 'GESE':
        return convertGESEToCEFR(cert)
      default:
        return 'None' as const
    }
  })()

  if (convertedLevel !== 'None' && convertedLevel !== 'BelowA1') {
    levels.push(convertedLevel)
  }

  return levels
}

const convertCertificateToCLB = (
  cert: LanguageCertificate,
): ValidCLBLevel[] => {
  const levels: ValidCLBLevel[] = []

  const convertedLevel = (() => {
    switch (cert.type) {
      case 'CELPIP_GENERAL':
        return convertCELPIPGeneralToCLBOverall(cert)
      case 'IELTS_GENERAL':
        return convertIELTSGeneralToCLBOverall(cert)
      case 'PTE_CORE':
        return convertPTECoreToCLBOverall(cert)
      case 'TCF_CANADA':
        return convertTCFCanadaToCLBOverall(cert)
      case 'TEF_CANADA':
        return convertTEFCanadaToCLBOverall(cert)
      default:
        return 'None' as const
    }
  })()

  if (convertedLevel !== 'None') {
    levels.push(convertedLevel)
  }

  return levels
}

const convertCertificateToLanguage = (cert: LanguageCertificate): Language => {
  switch (cert.type) {
    case 'GOETHE':
      return 'de'
    case 'JLPT':
      return 'ja'
    case 'TCF_CANADA':
    case 'TEF_CANADA':
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
    const levels = convertCertificateToAustralianEnglish(cert)
    actualLevels.push(...levels)
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

  const actualLevels: { level: ValidCEFRLevel[]; language: Language }[] = []
  stateInput.language_certificates.forEach(cert => {
    const lang = convertCertificateToLanguage(cert)
    if (!state.expected.language || state.expected.language.includes(lang)) {
      const levels = convertCertificateToCEFR(cert)
      actualLevels.push({
        level: levels,
        language: lang,
      })
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

  const actualLevels: ValidCLBLevel[] = []
  stateInput.language_certificates.forEach(cert => {
    const levels = convertCertificateToCLB(cert)
    actualLevels.push(...levels)
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

    let bestActual: ValidCLBLevel | undefined
    let bestSimilarity = 0

    stateInput.language_certificates!.forEach(cert => {
      let actualLevel: CLBLevel | undefined

      switch (cert.type) {
        case 'CELPIP_GENERAL':
          if (cert[section]) {
            actualLevel = convertCELPIPGeneralToCLB(cert[section])
          }
          break
        case 'IELTS_GENERAL':
          if (cert[section]) {
            actualLevel = convertIELTSGeneralToCLBBySection(
              parseFloat(cert[section]),
              section,
            )
          }
          break
        case 'PTE_CORE':
          if (cert[section]) {
            actualLevel = convertPTECoreToCLBLevelBySection(
              cert[section],
              section,
            )
          }
          break
        case 'TCF_CANADA':
          if (cert[section]) {
            actualLevel = convertTCFCanadaToCLBLevelBySection(
              cert[section],
              section,
            )
          }
          break
        case 'TEF_CANADA':
          if (cert[section]) {
            actualLevel = convertTEFCanadaToCLBLevelBySection(
              cert[section],
              section,
            )
          }
          break
      }

      if (actualLevel && actualLevel !== 'None') {
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
  ) as Extract<LanguageCertificate, { type: typeof state.type }>

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
        ? matchingCert.type === 'KET'
          ? getKETOverall(matchingCert)
          : matchingCert.type === 'PET'
            ? getPETOverall(matchingCert)
            : matchingCert.type === 'TOEFL'
              ? getTOEFLOverall(matchingCert)
              : undefined
        : undefined

      filters.overall = {
        expected: expectedOverall,
        actual: actualOverall,
        similarity:
          actualOverall !== undefined
            ? getPercentageSimilarity(expectedOverall, actualOverall, '>=')
            : DEFAULT_LANGUAGE_CERTIFICATES_SIMILARITY,
      }
    } else {
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

const getFiveSectionsCertificateMinOutput = (
  _context: Context,
  state: Extract<
    LanguageCertificatesState,
    { op: 'five-sections-certificate-min' }
  >,
  stateInput: LanguageCertificatesStateInput,
): Extract<
  LanguageCertificatesStateOutput,
  { op: 'five-sections-certificate-min' }
> => {
  const filters: Extract<
    LanguageCertificatesStateOutput,
    { op: 'five-sections-certificate-min' }
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
      op: 'five-sections-certificate-min',
      type: state.type,
      filters,
      similarity: DEFAULT_LANGUAGE_CERTIFICATES_SIMILARITY,
    }
  }

  // Find matching certificate of the specified type
  const matchingCert = stateInput.language_certificates.find(
    cert => cert.type === state.type,
  ) as Extract<LanguageCertificate, { type: typeof state.type }>

  const sections = [
    'listening',
    'reading',
    'writing',
    'speaking',
    'use_of_english',
    'overall',
  ] as const

  sections.forEach(section => {
    if (state.expected[section] === undefined) return
    if (section === 'overall') {
      const expectedOverall = state.expected.overall!
      const actualOverall = matchingCert
        ? matchingCert.type === 'CAE'
          ? getCAEOverall(matchingCert)
          : matchingCert.type === 'CPE'
            ? getCPEOverall(matchingCert)
            : matchingCert.type === 'FCE'
              ? getFCEOverall(matchingCert)
              : getFCEForSchoolsOverall(matchingCert)
        : undefined

      filters.overall = {
        expected: expectedOverall,
        actual: actualOverall,
        similarity:
          actualOverall !== undefined
            ? getPercentageSimilarity(expectedOverall, actualOverall, '>=')
            : DEFAULT_LANGUAGE_CERTIFICATES_SIMILARITY,
      }
    } else {
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
    }
  })

  const avgSimilarity =
    Object.values(filters).reduce((sum, filter) => sum + filter.similarity, 0) /
    Object.values(filters).length

  return {
    kind: 'language_certificates',
    op: 'five-sections-certificate-min',
    type: state.type,
    filters,
    similarity: avgSimilarity,
  }
}

const getIeltsAcademicMinOutput = (
  _context: Context,
  state: Extract<LanguageCertificatesState, { op: 'ielts-academic-min' }>,
  stateInput: LanguageCertificatesStateInput,
): Extract<LanguageCertificatesStateOutput, { op: 'ielts-academic-min' }> => {
  const filters: Extract<
    LanguageCertificatesStateOutput,
    { op: 'ielts-academic-min' }
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
      op: 'ielts-academic-min',
      filters,
      similarity: DEFAULT_LANGUAGE_CERTIFICATES_SIMILARITY,
    }
  }

  // Find matching IELTS certificate
  const matchingCert = stateInput.language_certificates.find(
    cert => cert.type === 'IELTS_ACADEMIC',
  ) as Extract<LanguageCertificate, { type: 'IELTS_ACADEMIC' }>

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
        ? getIELTSAcademicOverall(matchingCert)
        : undefined

      filters.overall = {
        expected: expectedOverall,
        actual: actualOverall?.toString() as IELTSAcademicScore,
        similarity:
          actualOverall !== undefined
            ? getIELTSAcademicScoreSimilarity(
                expectedOverall,
                actualOverall.toString() as IELTSAcademicScore,
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
          ? getIELTSAcademicScoreSimilarity(expectedScore, actualScore)
          : DEFAULT_LANGUAGE_CERTIFICATES_SIMILARITY,
      }
    }
  })

  const avgSimilarity =
    Object.values(filters).reduce((sum, filter) => sum + filter.similarity, 0) /
    Object.values(filters).length

  return {
    kind: 'language_certificates',
    op: 'ielts-academic-min',
    filters,
    similarity: avgSimilarity,
  }
}

const getIeltsGeneralMinOutput = (
  _context: Context,
  state: Extract<LanguageCertificatesState, { op: 'ielts-general-min' }>,
  stateInput: LanguageCertificatesStateInput,
): Extract<LanguageCertificatesStateOutput, { op: 'ielts-general-min' }> => {
  const filters: Extract<
    LanguageCertificatesStateOutput,
    { op: 'ielts-general-min' }
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
      op: 'ielts-general-min',
      filters,
      similarity: DEFAULT_LANGUAGE_CERTIFICATES_SIMILARITY,
    }
  }

  // Find matching IELTS certificate
  const matchingCert = stateInput.language_certificates.find(
    cert => cert.type === 'IELTS_GENERAL',
  ) as Extract<LanguageCertificate, { type: 'IELTS_GENERAL' }>

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
        ? getIELTSGeneralOverall(matchingCert)
        : undefined

      filters.overall = {
        expected: expectedOverall,
        actual: actualOverall?.toString() as IELTSGeneralScore,
        similarity:
          actualOverall !== undefined
            ? getIELTSGeneralScoreSimilarity(
                expectedOverall,
                actualOverall.toString() as IELTSGeneralScore,
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
          ? getIELTSGeneralScoreSimilarity(expectedScore, actualScore)
          : DEFAULT_LANGUAGE_CERTIFICATES_SIMILARITY,
      }
    }
  })

  const avgSimilarity =
    Object.values(filters).reduce((sum, filter) => sum + filter.similarity, 0) /
    Object.values(filters).length

  return {
    kind: 'language_certificates',
    op: 'ielts-general-min',
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
    cert => cert.type === 'GESE',
  ) as Extract<LanguageCertificate, { type: 'GESE' }>

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

const getJlptMinOutput = (
  _context: Context,
  state: Extract<LanguageCertificatesState, { op: 'jlpt-min' }>,
  stateInput: LanguageCertificatesStateInput,
): Extract<LanguageCertificatesStateOutput, { op: 'jlpt-min' }> => {
  if (
    !stateInput.language_certificates ||
    stateInput.language_certificates.length === 0
  ) {
    return {
      kind: 'language_certificates',
      op: 'jlpt-min',
      expected: state.expected,
      similarity: DEFAULT_LANGUAGE_CERTIFICATES_SIMILARITY,
    }
  }

  // Find JLPT certificate
  const jlptCert = stateInput.language_certificates.find(
    cert => cert.type === 'JLPT',
  ) as Extract<LanguageCertificate, { type: 'JLPT' }>

  const actualLevel = jlptCert ? jlptCert.level : undefined

  return {
    kind: 'language_certificates',
    op: 'jlpt-min',
    expected: state.expected,
    actual: actualLevel,
    similarity: actualLevel
      ? getJLPTLevelSimilarity(state.expected, actualLevel)
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
  ) as Extract<LanguageCertificate, { type: typeof state.type }>

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
    case 'five-sections-certificate-min':
      return getFiveSectionsCertificateMinOutput(context, state, stateInput)
    case 'ielts-academic-min':
      return getIeltsAcademicMinOutput(context, state, stateInput)
    case 'ielts-general-min':
      return getIeltsGeneralMinOutput(context, state, stateInput)
    case 'gese-min':
      return getGeseMinOutput(context, state, stateInput)
    case 'jlpt-min':
      return getJlptMinOutput(context, state, stateInput)
    case 'overall-certificate-min':
      return getOverallCertificateMinOutput(context, state, stateInput)
  }
}
*/
