import type {
  LanguageCertificateInput,
  LanguageCertificateOutput,
} from './certificates'
import { CEFR_LEVELS, type CefrLevel, type ValidCefrLevel } from './levels'

export const convertCefrLevelToCertificate = (
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
        case 'c2':
          return {
            type,
            listening: 600,
            reading: 600,
            writing: 16,
            speaking: 16,
          }
        case 'c1':
          return {
            type,
            listening: 500,
            reading: 500,
            writing: 14,
            speaking: 14,
          }
        case 'b2':
          return {
            type,
            listening: 400,
            reading: 400,
            writing: 10,
            speaking: 10,
          }
        case 'b1':
          return {
            type,
            listening: 300,
            reading: 300,
            writing: 6,
            speaking: 6,
          }
        case 'a2':
          return {
            type,
            listening: 200,
            reading: 200,
            writing: 4,
            speaking: 4,
          }
        case 'a1':
          return {
            type,
            listening: 100,
            reading: 100,
            writing: 2,
            speaking: 2,
          }
        default:
          return null
      }
    case 'toefl':
      switch (level) {
        case 'c2':
          return {
            type,
            listening: 28,
            reading: 29,
            speaking: 28,
            writing: 29,
          }
        case 'c1':
          return {
            type,
            listening: 22,
            reading: 24,
            speaking: 25,
            writing: 24,
          }
        case 'b2':
          return {
            type,
            listening: 17,
            reading: 18,
            speaking: 20,
            writing: 17,
          }
        case 'b1':
          return {
            type,
            listening: 9,
            reading: 4,
            speaking: 16,
            writing: 13,
          }
        default:
          return null
      }
  }
}

const roundToHalfOrOne = (num: number): number => {
  const remainder = num % 1

  if (remainder === 0.25) {
    return Math.floor(num) + 0.5
  } else if (remainder === 0.75) {
    return Math.ceil(num)
  }

  return num
}

export const convertCertificateToCefrLevel = (
  certificate: LanguageCertificateInput,
): CefrLevel => {
  switch (certificate.type) {
    case 'cae': {
      const overall =
        certificate.overall ??
        Math.round(
          (certificate.listening +
            certificate.reading +
            certificate.speaking +
            certificate.writing) /
            4,
        )
      if (overall >= 200) return 'c2'
      if (overall >= 180) return 'c1'
      if (overall >= 160) return 'b2'
      return 'none'
    }
    case 'cpe': {
      const overall =
        certificate.overall ??
        Math.round(
          (certificate.listening +
            certificate.reading +
            certificate.speaking +
            certificate.writing) /
            4,
        )
      if (overall >= 200) return 'c2'
      if (overall >= 180) return 'c1'
      return 'none'
    }
    case 'fce':
    case 'fce-for-schools': {
      const overall =
        certificate.overall ??
        Math.round(
          (certificate.listening +
            certificate.reading +
            certificate.speaking +
            certificate.writing) /
            4,
        )
      if (overall >= 180) return 'c1'
      if (overall >= 160) return 'b2'
      if (overall >= 140) return 'b1'
      return 'none'
    }
    case 'gese':
      if (certificate.grade >= 12) return 'c2'
      if (certificate.grade >= 10) return 'c1'
      if (certificate.grade >= 7) return 'b2'
      if (certificate.grade >= 5) return 'b1'
      if (certificate.grade >= 3) return 'a2'
      if (certificate.grade >= 2) return 'a1'
      return 'below-a1'
    case 'ielts-academic':
    case 'ielts-general': {
      const numericScore = certificate.overall
        ? parseFloat(certificate.overall)
        : roundToHalfOrOne(
            (parseFloat(certificate.listening) +
              parseFloat(certificate.reading) +
              parseFloat(certificate.speaking) +
              parseFloat(certificate.writing)) /
              4,
          )
      if (numericScore >= 8.5) return 'c2'
      if (numericScore >= 7) return 'c1'
      if (numericScore >= 5.5) return 'b2'
      if (numericScore >= 4) return 'b1'
      if (numericScore >= 3) return 'a2'
      if (numericScore >= 2) return 'a1'
      return 'below-a1'
    }
    case 'ket': {
      const overall =
        certificate.overall ??
        Math.round(
          (certificate.listening +
            certificate.reading +
            certificate.speaking +
            certificate.writing) /
            4,
        )
      if (overall >= 140) return 'b1'
      if (overall >= 120) return 'a2'
      if (overall >= 100) return 'a1'
      return 'none'
    }
    case 'oet': {
      const total =
        certificate.total ??
        Math.round(
          (certificate.listening +
            certificate.reading +
            certificate.speaking +
            certificate.writing) /
            4,
        )
      if (total >= 450) return 'c2'
      if (total >= 350) return 'c1'
      if (total >= 200) return 'b2'
      return 'none'
    }
    case 'pet': {
      const overall =
        certificate.overall ??
        Math.round(
          (certificate.listening +
            certificate.reading +
            certificate.speaking +
            certificate.writing) /
            4,
        )
      if (overall >= 160) return 'b2'
      if (overall >= 140) return 'b1'
      if (overall >= 120) return 'a2'
      return 'none'
    }
    case 'tcf-canada': {
      const listeningLevel =
        certificate.listening >= 600
          ? 'c2'
          : certificate.listening >= 500
            ? 'c1'
            : certificate.listening >= 400
              ? 'b2'
              : certificate.listening >= 300
                ? 'b1'
                : certificate.listening >= 200
                  ? 'a2'
                  : certificate.listening >= 100
                    ? 'a1'
                    : 'below-a1'
      const readingLevel =
        certificate.reading >= 600
          ? 'c2'
          : certificate.reading >= 500
            ? 'c1'
            : certificate.reading >= 400
              ? 'b2'
              : certificate.reading >= 300
                ? 'b1'
                : certificate.reading >= 200
                  ? 'a2'
                  : certificate.reading >= 100
                    ? 'a1'
                    : 'below-a1'
      const speakingLevel =
        certificate.speaking >= 16
          ? 'c2'
          : certificate.speaking >= 14
            ? 'c1'
            : certificate.speaking >= 10
              ? 'b2'
              : certificate.speaking >= 6
                ? 'b1'
                : certificate.speaking >= 4
                  ? 'a2'
                  : certificate.speaking >= 2
                    ? 'a1'
                    : 'below-a1'
      const writingLevel =
        certificate.writing >= 16
          ? 'c2'
          : certificate.writing >= 14
            ? 'c1'
            : certificate.writing >= 10
              ? 'b2'
              : certificate.writing >= 6
                ? 'b1'
                : certificate.writing >= 4
                  ? 'a2'
                  : certificate.writing >= 2
                    ? 'a1'
                    : 'below-a1'
      return CEFR_LEVELS[
        Math.max(
          CEFR_LEVELS.indexOf(listeningLevel),
          CEFR_LEVELS.indexOf(readingLevel),
          CEFR_LEVELS.indexOf(speakingLevel),
          CEFR_LEVELS.indexOf(writingLevel),
        )
      ]
    }
    case 'toefl': {
      const overall =
        certificate.total ??
        certificate.listening +
          certificate.reading +
          certificate.speaking +
          certificate.writing
      if (overall >= 114) return 'c2'
      if (overall >= 95) return 'c1'
      if (overall >= 72) return 'b2'
      if (overall >= 42) return 'b1'
      return 'none'
    }
  }

  return 'none'
}
