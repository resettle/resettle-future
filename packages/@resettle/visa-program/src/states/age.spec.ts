import assert from 'node:assert'
import { describe, it } from 'node:test'

import { DEFAULT_AGE_SIMILARITY, getAgeStateOutput, type AgeState } from './age'

describe('age state', () => {
  describe('getAgeStateOutput', () => {
    describe('>= operation', () => {
      it('should return similarity 1 when age is greater than expected', () => {
        const state: AgeState = {
          kind: 'age',
          op: '>=',
          expected: 25,
        }

        const result = getAgeStateOutput(state, { age: 30 })

        assert.deepStrictEqual(result, {
          kind: 'age',
          op: '>=',
          expected: 25,
          actual: 30,
          similarity: 1,
        })
      })

      it('should return similarity 1 when age is equal to expected', () => {
        const state: AgeState = {
          kind: 'age',
          op: '>=',
          expected: 25,
        }

        const result = getAgeStateOutput(state, { age: 25 })

        assert.deepStrictEqual(result, {
          kind: 'age',
          op: '>=',
          expected: 25,
          actual: 25,
          similarity: 1,
        })
      })

      it('should return similarity 0 when age is less than expected', () => {
        const state: AgeState = {
          kind: 'age',
          op: '>=',
          expected: 25,
        }

        const result = getAgeStateOutput(state, { age: 20 })

        assert.deepStrictEqual(result, {
          kind: 'age',
          op: '>=',
          expected: 25,
          actual: 20,
          similarity: 0,
        })
      })
    })

    describe('<= operation', () => {
      it('should return similarity 1 when age is less than expected', () => {
        const state: AgeState = {
          kind: 'age',
          op: '<=',
          expected: 35,
        }

        const result = getAgeStateOutput(state, { age: 30 })

        assert.deepStrictEqual(result, {
          kind: 'age',
          op: '<=',
          expected: 35,
          actual: 30,
          similarity: 1,
        })
      })

      it('should return similarity 1 when age is equal to expected', () => {
        const state: AgeState = {
          kind: 'age',
          op: '<=',
          expected: 35,
        }

        const result = getAgeStateOutput(state, { age: 35 })

        assert.deepStrictEqual(result, {
          kind: 'age',
          op: '<=',
          expected: 35,
          actual: 35,
          similarity: 1,
        })
      })

      it('should return similarity 0 when age is greater than expected', () => {
        const state: AgeState = {
          kind: 'age',
          op: '<=',
          expected: 35,
        }

        const result = getAgeStateOutput(state, { age: 40 })

        assert.deepStrictEqual(result, {
          kind: 'age',
          op: '<=',
          expected: 35,
          actual: 40,
          similarity: 0,
        })
      })
    })

    describe('between operation', () => {
      it('should return similarity 1 when age is within range', () => {
        const state: AgeState = {
          kind: 'age',
          op: 'between',
          expected: { min: 25, max: 35 },
        }

        const result = getAgeStateOutput(state, { age: 30 })

        assert.deepStrictEqual(result, {
          kind: 'age',
          op: 'between',
          expected: { min: 25, max: 35 },
          actual: 30,
          similarity: 1,
        })
      })

      it('should return similarity 1 when age equals minimum', () => {
        const state: AgeState = {
          kind: 'age',
          op: 'between',
          expected: { min: 25, max: 35 },
        }

        const result = getAgeStateOutput(state, { age: 25 })

        assert.deepStrictEqual(result, {
          kind: 'age',
          op: 'between',
          expected: { min: 25, max: 35 },
          actual: 25,
          similarity: 1,
        })
      })

      it('should return similarity 1 when age equals maximum', () => {
        const state: AgeState = {
          kind: 'age',
          op: 'between',
          expected: { min: 25, max: 35 },
        }

        const result = getAgeStateOutput(state, { age: 35 })

        assert.deepStrictEqual(result, {
          kind: 'age',
          op: 'between',
          expected: { min: 25, max: 35 },
          actual: 35,
          similarity: 1,
        })
      })

      it('should return similarity 0 when age is below minimum', () => {
        const state: AgeState = {
          kind: 'age',
          op: 'between',
          expected: { min: 25, max: 35 },
        }

        const result = getAgeStateOutput(state, { age: 20 })

        assert.deepStrictEqual(result, {
          kind: 'age',
          op: 'between',
          expected: { min: 25, max: 35 },
          actual: 20,
          similarity: 0,
        })
      })

      it('should return similarity 0 when age is above maximum', () => {
        const state: AgeState = {
          kind: 'age',
          op: 'between',
          expected: { min: 25, max: 35 },
        }

        const result = getAgeStateOutput(state, { age: 40 })

        assert.deepStrictEqual(result, {
          kind: 'age',
          op: 'between',
          expected: { min: 25, max: 35 },
          actual: 40,
          similarity: 0,
        })
      })
    })

    describe('edge cases', () => {
      it('should handle age 0', () => {
        const state: AgeState = {
          kind: 'age',
          op: '>=',
          expected: 10,
        }

        const result = getAgeStateOutput(state, { age: 0 })

        assert.deepStrictEqual(result, {
          kind: 'age',
          op: '>=',
          expected: 10,
          actual: 0,
          similarity: DEFAULT_AGE_SIMILARITY,
        })
      })

      it('should handle large ages', () => {
        const state: AgeState = {
          kind: 'age',
          op: '<=',
          expected: 100,
        }

        const result = getAgeStateOutput(state, { age: 99 })

        assert.deepStrictEqual(result, {
          kind: 'age',
          op: '<=',
          expected: 100,
          actual: 99,
          similarity: 1,
        })
      })
    })
  })
})
