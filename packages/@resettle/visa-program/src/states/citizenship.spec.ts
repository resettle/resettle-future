import type { CountryAlpha2Code } from '@resettle/schema'
import assert from 'node:assert'
import { describe, it } from 'node:test'

import { getCitizenshipStateOutput, type CitizenshipState } from './citizenship'

describe('citizenship state', () => {
  describe('getCitizenshipStateOutput', () => {
    describe('in operation', () => {
      it('should return similarity 1 when citizenship matches expected countries', () => {
        const state: CitizenshipState = {
          kind: 'citizenship',
          op: 'in',
          expected: ['US', 'CA', 'GB'] satisfies CountryAlpha2Code[],
        }

        const result = getCitizenshipStateOutput(state, {
          citizenship: ['US'] satisfies CountryAlpha2Code[],
        })

        assert.deepStrictEqual(result, {
          kind: 'citizenship',
          op: 'in',
          expected: ['US', 'CA', 'GB'],
          actual: ['US'],
          similarity: 1,
        })
      })

      it('should return similarity 1 when user has multiple citizenships and one matches', () => {
        const state: CitizenshipState = {
          kind: 'citizenship',
          op: 'in',
          expected: ['US', 'CA', 'GB'] satisfies CountryAlpha2Code[],
        }

        const result = getCitizenshipStateOutput(state, {
          citizenship: ['FR', 'CA', 'DE'] satisfies CountryAlpha2Code[],
        })

        assert.deepStrictEqual(result, {
          kind: 'citizenship',
          op: 'in',
          expected: ['US', 'CA', 'GB'],
          actual: ['FR', 'CA', 'DE'],
          similarity: 1,
        })
      })

      it('should return similarity 0 when citizenship does not match any expected countries', () => {
        const state: CitizenshipState = {
          kind: 'citizenship',
          op: 'in',
          expected: ['US', 'CA', 'GB'] satisfies CountryAlpha2Code[],
        }

        const result = getCitizenshipStateOutput(state, {
          citizenship: ['FR', 'DE'] satisfies CountryAlpha2Code[],
        })

        assert.deepStrictEqual(result, {
          kind: 'citizenship',
          op: 'in',
          expected: ['US', 'CA', 'GB'],
          actual: ['FR', 'DE'],
          similarity: 0,
        })
      })

      it('should return similarity 0 when user has no citizenship', () => {
        const state: CitizenshipState = {
          kind: 'citizenship',
          op: 'in',
          expected: ['US', 'CA', 'GB'] satisfies CountryAlpha2Code[],
        }

        const result = getCitizenshipStateOutput(state, {
          citizenship: [] satisfies CountryAlpha2Code[],
        })

        assert.deepStrictEqual(result, {
          kind: 'citizenship',
          op: 'in',
          expected: ['US', 'CA', 'GB'],
          actual: [],
          similarity: 0,
        })
      })
    })

    describe('not_in operation', () => {
      it('should return similarity 1 when citizenship does not match any expected countries', () => {
        const state: CitizenshipState = {
          kind: 'citizenship',
          op: 'not_in',
          expected: ['US', 'CA', 'GB'] satisfies CountryAlpha2Code[],
        }

        const result = getCitizenshipStateOutput(state, {
          citizenship: ['FR', 'DE'] satisfies CountryAlpha2Code[],
        })

        assert.deepStrictEqual(result, {
          kind: 'citizenship',
          op: 'not_in',
          expected: ['US', 'CA', 'GB'],
          actual: ['FR', 'DE'],
          similarity: 1,
        })
      })

      it('should return similarity 1 when user has no citizenship', () => {
        const state: CitizenshipState = {
          kind: 'citizenship',
          op: 'not_in',
          expected: ['US', 'CA', 'GB'] satisfies CountryAlpha2Code[],
        }

        const result = getCitizenshipStateOutput(state, {
          citizenship: [] satisfies CountryAlpha2Code[],
        })

        assert.deepStrictEqual(result, {
          kind: 'citizenship',
          op: 'not_in',
          expected: ['US', 'CA', 'GB'],
          actual: [],
          similarity: 1,
        })
      })

      it('should return similarity 0 when citizenship matches any expected country', () => {
        const state: CitizenshipState = {
          kind: 'citizenship',
          op: 'not_in',
          expected: ['US', 'CA', 'GB'] satisfies CountryAlpha2Code[],
        }

        const result = getCitizenshipStateOutput(state, {
          citizenship: ['US'] satisfies CountryAlpha2Code[],
        })

        assert.deepStrictEqual(result, {
          kind: 'citizenship',
          op: 'not_in',
          expected: ['US', 'CA', 'GB'],
          actual: ['US'],
          similarity: 0,
        })
      })

      it('should return similarity 0 when user has multiple citizenships and one matches expected', () => {
        const state: CitizenshipState = {
          kind: 'citizenship',
          op: 'not_in',
          expected: ['US', 'CA', 'GB'] satisfies CountryAlpha2Code[],
        }

        const result = getCitizenshipStateOutput(state, {
          citizenship: ['FR', 'CA', 'DE'] satisfies CountryAlpha2Code[],
        })

        assert.deepStrictEqual(result, {
          kind: 'citizenship',
          op: 'not_in',
          expected: ['US', 'CA', 'GB'],
          actual: ['FR', 'CA', 'DE'],
          similarity: 0,
        })
      })
    })

    describe('edge cases', () => {
      it('should handle single expected country with in operation', () => {
        const state: CitizenshipState = {
          kind: 'citizenship',
          op: 'in',
          expected: ['US'] satisfies CountryAlpha2Code[],
        }

        const result = getCitizenshipStateOutput(state, {
          citizenship: ['US'] satisfies CountryAlpha2Code[],
        })

        assert.deepStrictEqual(result, {
          kind: 'citizenship',
          op: 'in',
          expected: ['US'],
          actual: ['US'],
          similarity: 1,
        })
      })

      it('should handle single expected country with not_in operation', () => {
        const state: CitizenshipState = {
          kind: 'citizenship',
          op: 'not_in',
          expected: ['US'] satisfies CountryAlpha2Code[],
        }

        const result = getCitizenshipStateOutput(state, {
          citizenship: ['CA'] satisfies CountryAlpha2Code[],
        })

        assert.deepStrictEqual(result, {
          kind: 'citizenship',
          op: 'not_in',
          expected: ['US'],
          actual: ['CA'],
          similarity: 1,
        })
      })

      it('should handle case sensitivity in country codes', () => {
        const state: CitizenshipState = {
          kind: 'citizenship',
          op: 'in',
          expected: ['US'] satisfies CountryAlpha2Code[],
        }

        const result = getCitizenshipStateOutput(state, {
          citizenship: ['US'] satisfies CountryAlpha2Code[],
        })

        assert.deepStrictEqual(result.similarity, 1)
      })
    })
  })
})
