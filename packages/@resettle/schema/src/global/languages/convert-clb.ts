import type { CountryAlpha2Code } from '../../_common'
import type {
  LanguageCertificateInput,
  LanguageCertificateOutput,
} from './certificates'
import { clbLevelGe, type ClbLevel, type ValidClbLevel } from './levels'

export const convertClbLevelToCertificate = (
  level: ValidClbLevel,
  options: {
    type:
      | 'celpip-general-ls'
      | 'celpip-general'
      | 'ielts-general'
      | 'pte-core'
      | 'tcf-canada'
      | 'tef-canada'
    section: 'listening' | 'speaking' | 'writing' | 'reading' | 'overall'
  },
): LanguageCertificateOutput | null => {
  switch (options.type) {
    case 'celpip-general-ls':
    case 'celpip-general': {
      const num = parseInt(level)
      return num < 2
        ? null
        : {
            type: options.type,
            [options.section]: num.toString() as ValidClbLevel,
          }
    }
    case 'ielts-general': {
      switch (options.section) {
        case 'listening':
          switch (level) {
            case '12':
            case '11':
            case '10':
              return { type: options.type, listening: '8.5' }
            case '9':
              return { type: options.type, listening: '8' }
            case '8':
              return { type: options.type, listening: '7.5' }
            case '7':
              return { type: options.type, listening: '6' }
            case '6':
              return { type: options.type, listening: '5.5' }
            case '5':
              return { type: options.type, listening: '5' }
            case '4':
              return { type: options.type, listening: '4.5' }
            default:
              return null
          }
        case 'reading':
          switch (level) {
            case '12':
            case '11':
            case '10':
              return { type: options.type, reading: '8' }
            case '9':
              return { type: options.type, reading: '7' }
            case '8':
              return { type: options.type, reading: '6.5' }
            case '7':
              return { type: options.type, reading: '6' }
            case '6':
              return { type: options.type, reading: '5' }
            case '5':
              return { type: options.type, reading: '4' }
            case '4':
              return { type: options.type, reading: '3.5' }
            default:
              return null
          }
        case 'writing':
          switch (level) {
            case '12':
            case '11':
            case '10':
              return { type: options.type, writing: '7.5' }
            case '9':
              return { type: options.type, writing: '7' }
            case '8':
              return { type: options.type, writing: '6.5' }
            case '7':
              return { type: options.type, writing: '6' }
            case '6':
              return { type: options.type, writing: '5.5' }
            case '5':
              return { type: options.type, writing: '5' }
            case '4':
              return { type: options.type, writing: '4' }
            default:
              return null
          }
        case 'speaking':
          switch (level) {
            case '12':
            case '11':
            case '10':
              return { type: options.type, speaking: '7.5' }
            case '9':
              return { type: options.type, speaking: '7' }
            case '8':
              return { type: options.type, speaking: '6.5' }
            case '7':
              return { type: options.type, speaking: '6' }
            case '6':
              return { type: options.type, speaking: '5.5' }
            case '5':
              return { type: options.type, speaking: '5' }
            case '4':
              return { type: options.type, speaking: '4' }
            default:
              return null
          }
        default:
          return null
      }
    }
    case 'pte-core': {
      switch (options.section) {
        case 'listening':
          switch (level) {
            case '12':
            case '11':
            case '10':
              return { type: options.type, listening: 89 }
            case '9':
              return { type: options.type, listening: 82 }
            case '8':
              return { type: options.type, listening: 71 }
            case '7':
              return { type: options.type, listening: 60 }
            case '6':
              return { type: options.type, listening: 50 }
            case '5':
              return { type: options.type, listening: 39 }
            case '4':
              return { type: options.type, listening: 28 }
            case '3':
              return { type: options.type, listening: 18 }
            default:
              return { type: options.type, listening: 0 }
          }
        case 'reading':
          switch (level) {
            case '12':
            case '11':
            case '10':
              return { type: options.type, reading: 88 }
            case '9':
              return { type: options.type, reading: 78 }
            case '8':
              return { type: options.type, reading: 69 }
            case '7':
              return { type: options.type, reading: 60 }
            case '6':
              return { type: options.type, reading: 51 }
            case '5':
              return { type: options.type, reading: 42 }
            case '4':
              return { type: options.type, reading: 33 }
            case '3':
              return { type: options.type, reading: 24 }
            default:
              return { type: options.type, reading: 0 }
          }
        case 'writing':
          switch (level) {
            case '12':
            case '11':
            case '10':
              return { type: options.type, writing: 90 }
            case '9':
              return { type: options.type, writing: 88 }
            case '8':
              return { type: options.type, writing: 79 }
            case '7':
              return { type: options.type, writing: 69 }
            case '6':
              return { type: options.type, writing: 60 }
            case '5':
              return { type: options.type, writing: 51 }
            case '4':
              return { type: options.type, writing: 41 }
            case '3':
              return { type: options.type, writing: 32 }
            default:
              return { type: options.type, writing: 0 }
          }
        case 'speaking':
          switch (level) {
            case '12':
            case '11':
            case '10':
              return { type: options.type, speaking: 89 }
            case '9':
              return { type: options.type, speaking: 84 }
            case '8':
              return { type: options.type, speaking: 76 }
            case '7':
              return { type: options.type, speaking: 68 }
            case '6':
              return { type: options.type, speaking: 59 }
            case '5':
              return { type: options.type, speaking: 51 }
            case '4':
              return { type: options.type, speaking: 42 }
            case '3':
              return { type: options.type, speaking: 34 }
            default:
              return { type: options.type, speaking: 0 }
          }
        default:
          return null
      }
    }
    case 'tcf-canada': {
      switch (options.section) {
        case 'listening':
          switch (level) {
            case '12':
            case '11':
            case '10':
              return { type: options.type, listening: 549 }
            case '9':
              return { type: options.type, listening: 523 }
            case '8':
              return { type: options.type, listening: 503 }
            case '7':
              return { type: options.type, listening: 458 }
            case '6':
              return { type: options.type, listening: 398 }
            case '5':
              return { type: options.type, listening: 369 }
            case '4':
              return { type: options.type, listening: 331 }
            default:
              return { type: options.type, listening: 0 }
          }
        case 'reading':
          switch (level) {
            case '12':
            case '11':
            case '10':
              return { type: options.type, reading: 549 }
            case '9':
              return { type: options.type, reading: 524 }
            case '8':
              return { type: options.type, reading: 499 }
            case '7':
              return { type: options.type, reading: 453 }
            case '6':
              return { type: options.type, reading: 406 }
            case '5':
              return { type: options.type, reading: 375 }
            case '4':
              return { type: options.type, reading: 342 }
            default:
              return { type: options.type, reading: 0 }
          }
        case 'speaking':
        case 'writing':
          switch (level) {
            case '12':
            case '11':
            case '10':
              return { type: options.type, [options.section]: 16 }
            case '9':
              return { type: options.type, [options.section]: 14 }
            case '8':
              return { type: options.type, [options.section]: 12 }
            case '7':
              return { type: options.type, [options.section]: 10 }
            case '6':
              return { type: options.type, [options.section]: 7 }
            case '5':
              return { type: options.type, [options.section]: 6 }
            case '4':
              return { type: options.type, [options.section]: 4 }
            default:
              return { type: options.type, [options.section]: 0 }
          }
        default:
          return null
      }
    }
    case 'tef-canada': {
      switch (options.section) {
        case 'listening':
        case 'reading':
          switch (level) {
            case '12':
              return { type: options.type, [options.section]: 615 }
            case '11':
              return { type: options.type, [options.section]: 573 }
            case '10':
              return { type: options.type, [options.section]: 546 }
            case '9':
              return { type: options.type, [options.section]: 503 }
            case '8':
              return { type: options.type, [options.section]: 462 }
            case '7':
              return { type: options.type, [options.section]: 434 }
            case '6':
              return { type: options.type, [options.section]: 393 }
            case '5':
              return { type: options.type, [options.section]: 352 }
            case '4':
              return { type: options.type, [options.section]: 306 }
            default:
              return { type: options.type, [options.section]: 0 }
          }
        case 'writing':
          switch (level) {
            case '12':
              return { type: options.type, [options.section]: 619 }
            case '11':
              return { type: options.type, [options.section]: 577 }
            case '10':
              return { type: options.type, [options.section]: 558 }
            case '9':
              return { type: options.type, [options.section]: 512 }
            case '8':
              return { type: options.type, [options.section]: 472 }
            case '7':
              return { type: options.type, [options.section]: 428 }
            case '6':
              return { type: options.type, [options.section]: 379 }
            case '5':
              return { type: options.type, [options.section]: 330 }
            case '4':
              return { type: options.type, [options.section]: 268 }
            default:
              return { type: options.type, [options.section]: 0 }
          }
        case 'speaking':
          switch (level) {
            case '12':
              return { type: options.type, [options.section]: 642 }
            case '11':
              return { type: options.type, [options.section]: 592 }
            case '10':
              return { type: options.type, [options.section]: 556 }
            case '9':
              return { type: options.type, [options.section]: 518 }
            case '8':
              return { type: options.type, [options.section]: 494 }
            case '7':
              return { type: options.type, [options.section]: 456 }
            case '6':
              return { type: options.type, [options.section]: 422 }
            case '5':
              return { type: options.type, [options.section]: 387 }
            case '4':
              return { type: options.type, [options.section]: 328 }
            default:
              return { type: options.type, [options.section]: 0 }
          }
      }
    }
  }

  return null
}

