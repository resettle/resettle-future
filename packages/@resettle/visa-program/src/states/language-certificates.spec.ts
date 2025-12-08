import type {
  IeltsScore,
  LanguageCertificateInput,
} from '@resettle/schema/intelligence'
import assert from 'node:assert'
import { describe, it } from 'node:test'

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
const mockIELTSAcademicCertificate: LanguageCertificateInput = {
  type: 'ielts-academic',
  listening: '7.5',
  reading: '8',
  writing: '7.5',
  speaking: '7',
}

const mockIELTSGeneralCertificate: LanguageCertificateInput = {
  type: 'ielts-general',
  listening: '7',
  reading: '7.5',
  writing: '6.5',
  speaking: '7',
}

const mockCELPIPCertificate: LanguageCertificateInput = {
  type: 'celpip-general',
  listening: '9',
  reading: '8',
  writing: '7',
  speaking: '8',
}

const mockCAECertificate: LanguageCertificateInput = {
  type: 'cae',
  listening: 185,
  reading: 190,
  writing: 180,
  speaking: 185,
}

const mockFCECertificate: LanguageCertificateInput = {
  type: 'fce',
  listening: 165,
  reading: 170,
  writing: 160,
  speaking: 165,
}

const mockTOEFLCertificate: LanguageCertificateInput = {
  type: 'toefl',
  listening: 25,
  reading: 28,
  writing: 24,
  speaking: 26,
}

const mockOETCertificate: LanguageCertificateInput = {
  type: 'oet',
  listening: 380,
  reading: 400,
  writing: 350,
  speaking: 370,
}

const mockTCFCertificate: LanguageCertificateInput = {
  type: 'tcf-canada',
  listening: 520,
  reading: 515,
  writing: 12,
  speaking: 14,
}

const mockTEFCertificate: LanguageCertificateInput = {
  type: 'tef-canada',
  listening: 580,
  reading: 560,
  writing: 550,
  speaking: 540,
}

const mockGESECertificate: LanguageCertificateInput = {
  type: 'gese',
  grade: 8,
}

