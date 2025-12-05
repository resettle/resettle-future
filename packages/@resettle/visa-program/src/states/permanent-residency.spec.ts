import type { CountryAlpha2Code } from '@resettle/schema'
import assert from 'node:assert'
import { describe, it } from 'node:test'

import {
  getPermanentResidencyStateOutput,
  type PermanentResidencyState,
} from './permanent-residency'

describe('permanent residency state', () => {
  describe('getPermanentResidencyStateOutput', () => {
    describe('in operation', () => {
      it('should return similarity 1 when permanent residency matches expected countries', () => {
        const state: PermanentResidencyState = {
          kind: 'permanent_residency',
          op: 'in',
          expected: ['US', 'CA', 'GB'] satisfies CountryAlpha2Code[],
        }

        const result = getPermanentResidencyStateOutput(state, {
          permanent_residency: ['US'] satisfies CountryAlpha2Code[],
        })

        assert.deepStrictEqual(result, {
          kind: 'permanent_residency',
          op: 'in',
          expected: ['US', 'CA', 'GB'],
          actual: ['US'],
          similarity: 1,
        })
      })

      it('should return similarity 1 when user has multiple permanent residencies and one matches', () => {
        const state: PermanentResidencyState = {
          kind: 'permanent_residency',
          op: 'in',
          expected: ['US', 'CA', 'GB'] satisfies CountryAlpha2Code[],
        }

        const result = getPermanentResidencyStateOutput(state, {
          permanent_residency: ['FR', 'CA', 'DE'] satisfies CountryAlpha2Code[],
        })

        assert.deepStrictEqual(result, {
          kind: 'permanent_residency',
          op: 'in',
          expected: ['US', 'CA', 'GB'],
          actual: ['FR', 'CA', 'DE'],
          similarity: 1,
        })
      })

      it('should return similarity 0 when permanent residency does not match any expected countries', () => {
        const state: PermanentResidencyState = {
          kind: 'permanent_residency',
          op: 'in',
          expected: ['US', 'CA', 'GB'] satisfies CountryAlpha2Code[],
        }

        const result = getPermanentResidencyStateOutput(state, {
          permanent_residency: ['FR', 'DE'] satisfies CountryAlpha2Code[],
        })

        assert.deepStrictEqual(result, {
          kind: 'permanent_residency',
          op: 'in',
          expected: ['US', 'CA', 'GB'],
          actual: ['FR', 'DE'],
          similarity: 0,
        })
      })

      it('should return similarity 0 when user has no permanent residency', () => {
        const state: PermanentResidencyState = {
          kind: 'permanent_residency',
          op: 'in',
          expected: ['US', 'CA', 'GB'] satisfies CountryAlpha2Code[],
        }

        const result = getPermanentResidencyStateOutput(state, {
          permanent_residency: [] satisfies CountryAlpha2Code[],
        })

        assert.deepStrictEqual(result, {
          kind: 'permanent_residency',
          op: 'in',
          expected: ['US', 'CA', 'GB'],
          actual: [],
          similarity: 0,
        })
      })
    })

    describe('not_in operation', () => {
      it('should return similarity 1 when permanent residency does not match any expected countries', () => {
        const state: PermanentResidencyState = {
          kind: 'permanent_residency',
          op: 'not_in',
          expected: ['US', 'CA', 'GB'] satisfies CountryAlpha2Code[],
        }

        const result = getPermanentResidencyStateOutput(state, {
          permanent_residency: ['FR', 'DE'] satisfies CountryAlpha2Code[],
        })

        assert.deepStrictEqual(result, {
          kind: 'permanent_residency',
          op: 'not_in',
          expected: ['US', 'CA', 'GB'],
          actual: ['FR', 'DE'],
          similarity: 1,
        })
      })

      it('should return similarity 1 when user has no permanent residency', () => {
        const state: PermanentResidencyState = {
          kind: 'permanent_residency',
          op: 'not_in',
          expected: ['US', 'CA', 'GB'] satisfies CountryAlpha2Code[],
        }

        const result = getPermanentResidencyStateOutput(state, {
          permanent_residency: [] satisfies CountryAlpha2Code[],
        })

        assert.deepStrictEqual(result, {
          kind: 'permanent_residency',
          op: 'not_in',
          expected: ['US', 'CA', 'GB'],
          actual: [],
          similarity: 1,
        })
      })

      it('should return similarity 0 when permanent residency matches any expected country', () => {
        const state: PermanentResidencyState = {
          kind: 'permanent_residency',
          op: 'not_in',
          expected: ['US', 'CA', 'GB'] satisfies CountryAlpha2Code[],
        }

        const result = getPermanentResidencyStateOutput(state, {
          permanent_residency: ['US'] satisfies CountryAlpha2Code[],
        })

        assert.deepStrictEqual(result, {
          kind: 'permanent_residency',
          op: 'not_in',
          expected: ['US', 'CA', 'GB'],
          actual: ['US'],
          similarity: 0,
        })
      })

      it('should return similarity 0 when user has multiple permanent residencies and one matches expected', () => {
        const state: PermanentResidencyState = {
          kind: 'permanent_residency',
          op: 'not_in',
          expected: ['US', 'CA', 'GB'] satisfies CountryAlpha2Code[],
        }

        const result = getPermanentResidencyStateOutput(state, {
          permanent_residency: ['FR', 'CA', 'DE'] satisfies CountryAlpha2Code[],
        })

        assert.deepStrictEqual(result, {
          kind: 'permanent_residency',
          op: 'not_in',
          expected: ['US', 'CA', 'GB'],
          actual: ['FR', 'CA', 'DE'],
          similarity: 0,
        })
      })
    })

    describe('edge cases', () => {
      it('should handle single expected country with in operation', () => {
        const state: PermanentResidencyState = {
          kind: 'permanent_residency',
          op: 'in',
          expected: ['AU'] satisfies CountryAlpha2Code[],
        }

        const result = getPermanentResidencyStateOutput(state, {
          permanent_residency: ['AU'] satisfies CountryAlpha2Code[],
        })

        assert.deepStrictEqual(result, {
          kind: 'permanent_residency',
          op: 'in',
          expected: ['AU'],
          actual: ['AU'],
          similarity: 1,
        })
      })

      it('should handle single expected country with not_in operation', () => {
        const state: PermanentResidencyState = {
          kind: 'permanent_residency',
          op: 'not_in',
          expected: ['US'] satisfies CountryAlpha2Code[],
        }

        const result = getPermanentResidencyStateOutput(state, {
          permanent_residency: ['CA'] satisfies CountryAlpha2Code[],
        })

        assert.deepStrictEqual(result, {
          kind: 'permanent_residency',
          op: 'not_in',
          expected: ['US'],
          actual: ['CA'],
          similarity: 1,
        })
      })

      it('should handle duplicate permanent residencies in user data', () => {
        const state: PermanentResidencyState = {
          kind: 'permanent_residency',
          op: 'in',
          expected: ['US'] satisfies CountryAlpha2Code[],
        }

        const result = getPermanentResidencyStateOutput(state, {
          permanent_residency: ['US', 'US'] satisfies CountryAlpha2Code[],
        })

        assert.equal(result.similarity, 1)
      })

      it('should handle many expected countries', () => {
        const state: PermanentResidencyState = {
          kind: 'permanent_residency',
          op: 'in',
          expected: [
            'US',
            'CA',
            'GB',
            'AU',
            'DE',
            'FR',
            'NZ',
          ] satisfies CountryAlpha2Code[],
        }

        const result = getPermanentResidencyStateOutput(state, {
          permanent_residency: ['NZ'] satisfies CountryAlpha2Code[],
        })

        assert.equal(result.similarity, 1)
      })
    })
  })
})
