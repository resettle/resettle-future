import type { CountryAlpha2Code } from '../../_common'
import {
  ieltsScoreGe,
  type LanguageCertificateInput,
  type LanguageCertificateOutput,
} from './certificates'
import {
  clbLevelGe,
  type AustralianEnglishLevel,
  type ValidAustralianEnglishLevel,
} from './levels'

export const convertAustralianEnglishLevelToCertificate = (
  level: ValidAustralianEnglishLevel,
  type:
    | 'cae'
    | 'celpip-general'
    | 'ielts-academic'
    | 'ielts-general'
    | 'languagecert-academic'
    | 'met'
    | 'oet'
    | 'pte-academic'
    | 'toefl',
): LanguageCertificateOutput | null => {
  switch (level) {
    case 'functional':
      switch (type) {
        case 'celpip-general':
          return {
            type,
            overall: '5',
          }
        case 'ielts-academic':
        case 'ielts-general':
          return {
            type,
            overall: '4.5',
          }
        case 'languagecert-academic':
          return {
            type,
            overall: 38,
          }
        case 'met':
          return {
            type,
            overall: 38,
          }
        case 'oet':
          return {
            type,
            total: 1020,
          }
        case 'pte-academic':
          return {
            type,
            overall: 24,
          }
        case 'toefl':
          return {
            type,
            total: 26,
          }
      }

      return null
    case 'vocational':
      switch (type) {
        case 'celpip-general':
          return {
            type,
            listening: '5',
            reading: '5',
            writing: '5',
            speaking: '5',
          }
        case 'ielts-academic':
        case 'ielts-general':
          return {
            type,
            listening: '5',
            reading: '5',
            writing: '5',
            speaking: '5',
          }
        case 'met':
          return {
            type,
            listening: 49,
            reading: 47,
            writing: 45,
            speaking: 38,
          }
        case 'oet':
          return {
            type,
            listening: 220,
            reading: 240,
            writing: 200,
            speaking: 270,
          }
        case 'languagecert-academic':
          return {
            type,
            listening: 41,
            reading: 44,
            writing: 45,
            speaking: 54,
          }
        case 'pte-academic':
          return {
            type,
            listening: 33,
            reading: 36,
            writing: 29,
            speaking: 24,
          }
        case 'toefl':
          return {
            type,
            listening: 8,
            reading: 8,
            writing: 9,
            speaking: 14,
          }
      }

      return null
    case 'competent':
      switch (type) {
        case 'cae':
          return {
            type,
            listening: 163,
            reading: 163,
            writing: 170,
            speaking: 179,
          }
        case 'celpip-general':
          return {
            type,
            listening: '7',
            reading: '7',
            writing: '7',
            speaking: '7',
          }
        case 'ielts-academic':
        case 'ielts-general':
          return {
            type,
            listening: '6',
            reading: '6',
            writing: '6',
            speaking: '6',
          }
        case 'languagecert-academic':
          return {
            type,
            listening: 57,
            reading: 60,
            writing: 64,
            speaking: 70,
          }
        case 'met':
          return {
            type,
            listening: 56,
            reading: 55,
            writing: 57,
            speaking: 48,
          }
        case 'oet':
          return {
            type,
            listening: 290,
            reading: 310,
            writing: 290,
            speaking: 330,
          }
        case 'pte-academic':
          return {
            type,
            listening: 47,
            reading: 48,
            writing: 51,
            speaking: 54,
          }
        case 'toefl':
          return {
            type,
            listening: 16,
            reading: 16,
            writing: 19,
            speaking: 19,
          }
      }
    case 'proficient':
      switch (type) {
        case 'cae':
          return {
            type,
            listening: 175,
            reading: 179,
            writing: 193,
            speaking: 194,
          }
        case 'celpip-general':
          return {
            type,
            listening: '9',
            reading: '8',
            writing: '10',
            speaking: '8',
          }
        case 'ielts-academic':
        case 'ielts-general':
          return {
            type,
            listening: '7',
            reading: '7',
            writing: '7',
            speaking: '7',
          }
        case 'met':
          return {
            type,
            listening: 61,
            reading: 63,
            writing: 74,
            speaking: 59,
          }
        case 'oet':
          return {
            type,
            listening: 350,
            reading: 360,
            writing: 380,
            speaking: 360,
          }
        case 'languagecert-academic':
          return {
            type,
            listening: 67,
            reading: 71,
            writing: 78,
            speaking: 82,
          }
        case 'pte-academic':
          return {
            type,
            listening: 58,
            reading: 59,
            writing: 69,
            speaking: 76,
          }
        case 'toefl':
          return {
            type,
            listening: 22,
            reading: 22,
            writing: 26,
            speaking: 24,
          }
      }
    case 'superior':
      switch (type) {
        case 'cae':
          return {
            type,
            listening: 186,
            reading: 190,
            writing: 210,
            speaking: 208,
          }
        case 'celpip-general':
          return {
            type,
            listening: '10',
            reading: '10',
            writing: '12',
            speaking: '10',
          }
        case 'ielts-academic':
        case 'ielts-general':
          return {
            type,
            listening: '8',
            reading: '8',
            writing: '8',
            speaking: '8',
          }
        case 'oet':
          return {
            type,
            listening: 390,
            reading: 400,
            writing: 420,
            speaking: 400,
          }
        case 'languagecert-academic':
          return {
            type,
            listening: 80,
            reading: 83,
            writing: 89,
            speaking: 89,
          }
        case 'pte-academic':
          return {
            type,
            listening: 69,
            reading: 70,
            writing: 85,
            speaking: 88,
          }
        case 'toefl':
          return {
            type,
            listening: 26,
            reading: 27,
            writing: 30,
            speaking: 28,
          }
      }
      return null
  }
}