describe('language-certificates', () => {
  describe('getLanguageCertificatesStateOutput - auen-min operation', () => {
    it('should handle IELTS Academic certificate meeting AUEN requirements', () => {
      const state: LanguageCertificatesState = {
        kind: 'language_certificates',
        op: 'auen-min',
        expected: ['proficient'],
      }

      const input: LanguageCertificatesStateInput = {
        language_certificates: [mockIELTSAcademicCertificate],
      }

      const result = getLanguageCertificatesStateOutput(
        mockContext,
        state,
        input,
      )

      assert.equal(result.kind, 'language_certificates')
      assert.equal(result.op, 'auen-min')

      if (result.op === 'auen-min') {
        assert.deepStrictEqual(result.expected, ['proficient'])
        assert.ok(result.actual)
        assert.equal(result.similarity, 1)
      }
    })

    it('should handle IELTS Academic certificate not meeting AUEN requirements', () => {
      const state: LanguageCertificatesState = {
        kind: 'language_certificates',
        op: 'auen-min',
        expected: ['superior'],
      }

      const lowScoreIELTS: LanguageCertificateInput = {
        type: 'ielts-academic',
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
        assert.deepStrictEqual(result.expected, ['superior'])
        assert.ok(result.similarity < 1)
      }
    })

    it('should handle missing language certificates', () => {
      const state: LanguageCertificatesState = {
        kind: 'language_certificates',
        op: 'auen-min',
        expected: ['competent'],
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
        assert.deepStrictEqual(result.expected, ['competent'])
        assert.ok(!result.actual)
        assert.equal(
          result.similarity,
          DEFAULT_LANGUAGE_CERTIFICATES_SIMILARITY,
        )
      }
    })
  })

  describe('getLanguageCertificatesStateOutput - cefr-min operation', () => {
    it('should handle CAE certificate meeting CEFR requirements', () => {
      const state: LanguageCertificatesState = {
        kind: 'language_certificates',
        op: 'cefr-min',
        expected: { level: ['c1'] },
      }

      const input: LanguageCertificatesStateInput = {
        language_certificates: [mockCAECertificate],
      }

      const result = getLanguageCertificatesStateOutput(
        mockContext,
        state,
        input,
      )

      assert.equal(result.kind, 'language_certificates')
      assert.equal(result.op, 'cefr-min')

      if (result.op === 'cefr-min') {
        assert.deepStrictEqual(result.expected, { level: ['c1'] })
        assert.ok(result.actual)
        assert.equal(result.similarity, 1)
      }
    })

    it('should handle multiple expected CEFR levels', () => {
      const state: LanguageCertificatesState = {
        kind: 'language_certificates',
        op: 'cefr-min',
        expected: { level: ['b2', 'c1', 'c2'] },
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
        assert.deepStrictEqual(result.expected, { level: ['b2', 'c1', 'c2'] })
        assert.ok(result.similarity > 0)
      }
    })

    it('should handle missing certificates for CEFR', () => {
      const state: LanguageCertificatesState = {
        kind: 'language_certificates',
        op: 'cefr-min',
        expected: { level: ['b2'] },
      }

      const input: LanguageCertificatesStateInput = {}

      const result = getLanguageCertificatesStateOutput(
        mockContext,
        state,
        input,
      )

      if (result.op === 'cefr-min') {
        assert.equal(
          result.similarity,
          DEFAULT_LANGUAGE_CERTIFICATES_SIMILARITY,
        )
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

      assert.equal(result.kind, 'language_certificates')
      assert.equal(result.op, 'clb-min')

      if (result.op === 'clb-min') {
        assert.deepStrictEqual(result.expected, ['7'])
        assert.ok(result.actual)
        assert.ok(result.similarity > DEFAULT_LANGUAGE_CERTIFICATES_SIMILARITY)
      }
    })

    it('should handle insufficient CLB levels', () => {
      const state: LanguageCertificatesState = {
        kind: 'language_certificates',
        op: 'clb-min',
        expected: ['10'],
      }

      const lowCELPIP: LanguageCertificateInput = {
        type: 'celpip-general',
        listening: '5',
        reading: '4',
        writing: '4',
        speaking: '5',
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
        assert.ok(result.similarity < 1)
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

      assert.equal(result.kind, 'language_certificates')
      assert.equal(result.op, 'clb-sections-min')

      if (result.op === 'clb-sections-min') {
        assert.equal(result.filters.listening?.expected, '8')
        assert.equal(result.filters.reading?.expected, '7')
        assert.equal(result.filters.writing?.expected, '6')
        assert.equal(result.filters.speaking?.expected, '7')
        assert.ok(result.similarity > 0)
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
        assert.ok(result.filters.listening)
        assert.ok(result.filters.speaking)
        assert.ok(!result.filters.reading)
        assert.ok(!result.filters.writing)
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
        assert.equal(
          result.filters.listening?.similarity,
          DEFAULT_LANGUAGE_CERTIFICATES_SIMILARITY,
        )
        assert.equal(
          result.filters.reading?.similarity,
          DEFAULT_LANGUAGE_CERTIFICATES_SIMILARITY,
        )
        assert.equal(
          result.similarity,
          DEFAULT_LANGUAGE_CERTIFICATES_SIMILARITY,
        )
      }
    })
  })

  describe('getLanguageCertificatesStateOutput - four-sections-certificate-min operation', () => {
    it('should handle TOEFL certificate with four-section requirements', () => {
      const state: LanguageCertificatesState = {
        kind: 'language_certificates',
        op: 'four-sections-certificate-min',
        type: 'toefl',
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

      assert.equal(result.kind, 'language_certificates')
      assert.equal(result.op, 'four-sections-certificate-min')

      if (result.op === 'four-sections-certificate-min') {
        assert.equal(result.type, 'toefl')
        assert.equal(result.filters.listening?.expected, 22)
        assert.equal(result.filters.reading?.expected, 24)
        assert.equal(result.filters.writing?.expected, 20)
        assert.equal(result.filters.speaking?.expected, 23)
        assert.ok(result.similarity > DEFAULT_LANGUAGE_CERTIFICATES_SIMILARITY)
      }
    })

    it('should handle OET certificate requirements', () => {
      const state: LanguageCertificatesState = {
        kind: 'language_certificates',
        op: 'four-sections-certificate-min',
        type: 'oet',
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
        assert.equal(result.type, 'oet')
        assert.equal(result.similarity, 1) // All sections meet or exceed requirements
      }
    })

    it('should handle missing four-section certificate', () => {
      const state: LanguageCertificatesState = {
        kind: 'language_certificates',
        op: 'four-sections-certificate-min',
        type: 'toefl',
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
        assert.equal(
          result.filters.listening?.similarity,
          DEFAULT_LANGUAGE_CERTIFICATES_SIMILARITY,
        )
        assert.equal(
          result.filters.reading?.similarity,
          DEFAULT_LANGUAGE_CERTIFICATES_SIMILARITY,
        )
      }
    })

    it('should handle TCF Canada certificate', () => {
      const state: LanguageCertificatesState = {
        kind: 'language_certificates',
        op: 'four-sections-certificate-min',
        type: 'tcf-canada',
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
        assert.equal(result.type, 'tcf-canada')
        assert.ok(result.similarity > DEFAULT_LANGUAGE_CERTIFICATES_SIMILARITY)
      }
    })

    it('should handle TEF Canada certificate', () => {
      const state: LanguageCertificatesState = {
        kind: 'language_certificates',
        op: 'four-sections-certificate-min',
        type: 'tef-canada',
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
        assert.equal(result.type, 'tef-canada')
        assert.ok(result.similarity > DEFAULT_LANGUAGE_CERTIFICATES_SIMILARITY)
      }
    })
  })

  describe('getLanguageCertificatesStateOutput - ielts-min operation', () => {
    it('should handle IELTS Academic certificate meeting requirements', () => {
      const state: LanguageCertificatesState = {
        kind: 'language_certificates',
        op: 'ielts-min',
        type: 'ielts-academic',
        expected: {
          listening: '7.0' as IeltsScore,
          reading: '7.5' as IeltsScore,
          writing: '6.0' as IeltsScore,
          speaking: '6.5' as IeltsScore,
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

      assert.equal(result.kind, 'language_certificates')
      assert.equal(result.op, 'ielts-min')

      if (result.op === 'ielts-min') {
        assert.equal(result.filters.listening?.expected, '7.0')
        assert.equal(result.filters.reading?.expected, '7.5')
        assert.equal(result.filters.writing?.expected, '6.0')
        assert.equal(result.filters.speaking?.expected, '6.5')
        assert.ok(result.similarity > DEFAULT_LANGUAGE_CERTIFICATES_SIMILARITY)
      }
    })

    it('should handle partial IELTS Academic requirements', () => {
      const state: LanguageCertificatesState = {
        kind: 'language_certificates',
        op: 'ielts-min',
        type: 'ielts-academic',
        expected: {
          listening: '8.0' as IeltsScore,
          writing: '7.0' as IeltsScore,
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

      if (result.op === 'ielts-min') {
        assert.ok(result.filters.listening)
        assert.ok(result.filters.writing)
        assert.ok(!result.filters.reading)
        assert.ok(!result.filters.speaking)
      }
    })

    it('should handle missing IELTS Academic certificate', () => {
      const state: LanguageCertificatesState = {
        kind: 'language_certificates',
        op: 'ielts-min',
        type: 'ielts-academic',
        expected: {
          listening: '7.0' as IeltsScore,
          reading: '7.0' as IeltsScore,
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

      if (result.op === 'ielts-min') {
        assert.equal(
          result.filters.listening?.similarity,
          DEFAULT_LANGUAGE_CERTIFICATES_SIMILARITY,
        )
        assert.equal(
          result.filters.reading?.similarity,
          DEFAULT_LANGUAGE_CERTIFICATES_SIMILARITY,
        )
        assert.equal(
          result.similarity,
          DEFAULT_LANGUAGE_CERTIFICATES_SIMILARITY,
        )
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

      assert.equal(result.kind, 'language_certificates')
      assert.equal(result.op, 'gese-min')

      if (result.op === 'gese-min') {
        assert.equal(result.expected, 7)
        assert.equal(result.actual, 8)
        assert.equal(result.similarity, 1) // Exceeds requirement
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
        assert.equal(result.expected, 10)
        assert.equal(result.actual, 8)
        assert.equal(result.similarity, 0.8) // 8/10 = 0.8
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
        assert.equal(result.expected, 8)
        assert.ok(!result.actual)
        assert.equal(
          result.similarity,
          DEFAULT_LANGUAGE_CERTIFICATES_SIMILARITY,
        )
      }
    })
  })

  describe('Edge cases and error handling', () => {
    it('should handle empty language certificates array', () => {
      const state: LanguageCertificatesState = {
        kind: 'language_certificates',
        op: 'auen-min',
        expected: ['competent'],
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
        assert.equal(
          result.similarity,
          DEFAULT_LANGUAGE_CERTIFICATES_SIMILARITY,
        )
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
        assert.equal(
          result.similarity,
          DEFAULT_LANGUAGE_CERTIFICATES_SIMILARITY,
        )
      }
    })

    it('should handle multiple certificates of same type', () => {
      const state: LanguageCertificatesState = {
        kind: 'language_certificates',
        op: 'ielts-min',
        type: 'ielts-academic',
        expected: {
          listening: '7.0' as IeltsScore,
          reading: '7.0' as IeltsScore,
        },
      }

      const secondIELTS: LanguageCertificateInput = {
        type: 'ielts-academic',
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

      if (result.op === 'ielts-min') {
        assert.ok(result.similarity > DEFAULT_LANGUAGE_CERTIFICATES_SIMILARITY)
      }
    })

    it('should handle mixed certificate types', () => {
      const state: LanguageCertificatesState = {
        kind: 'language_certificates',
        op: 'auen-min',
        expected: ['proficient'],
      }

      const input: LanguageCertificatesStateInput = {
        language_certificates: [
          mockIELTSAcademicCertificate,
          mockIELTSGeneralCertificate,
          mockCELPIPCertificate,
        ],
      }

      const result = getLanguageCertificatesStateOutput(
        mockContext,
        state,
        input,
      )

      if (result.op === 'auen-min') {
        assert.ok(result.actual)
        assert.ok(result.similarity > 0)
      }
    })
  })
})