export const convertCertificateSectionToClbLevel = (
  certificate: LanguageCertificateInput,
  section: 'listening' | 'reading' | 'writing' | 'speaking',
): ClbLevel => {
  switch (certificate.type) {
    case 'celpip-general-ls': {
      return section === 'listening'
        ? certificate.listening
        : section === 'speaking'
          ? certificate.speaking
          : 'none'
    }
    case 'celpip-general': {
      return certificate[section]
    }
    case 'ielts-general': {
      const parsedListening = parseFloat(certificate.listening)
      const parsedReading = parseFloat(certificate.reading)
      const parsedWriting = parseFloat(certificate.writing)
      const parsedSpeaking = parseFloat(certificate.speaking)
      switch (section) {
        case 'listening': {
          let listeningLevel = 3
          if (parsedListening >= 8.5) {
            listeningLevel = 10
          } else if (parsedListening >= 8) {
            listeningLevel = 9
          } else if (parsedListening >= 7.5) {
            listeningLevel = 8
          } else if (parsedListening >= 6) {
            listeningLevel = 7
          } else if (parsedListening >= 5.5) {
            listeningLevel = 6
          } else if (parsedListening >= 5) {
            listeningLevel = 5
          } else if (parsedListening >= 4.5) {
            listeningLevel = 4
          }

          return listeningLevel.toString() as ClbLevel
        }
        case 'reading': {
          let readingLevel = 3
          if (parsedReading >= 8) {
            readingLevel = 10
          } else if (parsedReading >= 7) {
            readingLevel = 9
          } else if (parsedReading >= 6.5) {
            readingLevel = 8
          } else if (parsedReading >= 6) {
            readingLevel = 7
          } else if (parsedReading >= 5) {
            readingLevel = 6
          } else if (parsedReading >= 4) {
            readingLevel = 5
          } else if (parsedReading >= 3.5) {
            readingLevel = 4
          }

          return readingLevel.toString() as ClbLevel
        }
        case 'writing': {
          let writingLevel = 3
          if (parsedWriting >= 7.5) {
            writingLevel = 10
          } else if (parsedWriting >= 7) {
            writingLevel = 9
          } else if (parsedWriting >= 6.5) {
            writingLevel = 8
          } else if (parsedWriting >= 6) {
            writingLevel = 7
          } else if (parsedWriting >= 5.5) {
            writingLevel = 6
          } else if (parsedWriting >= 5) {
            writingLevel = 5
          } else if (parsedWriting >= 4) {
            writingLevel = 4
          }

          return writingLevel.toString() as ClbLevel
        }
        case 'speaking': {
          let speakingLevel = 3
          if (parsedSpeaking >= 7.5) {
            speakingLevel = 10
          } else if (parsedSpeaking >= 7) {
            speakingLevel = 9
          } else if (parsedSpeaking >= 6.5) {
            speakingLevel = 8
          } else if (parsedSpeaking >= 6) {
            speakingLevel = 7
          } else if (parsedSpeaking >= 5.5) {
            speakingLevel = 6
          } else if (parsedSpeaking >= 5) {
            speakingLevel = 5
          } else if (parsedSpeaking >= 4) {
            speakingLevel = 4
          }

          return speakingLevel.toString() as ClbLevel
        }
      }
    }
    case 'pte-core': {
      switch (section) {
        case 'listening': {
          let listeningLevel = 2
          if (certificate.listening >= 89) {
            listeningLevel = 10
          } else if (certificate.listening >= 82) {
            listeningLevel = 9
          } else if (certificate.listening >= 71) {
            listeningLevel = 8
          } else if (certificate.listening >= 60) {
            listeningLevel = 7
          } else if (certificate.listening >= 50) {
            listeningLevel = 6
          } else if (certificate.listening >= 39) {
            listeningLevel = 5
          } else if (certificate.listening >= 28) {
            listeningLevel = 4
          } else if (certificate.listening >= 18) {
            listeningLevel = 3
          }

          return listeningLevel.toString() as ClbLevel
        }
        case 'reading': {
          let readingLevel = 2
          if (certificate.reading >= 88) {
            readingLevel = 10
          } else if (certificate.reading >= 78) {
            readingLevel = 9
          } else if (certificate.reading >= 69) {
            readingLevel = 8
          } else if (certificate.reading >= 60) {
            readingLevel = 7
          } else if (certificate.reading >= 51) {
            readingLevel = 6
          } else if (certificate.reading >= 42) {
            readingLevel = 5
          } else if (certificate.reading >= 33) {
            readingLevel = 4
          } else if (certificate.reading >= 24) {
            readingLevel = 3
          }

          return readingLevel.toString() as ClbLevel
        }
        case 'writing': {
          let writingLevel = 2
          if (certificate.writing >= 90) {
            writingLevel = 10
          } else if (certificate.writing >= 88) {
            writingLevel = 9
          } else if (certificate.writing >= 79) {
            writingLevel = 8
          } else if (certificate.writing >= 69) {
            writingLevel = 7
          } else if (certificate.writing >= 60) {
            writingLevel = 6
          } else if (certificate.writing >= 51) {
            writingLevel = 5
          } else if (certificate.writing >= 41) {
            writingLevel = 4
          } else if (certificate.writing >= 32) {
            writingLevel = 3
          }

          return writingLevel.toString() as ClbLevel
        }
        case 'speaking': {
          let speakingLevel = 2

          if (certificate.speaking >= 89) {
            speakingLevel = 10
          } else if (certificate.speaking >= 84) {
            speakingLevel = 9
          } else if (certificate.speaking >= 76) {
            speakingLevel = 8
          } else if (certificate.speaking >= 68) {
            speakingLevel = 7
          } else if (certificate.speaking >= 59) {
            speakingLevel = 6
          } else if (certificate.speaking >= 51) {
            speakingLevel = 5
          } else if (certificate.speaking >= 42) {
            speakingLevel = 4
          } else if (certificate.speaking >= 34) {
            speakingLevel = 3
          }

          return speakingLevel.toString() as ClbLevel
        }
      }
    }
    case 'tcf-canada': {
      switch (section) {
        case 'listening': {
          let listeningLevel = 3
          if (certificate.listening >= 549) {
            listeningLevel = 10
          } else if (certificate.listening >= 523) {
            listeningLevel = 9
          } else if (certificate.listening >= 503) {
            listeningLevel = 8
          } else if (certificate.listening >= 458) {
            listeningLevel = 7
          } else if (certificate.listening >= 398) {
            listeningLevel = 6
          } else if (certificate.listening >= 369) {
            listeningLevel = 5
          } else if (certificate.listening >= 331) {
            listeningLevel = 4
          }

          return listeningLevel.toString() as ClbLevel
        }
        case 'reading': {
          let readingLevel = 3

          if (certificate.reading >= 549) {
            readingLevel = 10
          } else if (certificate.reading >= 524) {
            readingLevel = 9
          } else if (certificate.reading >= 499) {
            readingLevel = 8
          } else if (certificate.reading >= 453) {
            readingLevel = 7
          } else if (certificate.reading >= 406) {
            readingLevel = 6
          } else if (certificate.reading >= 375) {
            readingLevel = 5
          } else if (certificate.reading >= 342) {
            readingLevel = 4
          }

          return readingLevel.toString() as ClbLevel
        }
        case 'writing':
        case 'speaking': {
          let level = 3
          if (certificate[section] >= 16) {
            level = 10
          } else if (certificate[section] >= 14) {
            level = 9
          } else if (certificate[section] >= 12) {
            level = 8
          } else if (certificate[section] >= 10) {
            level = 7
          } else if (certificate[section] >= 7) {
            level = 6
          } else if (certificate[section] >= 6) {
            level = 5
          } else if (certificate[section] >= 4) {
            level = 4
          }

          return level.toString() as ClbLevel
        }
      }
    }
    case 'tef-canada': {
      switch (section) {
        case 'listening':
        case 'reading': {
          let level = 3
          if (certificate[section] >= 615) {
            level = 12
          } else if (certificate[section] >= 573) {
            level = 11
          } else if (certificate[section] >= 546) {
            level = 10
          } else if (certificate[section] >= 503) {
            level = 9
          } else if (certificate[section] >= 462) {
            level = 8
          } else if (certificate[section] >= 434) {
            level = 7
          } else if (certificate[section] >= 393) {
            level = 6
          } else if (certificate[section] >= 352) {
            level = 5
          } else if (certificate[section] >= 306) {
            level = 4
          }

          return level.toString() as ClbLevel
        }
        case 'writing': {
          let writingLevel = 3
          if (certificate.writing >= 619) {
            writingLevel = 12
          } else if (certificate.writing >= 577) {
            writingLevel = 11
          } else if (certificate.writing >= 558) {
            writingLevel = 10
          } else if (certificate.writing >= 512) {
            writingLevel = 9
          } else if (certificate.writing >= 472) {
            writingLevel = 8
          } else if (certificate.writing >= 428) {
            writingLevel = 7
          } else if (certificate.writing >= 379) {
            writingLevel = 6
          } else if (certificate.writing >= 330) {
            writingLevel = 5
          } else if (certificate.writing >= 268) {
            writingLevel = 4
          }

          return writingLevel.toString() as ClbLevel
        }
        case 'speaking': {
          let speakingLevel = 3

          if (certificate.speaking >= 642) {
            speakingLevel = 12
          } else if (certificate.speaking >= 592) {
            speakingLevel = 11
          } else if (certificate.speaking >= 556) {
            speakingLevel = 10
          } else if (certificate.speaking >= 518) {
            speakingLevel = 9
          } else if (certificate.speaking >= 494) {
            speakingLevel = 8
          } else if (certificate.speaking >= 456) {
            speakingLevel = 7
          } else if (certificate.speaking >= 422) {
            speakingLevel = 6
          } else if (certificate.speaking >= 387) {
            speakingLevel = 5
          } else if (certificate.speaking >= 328) {
            speakingLevel = 4
          }

          return speakingLevel.toString() as ClbLevel
        }
      }
    }
  }
  return 'none'
}

