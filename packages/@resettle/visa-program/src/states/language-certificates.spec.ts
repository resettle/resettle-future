/*
import type {
  IELTSAcademicScore,
  IELTSGeneralScore,
  JLPTLevel,
  LanguageCertificate,
} from '@resettle/common'
import { describe, expect, it } from 'vitest'

import { createMockContext } from '../mock'
import type {
  LanguageCertificatesState,
  LanguageCertificatesStateInput,
} from './language-certificates'
import {
  DEFAULT_LANGUAGE_CERTIFICATES_SIMILARITY,
  getLanguageCertificatesStateOutput,
} from './language-certificates'

const mockContext = createMockContext()

// Mock language certificates for testing
const mockIELTSAcademicCertificate: LanguageCertificate = {
  type: 'IELTS_ACADEMIC',
  listening: '7.5',
  reading: '8',
  writing: '7.5',
  speaking: '7',
}

const mockIELTSGeneralCertificate: LanguageCertificate = {
  type: 'IELTS_GENERAL',
  listening: '7',
  reading: '7.5',
  writing: '6.5',
  speaking: '7',
}

const mockCELPIPCertificate: LanguageCertificate = {
  type: 'CELPIP_GENERAL',
  listening: 9,
  reading: 8,
  writing: 7,
  speaking: 8,
}

const mockCAECertificate: LanguageCertificate = {
  type: 'CAE',
  listening: 185,
  reading: 190,
  writing: 180,
  speaking: 185,
  use_of_english: 185,
}

const mockCPECertificate: LanguageCertificate = {
  type: 'CPE',
  listening: 195,
  reading: 200,
  writing: 190,
  speaking: 195,
  use_of_english: 185,
}

const mockFCECertificate: LanguageCertificate = {
  type: 'FCE',
  listening: 165,
  reading: 170,
  writing: 160,
  speaking: 165,
  use_of_english: 160,
}

const mockTOEFLCertificate: LanguageCertificate = {
  type: 'TOEFL',
  listening: 25,
  reading: 28,
  writing: 24,
  speaking: 26,
}

const mockOETCertificate: LanguageCertificate = {
  type: 'OET',
  listening: 380,
  reading: 400,
  writing: 350,
  speaking: 370,
}

const mockTCFCertificate: LanguageCertificate = {
  type: 'TCF_CANADA',
  listening: 520,
  reading: 515,
  writing: 12,
  speaking: 14,
}

const mockTEFCertificate: LanguageCertificate = {
  type: 'TEF_CANADA',
  listening: 580,
  reading: 560,
  writing: 550,
  speaking: 540,
}

const mockJLPTCertificate: LanguageCertificate = {
  type: 'JLPT',
  level: 'N2',
}

const mockGESECertificate: LanguageCertificate = {
  type: 'GESE',
  grade: 8,
}

describe('language-certificates', () => {
  describe('getLanguageCertificatesStateOutput - auen-min operation', () => {
    it('should handle IELTS Academic certificate meeting AUEN requirements', () => {
      const state: LanguageCertificatesState = {
        kind: 'language_certificates',
        op: 'auen-min',
        expected: ['Proficient'],
      }

      const input: LanguageCertificatesStateInput = {
        language_certificates: [mockIELTSAcademicCertificate],
      }

      const result = getLanguageCertificatesStateOutput(
        mockContext,
        state,
        input,
      )

      expect(result.kind).toBe('language_certificates')
      expect(result.op).toBe('auen-min')

      if (result.op === 'auen-min') {
        expect(result.expected).toEqual(['Proficient'])
        expect(result.actual).toBeDefined()
        expect(result.similarity).toBe(1)
      }
    })

    it('should handle IELTS Academic certificate not meeting AUEN requirements', () => {
      const state: LanguageCertificatesState = {
        kind: 'language_certificates',
        op: 'auen-min',
        expected: ['Superior'],
      }

      const lowScoreIELTS: LanguageCertificate = {
        type: 'IELTS_ACADEMIC',
        listening: '6',
        reading: '6.5',
        writing: '6',
        speaking: '6.5',
      }

      const input: LanguageCertificatesStateInput = {
        language_certificates: [lowScoreIELTS],
      }

      const result = getLanguageCertificatesStateOutput(
        mockContext,
        state,
        input,
      )

      if (result.op === 'auen-min') {
        expect(result.expected).toEqual(['Superior'])
        expect(result.similarity).toBeLessThan(1)
      }
    })

    it('should handle missing language certificates', () => {
      const state: LanguageCertificatesState = {
        kind: 'language_certificates',
        op: 'auen-min',
        expected: ['Competent'],
      }

      const input: LanguageCertificatesStateInput = {
        language_certificates: [],
      }

      const result = getLanguageCertificatesStateOutput(
        mockContext,
        state,
        input,
      )

      if (result.op === 'auen-min') {
        expect(result.expected).toEqual(['Competent'])
        expect(result.actual).toBeUndefined()
        expect(result.similarity).toBe(DEFAULT_LANGUAGE_CERTIFICATES_SIMILARITY)
      }
    })
  })

  describe('getLanguageCertificatesStateOutput - cefr-min operation', () => {
    it('should handle CAE certificate meeting CEFR requirements', () => {
      const state: LanguageCertificatesState = {
        kind: 'language_certificates',
        op: 'cefr-min',
        expected: { level: ['C1'] },
      }

      const input: LanguageCertificatesStateInput = {
        language_certificates: [mockCAECertificate],
      }

      const result = getLanguageCertificatesStateOutput(
        mockContext,
        state,
        input,
      )

      expect(result.kind).toBe('language_certificates')
      expect(result.op).toBe('cefr-min')

      if (result.op === 'cefr-min') {
        expect(result.expected).toEqual({ level: ['C1'] })
        expect(result.actual).toBeDefined()
        expect(result.similarity).toBe(1)
      }
    })

    it('should handle multiple expected CEFR levels', () => {
      const state: LanguageCertificatesState = {
        kind: 'language_certificates',
        op: 'cefr-min',
        expected: { level: ['B2', 'C1', 'C2'] },
      }

      const input: LanguageCertificatesStateInput = {
        language_certificates: [mockFCECertificate],
      }

      const result = getLanguageCertificatesStateOutput(
        mockContext,
        state,
        input,
      )

      if (result.op === 'cefr-min') {
        expect(result.expected).toEqual({ level: ['B2', 'C1', 'C2'] })
        expect(result.similarity).toBeGreaterThan(0)
      }
    })

    it('should handle missing certificates for CEFR', () => {
      const state: LanguageCertificatesState = {
        kind: 'language_certificates',
        op: 'cefr-min',
        expected: { level: ['B2'] },
      }

      const input: LanguageCertificatesStateInput = {}

      const result = getLanguageCertificatesStateOutput(
        mockContext,
        state,
        input,
      )

      if (result.op === 'cefr-min') {
        expect(result.similarity).toBe(DEFAULT_LANGUAGE_CERTIFICATES_SIMILARITY)
      }
    })
  })

  describe('getLanguageCertificatesStateOutput - clb-min operation', () => {
    it('should handle CELPIP certificate meeting CLB requirements', () => {
      const state: LanguageCertificatesState = {
        kind: 'language_certificates',
        op: 'clb-min',
        expected: ['7'],
      }

      const input: LanguageCertificatesStateInput = {
        language_certificates: [mockCELPIPCertificate],
      }

      const result = getLanguageCertificatesStateOutput(
        mockContext,
        state,
        input,
      )

      expect(result.kind).toBe('language_certificates')
      expect(result.op).toBe('clb-min')

      if (result.op === 'clb-min') {
        expect(result.expected).toEqual(['7'])
        expect(result.actual).toBeDefined()
        expect(result.similarity).toBeGreaterThan(
          DEFAULT_LANGUAGE_CERTIFICATES_SIMILARITY,
        )
      }
    })

    it('should handle insufficient CLB levels', () => {
      const state: LanguageCertificatesState = {
        kind: 'language_certificates',
        op: 'clb-min',
        expected: ['10'],
      }

      const lowCELPIP: LanguageCertificate = {
        type: 'CELPIP_GENERAL',
        listening: 5,
        reading: 4,
        writing: 4,
        speaking: 5,
      }

      const input: LanguageCertificatesStateInput = {
        language_certificates: [lowCELPIP],
      }

      const result = getLanguageCertificatesStateOutput(
        mockContext,
        state,
        input,
      )

      if (result.op === 'clb-min') {
        expect(result.similarity).toBeLessThan(1)
      }
    })
  })

  describe('getLanguageCertificatesStateOutput - clb-sections-min operation', () => {
    it('should handle CELPIP certificate with section-specific CLB requirements', () => {
      const state: LanguageCertificatesState = {
        kind: 'language_certificates',
        op: 'clb-sections-min',
        expected: {
          listening: '8',
          reading: '7',
          writing: '6',
          speaking: '7',
        },
      }

      const input: LanguageCertificatesStateInput = {
        language_certificates: [mockCELPIPCertificate],
      }

      const result = getLanguageCertificatesStateOutput(
        mockContext,
        state,
        input,
      )

      expect(result.kind).toBe('language_certificates')
      expect(result.op).toBe('clb-sections-min')

      if (result.op === 'clb-sections-min') {
        expect(result.filters.listening?.expected).toBe('8')
        expect(result.filters.reading?.expected).toBe('7')
        expect(result.filters.writing?.expected).toBe('6')
        expect(result.filters.speaking?.expected).toBe('7')
        expect(result.similarity).toBeGreaterThan(0)
      }
    })

    it('should handle partial section requirements', () => {
      const state: LanguageCertificatesState = {
        kind: 'language_certificates',
        op: 'clb-sections-min',
        expected: {
          listening: '9',
          speaking: '8',
        },
      }

      const input: LanguageCertificatesStateInput = {
        language_certificates: [mockCELPIPCertificate],
      }

      const result = getLanguageCertificatesStateOutput(
        mockContext,
        state,
        input,
      )

      if (result.op === 'clb-sections-min') {
        expect(result.filters.listening).toBeDefined()
        expect(result.filters.speaking).toBeDefined()
        expect(result.filters.reading).toBeUndefined()
        expect(result.filters.writing).toBeUndefined()
      }
    })

    it('should handle missing certificates for CLB sections', () => {
      const state: LanguageCertificatesState = {
        kind: 'language_certificates',
        op: 'clb-sections-min',
        expected: {
          listening: '7',
          reading: '7',
        },
      }

      const input: LanguageCertificatesStateInput = {
        language_certificates: [],
      }

      const result = getLanguageCertificatesStateOutput(
        mockContext,
        state,
        input,
      )

      if (result.op === 'clb-sections-min') {
        expect(result.filters.listening?.similarity).toBe(
          DEFAULT_LANGUAGE_CERTIFICATES_SIMILARITY,
        )
        expect(result.filters.reading?.similarity).toBe(
          DEFAULT_LANGUAGE_CERTIFICATES_SIMILARITY,
        )
        expect(result.similarity).toBe(DEFAULT_LANGUAGE_CERTIFICATES_SIMILARITY)
      }
    })
  })

  describe('getLanguageCertificatesStateOutput - four-sections-certificate-min operation', () => {
    it('should handle TOEFL certificate with four-section requirements', () => {
      const state: LanguageCertificatesState = {
        kind: 'language_certificates',
        op: 'four-sections-certificate-min',
        type: 'TOEFL',
        expected: {
          listening: 22,
          reading: 24,
          writing: 20,
          speaking: 23,
        },
      }

      const input: LanguageCertificatesStateInput = {
        language_certificates: [mockTOEFLCertificate],
      }

      const result = getLanguageCertificatesStateOutput(
        mockContext,
        state,
        input,
      )

      expect(result.kind).toBe('language_certificates')
      expect(result.op).toBe('four-sections-certificate-min')

      if (result.op === 'four-sections-certificate-min') {
        expect(result.type).toBe('TOEFL')
        expect(result.filters.listening?.expected).toBe(22)
        expect(result.filters.reading?.expected).toBe(24)
        expect(result.filters.writing?.expected).toBe(20)
        expect(result.filters.speaking?.expected).toBe(23)
        expect(result.similarity).toBeGreaterThan(
          DEFAULT_LANGUAGE_CERTIFICATES_SIMILARITY,
        )
      }
    })

    it('should handle OET certificate requirements', () => {
      const state: LanguageCertificatesState = {
        kind: 'language_certificates',
        op: 'four-sections-certificate-min',
        type: 'OET',
        expected: {
          listening: 350,
          reading: 350,
          writing: 350,
          speaking: 350,
        },
      }

      const input: LanguageCertificatesStateInput = {
        language_certificates: [mockOETCertificate],
      }

      const result = getLanguageCertificatesStateOutput(
        mockContext,
        state,
        input,
      )

      if (result.op === 'four-sections-certificate-min') {
        expect(result.type).toBe('OET')
        expect(result.similarity).toBe(1) // All sections meet or exceed requirements
      }
    })

    it('should handle missing four-section certificate', () => {
      const state: LanguageCertificatesState = {
        kind: 'language_certificates',
        op: 'four-sections-certificate-min',
        type: 'TOEFL',
        expected: {
          listening: 20,
          reading: 20,
        },
      }

      const input: LanguageCertificatesStateInput = {
        language_certificates: [mockIELTSAcademicCertificate], // Different type
      }

      const result = getLanguageCertificatesStateOutput(
        mockContext,
        state,
        input,
      )

      if (result.op === 'four-sections-certificate-min') {
        expect(result.filters.listening?.similarity).toBe(
          DEFAULT_LANGUAGE_CERTIFICATES_SIMILARITY,
        )
        expect(result.filters.reading?.similarity).toBe(
          DEFAULT_LANGUAGE_CERTIFICATES_SIMILARITY,
        )
      }
    })

    it('should handle TCF Canada certificate', () => {
      const state: LanguageCertificatesState = {
        kind: 'language_certificates',
        op: 'four-sections-certificate-min',
        type: 'TCF_CANADA',
        expected: {
          listening: 500,
          reading: 500,
          writing: 10,
          speaking: 12,
        },
      }

      const input: LanguageCertificatesStateInput = {
        language_certificates: [mockTCFCertificate],
      }

      const result = getLanguageCertificatesStateOutput(
        mockContext,
        state,
        input,
      )

      if (result.op === 'four-sections-certificate-min') {
        expect(result.type).toBe('TCF_CANADA')
        expect(result.similarity).toBeGreaterThan(
          DEFAULT_LANGUAGE_CERTIFICATES_SIMILARITY,
        )
      }
    })

    it('should handle TEF Canada certificate', () => {
      const state: LanguageCertificatesState = {
        kind: 'language_certificates',
        op: 'four-sections-certificate-min',
        type: 'TEF_CANADA',
        expected: {
          listening: 500,
          reading: 500,
          writing: 500,
          speaking: 500,
        },
      }

      const input: LanguageCertificatesStateInput = {
        language_certificates: [mockTEFCertificate],
      }

      const result = getLanguageCertificatesStateOutput(
        mockContext,
        state,
        input,
      )

      if (result.op === 'four-sections-certificate-min') {
        expect(result.type).toBe('TEF_CANADA')
        expect(result.similarity).toBeGreaterThan(
          DEFAULT_LANGUAGE_CERTIFICATES_SIMILARITY,
        )
      }
    })
  })

  describe('getLanguageCertificatesStateOutput - five-sections-certificate-min operation', () => {
    it('should handle CAE certificate with five-section requirements', () => {
      const state: LanguageCertificatesState = {
        kind: 'language_certificates',
        op: 'five-sections-certificate-min',
        type: 'CAE',
        expected: {
          listening: 180,
          reading: 180,
          writing: 180,
          speaking: 180,
          use_of_english: 180,
        },
      }

      const input: LanguageCertificatesStateInput = {
        language_certificates: [mockCAECertificate],
      }

      const result = getLanguageCertificatesStateOutput(
        mockContext,
        state,
        input,
      )

      expect(result.kind).toBe('language_certificates')
      expect(result.op).toBe('five-sections-certificate-min')

      if (result.op === 'five-sections-certificate-min') {
        expect(result.type).toBe('CAE')
        expect(result.filters.listening?.expected).toBe(180)
        expect(result.filters.use_of_english?.expected).toBe(180)
        expect(result.similarity).toBe(1)
      }
    })

    it('should handle CPE certificate requirements', () => {
      const state: LanguageCertificatesState = {
        kind: 'language_certificates',
        op: 'five-sections-certificate-min',
        type: 'CPE',
        expected: {
          listening: 190,
          reading: 190,
          writing: 190,
          speaking: 190,
          use_of_english: 190,
        },
      }

      const input: LanguageCertificatesStateInput = {
        language_certificates: [mockCPECertificate],
      }

      const result = getLanguageCertificatesStateOutput(
        mockContext,
        state,
        input,
      )

      if (result.op === 'five-sections-certificate-min') {
        expect(result.type).toBe('CPE')
        expect(result.similarity).toBeGreaterThan(
          DEFAULT_LANGUAGE_CERTIFICATES_SIMILARITY,
        )
      }
    })

    it('should handle FCE certificate requirements', () => {
      const state: LanguageCertificatesState = {
        kind: 'language_certificates',
        op: 'five-sections-certificate-min',
        type: 'FCE',
        expected: {
          listening: 160,
          reading: 160,
          writing: 160,
          speaking: 160,
          use_of_english: 160,
        },
      }

      const input: LanguageCertificatesStateInput = {
        language_certificates: [mockFCECertificate],
      }

      const result = getLanguageCertificatesStateOutput(
        mockContext,
        state,
        input,
      )

      if (result.op === 'five-sections-certificate-min') {
        expect(result.type).toBe('FCE')
        expect(result.similarity).toBe(1)
      }
    })

    it('should handle missing five-section certificate', () => {
      const state: LanguageCertificatesState = {
        kind: 'language_certificates',
        op: 'five-sections-certificate-min',
        type: 'CAE',
        expected: {
          listening: 180,
          reading: 180,
        },
      }

      const input: LanguageCertificatesStateInput = {
        language_certificates: [],
      }

      const result = getLanguageCertificatesStateOutput(
        mockContext,
        state,
        input,
      )

      if (result.op === 'five-sections-certificate-min') {
        expect(result.filters.listening?.similarity).toBe(
          DEFAULT_LANGUAGE_CERTIFICATES_SIMILARITY,
        )
        expect(result.filters.reading?.similarity).toBe(
          DEFAULT_LANGUAGE_CERTIFICATES_SIMILARITY,
        )
        expect(result.similarity).toBe(DEFAULT_LANGUAGE_CERTIFICATES_SIMILARITY)
      }
    })
  })

  describe('getLanguageCertificatesStateOutput - ielts-academic-min operation', () => {
    it('should handle IELTS Academic certificate meeting requirements', () => {
      const state: LanguageCertificatesState = {
        kind: 'language_certificates',
        op: 'ielts-academic-min',
        expected: {
          listening: '7.0' as IELTSAcademicScore,
          reading: '7.5' as IELTSAcademicScore,
          writing: '6.0' as IELTSAcademicScore,
          speaking: '6.5' as IELTSAcademicScore,
        },
      }

      const input: LanguageCertificatesStateInput = {
        language_certificates: [mockIELTSAcademicCertificate],
      }

      const result = getLanguageCertificatesStateOutput(
        mockContext,
        state,
        input,
      )

      expect(result.kind).toBe('language_certificates')
      expect(result.op).toBe('ielts-academic-min')

      if (result.op === 'ielts-academic-min') {
        expect(result.filters.listening?.expected).toBe('7.0')
        expect(result.filters.reading?.expected).toBe('7.5')
        expect(result.filters.writing?.expected).toBe('6.0')
        expect(result.filters.speaking?.expected).toBe('6.5')
        expect(result.similarity).toBeGreaterThan(
          DEFAULT_LANGUAGE_CERTIFICATES_SIMILARITY,
        )
      }
    })

    it('should handle partial IELTS Academic requirements', () => {
      const state: LanguageCertificatesState = {
        kind: 'language_certificates',
        op: 'ielts-academic-min',
        expected: {
          listening: '8.0' as IELTSAcademicScore,
          writing: '7.0' as IELTSAcademicScore,
        },
      }

      const input: LanguageCertificatesStateInput = {
        language_certificates: [mockIELTSAcademicCertificate],
      }

      const result = getLanguageCertificatesStateOutput(
        mockContext,
        state,
        input,
      )

      if (result.op === 'ielts-academic-min') {
        expect(result.filters.listening).toBeDefined()
        expect(result.filters.writing).toBeDefined()
        expect(result.filters.reading).toBeUndefined()
        expect(result.filters.speaking).toBeUndefined()
      }
    })

    it('should handle missing IELTS Academic certificate', () => {
      const state: LanguageCertificatesState = {
        kind: 'language_certificates',
        op: 'ielts-academic-min',
        expected: {
          listening: '7.0' as IELTSAcademicScore,
          reading: '7.0' as IELTSAcademicScore,
        },
      }

      const input: LanguageCertificatesStateInput = {
        language_certificates: [mockCELPIPCertificate], // Different type
      }

      const result = getLanguageCertificatesStateOutput(
        mockContext,
        state,
        input,
      )

      if (result.op === 'ielts-academic-min') {
        expect(result.filters.listening?.similarity).toBe(
          DEFAULT_LANGUAGE_CERTIFICATES_SIMILARITY,
        )
        expect(result.filters.reading?.similarity).toBe(
          DEFAULT_LANGUAGE_CERTIFICATES_SIMILARITY,
        )
        expect(result.similarity).toBe(DEFAULT_LANGUAGE_CERTIFICATES_SIMILARITY)
      }
    })
  })

  describe('getLanguageCertificatesStateOutput - ielts-general-min operation', () => {
    it('should handle IELTS General certificate meeting requirements', () => {
      const state: LanguageCertificatesState = {
        kind: 'language_certificates',
        op: 'ielts-general-min',
        expected: {
          listening: '6.5' as IELTSGeneralScore,
          reading: '7.0' as IELTSGeneralScore,
          writing: '6.0' as IELTSGeneralScore,
          speaking: '6.5' as IELTSGeneralScore,
        },
      }

      const input: LanguageCertificatesStateInput = {
        language_certificates: [mockIELTSGeneralCertificate],
      }

      const result = getLanguageCertificatesStateOutput(
        mockContext,
        state,
        input,
      )

      expect(result.kind).toBe('language_certificates')
      expect(result.op).toBe('ielts-general-min')

      if (result.op === 'ielts-general-min') {
        expect(result.filters.listening?.expected).toBe('6.5')
        expect(result.filters.reading?.expected).toBe('7.0')
        expect(result.filters.writing?.expected).toBe('6.0')
        expect(result.filters.speaking?.expected).toBe('6.5')
        expect(result.similarity).toBeGreaterThan(
          DEFAULT_LANGUAGE_CERTIFICATES_SIMILARITY,
        )
      }
    })

    it('should handle high IELTS General requirements', () => {
      const state: LanguageCertificatesState = {
        kind: 'language_certificates',
        op: 'ielts-general-min',
        expected: {
          listening: '8.0' as IELTSGeneralScore,
          reading: '8.5' as IELTSGeneralScore,
          writing: '8.0' as IELTSGeneralScore,
          speaking: '8.0' as IELTSGeneralScore,
        },
      }

      const input: LanguageCertificatesStateInput = {
        language_certificates: [mockIELTSGeneralCertificate],
      }

      const result = getLanguageCertificatesStateOutput(
        mockContext,
        state,
        input,
      )

      if (result.op === 'ielts-general-min') {
        expect(result.similarity).toBeLessThan(1) // Scores don't meet high requirements
      }
    })

    it('should handle missing IELTS General certificate', () => {
      const state: LanguageCertificatesState = {
        kind: 'language_certificates',
        op: 'ielts-general-min',
        expected: {
          listening: '7.0' as IELTSGeneralScore,
        },
      }

      const input: LanguageCertificatesStateInput = {
        language_certificates: [],
      }

      const result = getLanguageCertificatesStateOutput(
        mockContext,
        state,
        input,
      )

      if (result.op === 'ielts-general-min') {
        expect(result.filters.listening?.similarity).toBe(
          DEFAULT_LANGUAGE_CERTIFICATES_SIMILARITY,
        )
        expect(result.similarity).toBe(DEFAULT_LANGUAGE_CERTIFICATES_SIMILARITY)
      }
    })
  })

  describe('getLanguageCertificatesStateOutput - gese-min operation', () => {
    it('should handle GESE certificate meeting requirements', () => {
      const state: LanguageCertificatesState = {
        kind: 'language_certificates',
        op: 'gese-min',
        expected: 7,
      }

      const input: LanguageCertificatesStateInput = {
        language_certificates: [mockGESECertificate],
      }

      const result = getLanguageCertificatesStateOutput(
        mockContext,
        state,
        input,
      )

      expect(result.kind).toBe('language_certificates')
      expect(result.op).toBe('gese-min')

      if (result.op === 'gese-min') {
        expect(result.expected).toBe(7)
        expect(result.actual).toBe(8)
        expect(result.similarity).toBe(1) // Exceeds requirement
      }
    })

    it('should handle GESE certificate not meeting requirements', () => {
      const state: LanguageCertificatesState = {
        kind: 'language_certificates',
        op: 'gese-min',
        expected: 10,
      }

      const input: LanguageCertificatesStateInput = {
        language_certificates: [mockGESECertificate],
      }

      const result = getLanguageCertificatesStateOutput(
        mockContext,
        state,
        input,
      )

      if (result.op === 'gese-min') {
        expect(result.expected).toBe(10)
        expect(result.actual).toBe(8)
        expect(result.similarity).toBe(0.8) // 8/10 = 0.8
      }
    })

    it('should handle missing GESE certificate', () => {
      const state: LanguageCertificatesState = {
        kind: 'language_certificates',
        op: 'gese-min',
        expected: 8,
      }

      const input: LanguageCertificatesStateInput = {
        language_certificates: [mockIELTSAcademicCertificate],
      }

      const result = getLanguageCertificatesStateOutput(
        mockContext,
        state,
        input,
      )

      if (result.op === 'gese-min') {
        expect(result.expected).toBe(8)
        expect(result.actual).toBeUndefined()
        expect(result.similarity).toBe(DEFAULT_LANGUAGE_CERTIFICATES_SIMILARITY)
      }
    })
  })

  describe('getLanguageCertificatesStateOutput - jlpt-min operation', () => {
    it('should handle JLPT certificate meeting requirements', () => {
      const state: LanguageCertificatesState = {
        kind: 'language_certificates',
        op: 'jlpt-min',
        expected: 'N3' as JLPTLevel,
      }

      const input: LanguageCertificatesStateInput = {
        language_certificates: [mockJLPTCertificate],
      }

      const result = getLanguageCertificatesStateOutput(
        mockContext,
        state,
        input,
      )

      expect(result.kind).toBe('language_certificates')
      expect(result.op).toBe('jlpt-min')

      if (result.op === 'jlpt-min') {
        expect(result.expected).toBe('N3')
        expect(result.actual).toBe('N2')
        expect(result.similarity).toBe(1) // N2 is a higher level than N3
      }
    })

    it('should handle JLPT certificate not meeting requirements', () => {
      const state: LanguageCertificatesState = {
        kind: 'language_certificates',
        op: 'jlpt-min',
        expected: 'N1' as JLPTLevel,
      }

      const input: LanguageCertificatesStateInput = {
        language_certificates: [mockJLPTCertificate],
      }

      const result = getLanguageCertificatesStateOutput(
        mockContext,
        state,
        input,
      )

      if (result.op === 'jlpt-min') {
        expect(result.expected).toBe('N1')
        expect(result.actual).toBe('N2')
        expect(result.similarity).toBe(0.75) // N2 is lower than N1
      }
    })

    it('should handle missing JLPT certificate', () => {
      const state: LanguageCertificatesState = {
        kind: 'language_certificates',
        op: 'jlpt-min',
        expected: 'N4' as JLPTLevel,
      }

      const input: LanguageCertificatesStateInput = {
        language_certificates: [mockTOEFLCertificate],
      }

      const result = getLanguageCertificatesStateOutput(
        mockContext,
        state,
        input,
      )

      if (result.op === 'jlpt-min') {
        expect(result.expected).toBe('N4')
        expect(result.actual).toBeUndefined()
        expect(result.similarity).toBe(DEFAULT_LANGUAGE_CERTIFICATES_SIMILARITY)
      }
    })
  })

  describe('Edge cases and error handling', () => {
    it('should handle empty language certificates array', () => {
      const state: LanguageCertificatesState = {
        kind: 'language_certificates',
        op: 'auen-min',
        expected: ['Competent'],
      }

      const input: LanguageCertificatesStateInput = {
        language_certificates: [],
      }

      const result = getLanguageCertificatesStateOutput(
        mockContext,
        state,
        input,
      )

      if (result.op === 'auen-min') {
        expect(result.similarity).toBe(DEFAULT_LANGUAGE_CERTIFICATES_SIMILARITY)
      }
    })

    it('should handle undefined language certificates', () => {
      const state: LanguageCertificatesState = {
        kind: 'language_certificates',
        op: 'clb-min',
        expected: ['8'],
      }

      const input: LanguageCertificatesStateInput = {}

      const result = getLanguageCertificatesStateOutput(
        mockContext,
        state,
        input,
      )

      if (result.op === 'clb-min') {
        expect(result.similarity).toBe(DEFAULT_LANGUAGE_CERTIFICATES_SIMILARITY)
      }
    })

    it('should handle multiple certificates of same type', () => {
      const state: LanguageCertificatesState = {
        kind: 'language_certificates',
        op: 'ielts-academic-min',
        expected: {
          listening: '7.0' as IELTSAcademicScore,
          reading: '7.0' as IELTSAcademicScore,
        },
      }

      const secondIELTS: LanguageCertificate = {
        type: 'IELTS_ACADEMIC',
        listening: '8',
        reading: '8.5',
        writing: '7.5',
        speaking: '8',
      }

      const input: LanguageCertificatesStateInput = {
        language_certificates: [mockIELTSAcademicCertificate, secondIELTS],
      }

      const result = getLanguageCertificatesStateOutput(
        mockContext,
        state,
        input,
      )

      if (result.op === 'ielts-academic-min') {
        expect(result.similarity).toBeGreaterThan(
          DEFAULT_LANGUAGE_CERTIFICATES_SIMILARITY,
        )
      }
    })

    it('should handle mixed certificate types', () => {
      const state: LanguageCertificatesState = {
        kind: 'language_certificates',
        op: 'auen-min',
        expected: ['Proficient'],
      }

      const input: LanguageCertificatesStateInput = {
        language_certificates: [
          mockIELTSAcademicCertificate,
          mockIELTSGeneralCertificate,
          mockCELPIPCertificate,
          mockJLPTCertificate,
        ],
      }

      const result = getLanguageCertificatesStateOutput(
        mockContext,
        state,
        input,
      )

      if (result.op === 'auen-min') {
        expect(result.actual).toBeDefined()
        expect(result.similarity).toBeGreaterThan(0)
      }
    })
  })
})
*/