export const convertCertificateToAustralianEnglishLevel = (
  certificate: LanguageCertificateInput,
): AustralianEnglishLevel => {
  switch (certificate.type) {
    case 'cae':
      if (
        certificate.listening >= 186 &&
        certificate.reading >= 190 &&
        certificate.writing >= 210 &&
        certificate.speaking >= 208
      ) {
        return 'superior'
      }

      if (
        certificate.listening >= 175 &&
        certificate.reading >= 179 &&
        certificate.writing >= 193 &&
        certificate.speaking >= 194
      ) {
        return 'proficient'
      }

      if (
        certificate.listening >= 163 &&
        certificate.reading >= 163 &&
        certificate.writing >= 170 &&
        certificate.speaking >= 179
      ) {
        return 'competent'
      }

      return 'none'
    case 'celpip-general':
      if (
        clbLevelGe(certificate.listening, '10') &&
        clbLevelGe(certificate.reading, '10') &&
        clbLevelGe(certificate.writing, '12') &&
        clbLevelGe(certificate.speaking, '10')
      ) {
        return 'superior'
      }

      if (
        clbLevelGe(certificate.listening, '9') &&
        clbLevelGe(certificate.reading, '8') &&
        clbLevelGe(certificate.writing, '10') &&
        clbLevelGe(certificate.speaking, '8')
      ) {
        return 'proficient'
      }

      if (
        clbLevelGe(certificate.listening, '7') &&
        clbLevelGe(certificate.reading, '7') &&
        clbLevelGe(certificate.writing, '7') &&
        clbLevelGe(certificate.speaking, '7')
      ) {
        return 'competent'
      }

      if (
        clbLevelGe(certificate.listening, '5') &&
        clbLevelGe(certificate.reading, '5') &&
        clbLevelGe(certificate.writing, '5') &&
        clbLevelGe(certificate.speaking, '5')
      ) {
        return 'vocational'
      }

      if (certificate.overall && clbLevelGe(certificate.overall, '5')) {
        return 'functional'
      }

      return 'none'
    case 'ielts-academic':
    case 'ielts-general':
      if (
        ieltsScoreGe(certificate.listening, '8') &&
        ieltsScoreGe(certificate.reading, '8') &&
        ieltsScoreGe(certificate.writing, '8') &&
        ieltsScoreGe(certificate.speaking, '8')
      ) {
        return 'superior'
      }

      if (
        ieltsScoreGe(certificate.listening, '7') &&
        ieltsScoreGe(certificate.reading, '7') &&
        ieltsScoreGe(certificate.writing, '7') &&
        ieltsScoreGe(certificate.speaking, '7')
      ) {
        return 'proficient'
      }

      if (
        ieltsScoreGe(certificate.listening, '6') &&
        ieltsScoreGe(certificate.reading, '6') &&
        ieltsScoreGe(certificate.writing, '6') &&
        ieltsScoreGe(certificate.speaking, '6')
      ) {
        return 'competent'
      }

      if (
        ieltsScoreGe(certificate.listening, '5') &&
        ieltsScoreGe(certificate.reading, '5') &&
        ieltsScoreGe(certificate.writing, '5') &&
        ieltsScoreGe(certificate.speaking, '5')
      ) {
        return 'vocational'
      }

      if (certificate.overall && ieltsScoreGe(certificate.listening, '4.5')) {
        return 'functional'
      }

      return 'none'
    case 'met':
      if (
        certificate.listening >= 61 &&
        certificate.reading >= 63 &&
        certificate.writing >= 74 &&
        certificate.speaking >= 59
      ) {
        return 'proficient'
      }

      if (
        certificate.listening >= 56 &&
        certificate.reading >= 55 &&
        certificate.writing >= 57 &&
        certificate.speaking >= 48
      ) {
        return 'competent'
      }

      if (
        certificate.listening >= 49 &&
        certificate.reading >= 47 &&
        certificate.writing >= 45 &&
        certificate.speaking >= 38
      ) {
        return 'vocational'
      }

      if (certificate.overall && certificate.overall >= 38) {
        return 'functional'
      }

      return 'none'
    case 'oet':
      if (
        certificate.listening >= 390 &&
        certificate.reading >= 400 &&
        certificate.writing >= 420 &&
        certificate.speaking >= 400
      ) {
        return 'superior'
      }

      if (
        certificate.listening >= 350 &&
        certificate.reading >= 360 &&
        certificate.writing >= 380 &&
        certificate.speaking >= 360
      ) {
        return 'proficient'
      }

      if (
        certificate.listening >= 290 &&
        certificate.reading >= 310 &&
        certificate.writing >= 290 &&
        certificate.speaking >= 330
      ) {
        return 'competent'
      }

      if (
        certificate.listening >= 220 &&
        certificate.reading >= 240 &&
        certificate.writing >= 200 &&
        certificate.speaking >= 270
      ) {
        return 'vocational'
      }

      if (
        (certificate.total && certificate.total >= 1020) ||
        certificate.listening +
          certificate.reading +
          certificate.writing +
          certificate.speaking >=
          1020
      ) {
        return 'functional'
      }

      return 'none'
    case 'languagecert-academic':
      if (
        certificate.listening >= 80 &&
        certificate.reading >= 83 &&
        certificate.writing >= 89 &&
        certificate.speaking >= 89
      ) {
        return 'superior'
      }

      if (
        certificate.listening >= 67 &&
        certificate.reading >= 71 &&
        certificate.writing >= 78 &&
        certificate.speaking >= 82
      ) {
        return 'proficient'
      }

      if (
        certificate.listening >= 57 &&
        certificate.reading >= 60 &&
        certificate.writing >= 64 &&
        certificate.speaking >= 70
      ) {
        return 'competent'
      }

      if (
        certificate.listening >= 41 &&
        certificate.reading >= 44 &&
        certificate.writing >= 45 &&
        certificate.speaking >= 54
      ) {
        return 'vocational'
      }

      if (certificate.overall && certificate.overall >= 38) {
        return 'functional'
      }

      return 'none'
    case 'pte-academic':
      if (
        certificate.listening >= 69 &&
        certificate.reading >= 70 &&
        certificate.writing >= 85 &&
        certificate.speaking >= 88
      ) {
        return 'superior'
      }

      if (
        certificate.listening >= 58 &&
        certificate.reading >= 59 &&
        certificate.writing >= 69 &&
        certificate.speaking >= 76
      ) {
        return 'proficient'
      }

      if (
        certificate.listening >= 47 &&
        certificate.reading >= 48 &&
        certificate.writing >= 51 &&
        certificate.speaking >= 54
      ) {
        return 'competent'
      }

      if (
        certificate.listening >= 33 &&
        certificate.reading >= 36 &&
        certificate.writing >= 29 &&
        certificate.speaking >= 24
      ) {
        return 'vocational'
      }

      if (certificate.overall && certificate.overall >= 24) {
        return 'functional'
      }

      return 'none'
    case 'toefl':
      if (
        certificate.listening >= 26 &&
        certificate.reading >= 27 &&
        certificate.writing >= 30 &&
        certificate.speaking >= 28
      ) {
        return 'superior'
      }

      if (
        certificate.listening >= 22 &&
        certificate.reading >= 22 &&
        certificate.writing >= 26 &&
        certificate.speaking >= 24
      ) {
        return 'proficient'
      }

      if (
        certificate.listening >= 16 &&
        certificate.reading >= 16 &&
        certificate.writing >= 19 &&
        certificate.speaking >= 19
      ) {
        return 'competent'
      }

      if (
        certificate.listening >= 8 &&
        certificate.reading >= 8 &&
        certificate.writing >= 9 &&
        certificate.speaking >= 14
      ) {
        return 'vocational'
      }

      if (
        (certificate.total && certificate.total >= 26) ||
        certificate.listening +
          certificate.reading +
          certificate.writing +
          certificate.speaking >=
          26
      ) {
        return 'functional'
      }

      return 'none'
  }

  return 'none'
}

export const convertAustraliaEnglishLevelToVisa = (
  level: ValidAustralianEnglishLevel,
): { subclass: number; name: string; country: CountryAlpha2Code }[] => {
  switch (level) {
    case 'competent':
      return [
        {
          subclass: 186,
          name: 'Employer Nomination Scheme Visa',
          country: 'AU',
        },
        {
          subclass: 187,
          name: 'Regional Sponsored Migration Scheme Visa',
          country: 'AU',
        },
      ]
    case 'functional':
      return [
        { subclass: 858, name: 'National Innovation Visa', country: 'AU' },
        { subclass: 462, name: 'Work and Holiday Visa', country: 'AU' },
        { subclass: 407, name: 'Training Visa', country: 'AU' },
      ]
  }

  return []
}