export const convertCertificateToClbLevel = (
  certificate: LanguageCertificateInput,
): ClbLevel => {
  switch (certificate.type) {
    case 'celpip-general-ls': {
      const minimum = Math.min(
        parseInt(convertCertificateSectionToClbLevel(certificate, 'listening')),
        parseInt(convertCertificateSectionToClbLevel(certificate, 'speaking')),
      )
      if (minimum >= 2) {
        return minimum.toString() as ClbLevel
      }

      return 'none'
    }
    case 'celpip-general': {
      const minimum = Math.min(
        parseInt(convertCertificateSectionToClbLevel(certificate, 'listening')),
        parseInt(convertCertificateSectionToClbLevel(certificate, 'speaking')),
        parseInt(convertCertificateSectionToClbLevel(certificate, 'reading')),
        parseInt(convertCertificateSectionToClbLevel(certificate, 'writing')),
      )
      if (minimum >= 2) {
        return minimum.toString() as ClbLevel
      }

      return 'none'
    }
    case 'ielts-general':
      return Math.min(
        parseInt(convertCertificateSectionToClbLevel(certificate, 'listening')),
        parseInt(convertCertificateSectionToClbLevel(certificate, 'speaking')),
        parseInt(convertCertificateSectionToClbLevel(certificate, 'reading')),
        parseInt(convertCertificateSectionToClbLevel(certificate, 'writing')),
      ).toString() as ClbLevel
    case 'pte-core':
      return Math.min(
        parseInt(convertCertificateSectionToClbLevel(certificate, 'listening')),
        parseInt(convertCertificateSectionToClbLevel(certificate, 'speaking')),
        parseInt(convertCertificateSectionToClbLevel(certificate, 'reading')),
        parseInt(convertCertificateSectionToClbLevel(certificate, 'writing')),
      ).toString() as ClbLevel
    case 'tcf-canada':
      return Math.min(
        parseInt(convertCertificateSectionToClbLevel(certificate, 'listening')),
        parseInt(convertCertificateSectionToClbLevel(certificate, 'speaking')),
        parseInt(convertCertificateSectionToClbLevel(certificate, 'reading')),
        parseInt(convertCertificateSectionToClbLevel(certificate, 'writing')),
      ).toString() as ClbLevel
    case 'tef-canada':
      return Math.min(
        parseInt(convertCertificateSectionToClbLevel(certificate, 'listening')),
        parseInt(convertCertificateSectionToClbLevel(certificate, 'speaking')),
        parseInt(convertCertificateSectionToClbLevel(certificate, 'reading')),
        parseInt(convertCertificateSectionToClbLevel(certificate, 'writing')),
      ).toString() as ClbLevel
  }

  return 'none'
}

