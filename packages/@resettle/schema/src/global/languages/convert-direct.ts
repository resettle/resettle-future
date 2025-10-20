import type { CountryAlpha2Code } from '../../common'
import { ieltsScoreGe, type LanguageCertificateInput } from './certificates'
import { clbLevelGe } from './levels'

export const convertLanguageCertificateToVisa = (
  certificate: LanguageCertificateInput,
): {
  subclass: number
  name: string
  country: CountryAlpha2Code
}[] => {
  switch (certificate.type) {
    case 'cae': {
      const results: {
        subclass: number
        name: string
        country: CountryAlpha2Code
      }[] = []
      if (certificate.listening >= 154 && certificate.speaking >= 154) {
        results.push({
          subclass: 192,
          name: 'Pacific Engagement Visa',
          country: 'AU',
        })
      }

      if (certificate.overall && certificate.overall >= 161) {
        results.push({
          subclass: 500,
          name: 'Student Visa',
          country: 'AU',
        })
      }

      return results
    }

    case 'celpip-general': {
      const results: {
        subclass: number
        name: string
        country: CountryAlpha2Code
      }[] = []
      if (certificate.overall && clbLevelGe(certificate.overall, '7')) {
        results.push({
          subclass: 500,
          name: 'Student Visa',
          country: 'AU',
        })
      }

      if (
        clbLevelGe(certificate.listening, '5') &&
        clbLevelGe(certificate.reading, '5') &&
        clbLevelGe(certificate.writing, '5') &&
        clbLevelGe(certificate.speaking, '5')
      ) {
        results.push({
          subclass: 482,
          name: 'Skills in Demand Visa',
          country: 'AU',
        })
      }

      if (
        certificate.overall &&
        clbLevelGe(certificate.overall, '8') &&
        clbLevelGe(certificate.listening, '6') &&
        clbLevelGe(certificate.reading, '6') &&
        clbLevelGe(certificate.writing, '6') &&
        clbLevelGe(certificate.speaking, '6')
      ) {
        results.push({
          subclass: 485,
          name: 'Temporary Graduate Visa',
          country: 'AU',
        })
      }

      return results
    }

    case 'ielts-academic':
    case 'ielts-general': {
      const results: {
        subclass: number
        name: string
        country: CountryAlpha2Code
      }[] = []
      if (
        ieltsScoreGe(certificate.listening, '5') &&
        ieltsScoreGe(certificate.speaking, '5')
      ) {
        results.push({
          subclass: 192,
          name: 'Pacific Engagement Visa',
          country: 'AU',
        })
      }

      if (certificate.overall && ieltsScoreGe(certificate.overall, '6')) {
        results.push({
          subclass: 500,
          name: 'Student Visa',
          country: 'AU',
        })
      }

      if (
        ieltsScoreGe(certificate.listening, '5') &&
        ieltsScoreGe(certificate.speaking, '5') &&
        ieltsScoreGe(certificate.reading, '5') &&
        ieltsScoreGe(certificate.writing, '5')
      ) {
        results.push({
          subclass: 482,
          name: 'Skills in Demand Visa',
          country: 'AU',
        })
      }

      if (
        certificate.overall &&
        ieltsScoreGe(certificate.overall, '6.5') &&
        ieltsScoreGe(certificate.listening, '5.5') &&
        ieltsScoreGe(certificate.reading, '5.5') &&
        ieltsScoreGe(certificate.writing, '5.5') &&
        ieltsScoreGe(certificate.speaking, '5.5')
      ) {
        results.push({
          subclass: 485,
          name: 'Temporary Graduate Visa',
          country: 'AU',
        })
      }

      return results
    }

    case 'languagecert-academic': {
      const results: {
        subclass: number
        name: string
        country: CountryAlpha2Code
      }[] = []
      if (certificate.overall && certificate.listening >= 61) {
        results.push({
          subclass: 500,
          name: 'Student Visa',
          country: 'AU',
        })
      }

      if (
        certificate.listening >= 41 &&
        certificate.reading >= 44 &&
        certificate.writing >= 45 &&
        certificate.speaking >= 54
      ) {
        results.push({
          subclass: 482,
          name: 'Skills in Demand Visa',
          country: 'AU',
        })
      }

      if (
        certificate.overall &&
        certificate.overall >= 67 &&
        certificate.listening >= 49 &&
        certificate.reading >= 54 &&
        certificate.writing >= 56 &&
        certificate.speaking >= 62
      ) {
        results.push({
          subclass: 485,
          name: 'Temporary Graduate Visa',
          country: 'AU',
        })
      }

      return results
    }

    case 'met': {
      const results: {
        subclass: number
        name: string
        country: CountryAlpha2Code
      }[] = []
      if (
        (certificate.overall && certificate.overall >= 53) ||
        Math.floor(
          (certificate.listening +
            certificate.reading +
            certificate.speaking +
            certificate.writing) /
            4,
        ) >= 53
      ) {
        results.push({
          subclass: 500,
          name: 'Student Visa',
          country: 'AU',
        })
      }

      if (
        certificate.listening >= 49 &&
        certificate.reading >= 47 &&
        certificate.writing >= 45 &&
        certificate.speaking >= 38
      ) {
        results.push({
          subclass: 482,
          name: 'Skills in Demand Visa',
          country: 'AU',
        })
      }

      if (
        certificate.overall &&
        certificate.overall >= 58 &&
        certificate.listening >= 53 &&
        certificate.reading >= 51 &&
        certificate.writing >= 51 &&
        certificate.speaking >= 43
      ) {
        results.push({
          subclass: 485,
          name: 'Temporary Graduate Visa',
          country: 'AU',
        })
      }

      return results
    }

    case 'oet': {
      const results: {
        subclass: number
        name: string
        country: CountryAlpha2Code
      }[] = []
      if (
        (certificate.total && certificate.total >= 1210) ||
        certificate.listening +
          certificate.reading +
          certificate.speaking +
          certificate.writing >=
          1210
      ) {
        results.push({
          subclass: 500,
          name: 'Student Visa',
          country: 'AU',
        })
      }

      if (
        certificate.listening >= 220 &&
        certificate.reading >= 240 &&
        certificate.writing >= 200 &&
        certificate.speaking >= 270
      ) {
        results.push({
          subclass: 482,
          name: 'Skills in Demand Visa',
          country: 'AU',
        })
      }

      if (
        certificate.total &&
        certificate.total >= 1310 &&
        certificate.listening >= 260 &&
        certificate.reading >= 280 &&
        certificate.writing >= 260 &&
        certificate.speaking >= 310
      ) {
        results.push({
          subclass: 485,
          name: 'Temporary Graduate Visa',
          country: 'AU',
        })
      }

      return results
    }

    case 'pte-academic': {
      const results: {
        subclass: number
        name: string
        country: CountryAlpha2Code
      }[] = []
      if (certificate.listening >= 36 && certificate.speaking >= 36) {
        results.push({
          subclass: 192,
          name: 'Pacific Engagement Visa',
          country: 'AU',
        })
      }

      if (certificate.overall && certificate.listening >= 47) {
        results.push({
          subclass: 500,
          name: 'Student Visa',
          country: 'AU',
        })
      }

      if (
        certificate.listening >= 33 &&
        certificate.reading >= 36 &&
        certificate.writing >= 29 &&
        certificate.speaking >= 24
      ) {
        results.push({
          subclass: 482,
          name: 'Skills in Demand Visa',
          country: 'AU',
        })
      }

      if (
        certificate.overall &&
        certificate.overall >= 55 &&
        certificate.listening >= 40 &&
        certificate.reading >= 42 &&
        certificate.writing >= 41 &&
        certificate.speaking >= 39
      ) {
        results.push({
          subclass: 485,
          name: 'Temporary Graduate Visa',
          country: 'AU',
        })
      }

      return results
    }

    case 'toefl': {
      const results: {
        subclass: number
        name: string
        country: CountryAlpha2Code
      }[] = []
      if (certificate.listening >= 4 && certificate.speaking >= 14) {
        results.push({
          subclass: 192,
          name: 'Pacific Engagement Visa',
          country: 'AU',
        })
      }

      if (
        certificate.listening +
          certificate.reading +
          certificate.speaking +
          certificate.writing >=
        67
      ) {
        results.push({
          subclass: 500,
          name: 'Student Visa',
          country: 'AU',
        })
      }

      if (
        certificate.listening >= 8 &&
        certificate.reading >= 8 &&
        certificate.writing >= 9 &&
        certificate.speaking >= 14
      ) {
        results.push({
          subclass: 482,
          name: 'Skills in Demand Visa',
          country: 'AU',
        })
      }

      if (
        certificate.listening >= 12 &&
        certificate.reading >= 12 &&
        certificate.writing >= 14 &&
        certificate.speaking >= 17 &&
        certificate.listening +
          certificate.reading +
          certificate.writing +
          certificate.speaking >=
          81
      ) {
        results.push({
          subclass: 485,
          name: 'Temporary Graduate Visa',
          country: 'AU',
        })
      }

      return results
    }
  }

  return []
}
