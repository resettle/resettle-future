import type {
  LanguageCertificateInput,
  LanguageCertificateOutput,
} from './certificates'
import type { CefrLevel, ValidCefrLevel } from './levels'

export const convertCefrToCertificate = (
  level: ValidCefrLevel,
  type:
    | 'cae'
    | 'cpe'
    | 'fce'
    | 'fce-for-schools'
    | 'gese'
    | 'ielts-academic'
    | 'ielts-general'
    | 'ket'
    | 'oet'
    | 'pet'
    | 'tcf-canada'
    | 'toefl',
): LanguageCertificateOutput | null => {
  switch (type) {
    case 'cae':
      switch (level) {
        case 'c2':
          return {
            type,
            listening: 200,
            reading: 200,
            writing: 200,
            speaking: 200,
          }
        case 'c1':
          return {
            type,
            listening: 180,
            reading: 180,
            writing: 180,
            speaking: 180,
          }
        case 'b2':
          return {
            type,
            listening: 160,
            reading: 160,
            writing: 160,
            speaking: 160,
          }
        default:
          return null
      }
    case 'cpe':
      switch (level) {
        case 'c2':
          return {
            type,
            listening: 200,
            reading: 200,
            writing: 200,
            speaking: 200,
          }
        case 'c1':
          return {
            type,
            listening: 180,
            reading: 180,
            writing: 180,
            speaking: 180,
          }
        default:
          return null
      }
    case 'fce':
    case 'fce-for-schools':
      switch (level) {
        case 'c1':
          return {
            type,
            listening: 180,
            reading: 180,
            writing: 180,
            speaking: 180,
          }
        case 'b2':
          return {
            type,
            listening: 160,
            reading: 160,
            writing: 160,
            speaking: 160,
          }
        case 'b1':
          return {
            type,
            listening: 140,
            reading: 140,
            writing: 140,
            speaking: 140,
          }
        default:
          return null
      }
    case 'gese':
      switch (level) {
        case 'c2':
          return {
            type,
            grade: 12,
          }
        case 'c1':
          return {
            type,
            grade: 10,
          }
        case 'b2':
          return {
            type,
            grade: 7,
          }
        case 'b1':
          return {
            type,
            grade: 5,
          }
        case 'a2':
          return {
            type,
            grade: 3,
          }
        case 'a1':
          return {
            type,
            grade: 2,
          }
      }
    case 'ielts-academic':
    case 'ielts-general':
      switch (level) {
        case 'c2':
          return {
            type,
            listening: '8.5',
            reading: '8.5',
            writing: '8.5',
            speaking: '8.5',
          }
        case 'c1':
          return {
            type,
            listening: '7',
            reading: '7',
            writing: '7',
            speaking: '7',
          }
        case 'b2':
          return {
            type,
            listening: '5.5',
            reading: '5.5',
            writing: '5.5',
            speaking: '5.5',
          }
        case 'b1':
          return {
            type,
            listening: '4',
            reading: '4',
            writing: '4',
            speaking: '4',
          }
        case 'a2':
          return {
            type,
            listening: '3',
            reading: '3',
            writing: '3',
            speaking: '3',
          }
        case 'a1':
          return {
            type,
            listening: '2',
            reading: '2',
            writing: '2',
            speaking: '2',
          }
      }
    case 'ket':
      switch (level) {
        case 'b1':
          return {
            type,
            listening: 140,
            reading: 140,
            writing: 140,
            speaking: 140,
          }
        case 'a2': {
          return {
            type,
            listening: 120,
            reading: 120,
            writing: 120,
            speaking: 120,
          }
        }
        default:
          return null
      }
    case 'oet':
      switch (level) {
        case 'c2':
          return {
            type,
            listening: 400,
            reading: 450,
            writing: 450,
            speaking: 450,
          }
        case 'c1':
          return {
            type,
            listening: 350,
            reading: 350,
            writing: 350,
            speaking: 350,
          }
        case 'b2':
          return {
            type,
            listening: 200,
            reading: 200,
            writing: 200,
            speaking: 200,
          }
        default:
          return null
      }
    case 'pet':
      switch (level) {
        case 'b2':
          return {
            type,
            listening: 160,
            reading: 160,
            writing: 160,
            speaking: 160,
          }
        case 'b1':
          return {
            type,
            listening: 140,
            reading: 140,
            writing: 140,
            speaking: 140,
          }
        case 'a2': {
          return {
            type,
            listening: 120,
            reading: 120,
            writing: 120,
            speaking: 120,
          }
        }
        default:
          return null
      }
    case 'tcf-canada':
      switch (level) {
        default:
          return null
      }
    case 'toefl':
      switch (level) {
        default:
          return null
      }
  }
}

export const convertCertificateToCefr = (
  certificate: LanguageCertificateInput,
): CefrLevel => {
  switch (certificate.type) {
  }

  return 'none'
}