export const convertClbToVisa = (
  level: ValidClbLevel,
): {
  name: string
  stream?: string
  country: CountryAlpha2Code
  note?: string
}[] => {
  const results: {
    name: string
    stream?: string
    country: CountryAlpha2Code
    note?: string
  }[] = []
  if (clbLevelGe(level, '7')) {
    results.push({
      name: 'Express Entry',
      stream: 'Federal Skilled Worker Program',
      country: 'CA',
    })

    results.push({
      name: 'Express Entry',
      stream: 'Canadian Experience Class',
      country: 'CA',
      note: 'TEER 0 or TEER 1 occupations',
    })
  }

  if (clbLevelGe(level, '5')) {
    results.push({ name: 'Startup Visa', country: 'CA' })

    results.push({
      name: 'Express Entry',
      stream: 'Canadian Experience Class',
      country: 'CA',
      note: 'TEER 2 or TEER 3 occupations',
    })
  }

  if (clbLevelGe(level, '4')) {
    results.push({ name: 'Home Care Worker Visa', country: 'CA' })
  }

  return results
}

export const convertClbWithSectionsToVisa = (levels: {
  listening: ValidClbLevel
  speaking: ValidClbLevel
  reading: ValidClbLevel
  writing: ValidClbLevel
}): {
  name: string
  stream?: string
  country: CountryAlpha2Code
  note?: string
}[] => {
  const results: {
    name: string
    stream?: string
    country: CountryAlpha2Code
    note?: string
  }[] = []
  if (
    clbLevelGe(levels.listening, '5') &&
    clbLevelGe(levels.speaking, '5') &&
    clbLevelGe(levels.reading, '4') &&
    clbLevelGe(levels.writing, '4')
  ) {
    results.push({
      name: 'Express Entry',
      stream: 'Federal Skilled Trades Program',
      country: 'CA',
    })
  }

  return results
}
