import type { CountryAlpha2Code, WorkExperience } from '@resettle/schema'
import assert from 'assert'
import { describe, it } from 'node:test'

import { createMockContext } from '../mock'
import {
  getAndStateOutput,
  getOrStateOutput,
  type AndState,
  type OrState,
} from './index'

describe('state index', () => {
  const mockContext = createMockContext()

  const mockInput = {
    age: 30,
    citizenship: ['US'] as CountryAlpha2Code[],
    permanent_residency: ['CA'] as CountryAlpha2Code[],
    work_experiences: [
      {
        id: '1',
        employer_country: 'US' as CountryAlpha2Code,
        employment_type: 'full_time' as const,
        start_date: new Date('2022-01-01'),
        end_date: new Date('2023-12-31'),
        fixed_annual_salary: { amount: 100000, currency: 'USD' },
        is_remote: false,
        employer_name: 'Tech Corp',
      },
    ] as WorkExperience[],
  }

  describe('getAndStateOutput', () => {
    it('should return average similarity when all children pass', () => {
      const state: AndState = {
        kind: 'and',
        children: [
          {
            kind: 'age',
            op: '>=',
            expected: 25,
          },
          {
            kind: 'citizenship',
            op: 'in',
            expected: ['US', 'CA'] as CountryAlpha2Code[],
          },
        ],
      }

      const result = getAndStateOutput(mockContext, state, mockInput)

      assert.equal(result.kind, 'and')
      assert.equal(result.children.length, 2)
      assert.deepStrictEqual(result.children[0], {
        kind: 'age',
        op: '>=',
        expected: 25,
        actual: 30,
        similarity: 1,
      })
      assert.deepStrictEqual(result.children[1], {
        kind: 'citizenship',
        op: 'in',
        expected: ['US', 'CA'],
        actual: ['US'],
        similarity: 1,
      })
      assert.equal(result.similarity, 1) // (1 + 1) / 2 = 1
    })

    it('should return average similarity when some children fail', () => {
      const state: AndState = {
        kind: 'and',
        children: [
          {
            kind: 'age',
            op: '>=',
            expected: 35, // This will fail
          },
          {
            kind: 'citizenship',
            op: 'in',
            expected: ['US'] as CountryAlpha2Code[],
          },
        ],
      }

      const result = getAndStateOutput(mockContext, state, mockInput)

      assert.equal(result.kind, 'and')
      assert.equal(result.children.length, 2)
      assert.equal(result.children[0].similarity, 0) // Age 30 >= 35 fails
      assert.equal(result.children[1].similarity, 1) // Citizenship matches
      assert.equal(result.similarity, 0) // min(0, 1) = 0
    })

    it('should handle empty children array', () => {
      const state: AndState = {
        kind: 'and',
        children: [],
      }

      const result = getAndStateOutput(mockContext, state, mockInput)

      assert.equal(result.kind, 'and')
      assert.equal(result.children.length, 0)
      assert.equal(result.similarity, 0)
    })

    it('should handle nested and/or operations', () => {
      const state: AndState = {
        kind: 'and',
        children: [
          {
            kind: 'age',
            op: '>=',
            expected: 25,
          },
          {
            kind: 'or',
            children: [
              {
                kind: 'citizenship',
                op: 'in',
                expected: ['FR'] as CountryAlpha2Code[], // This will fail
              },
              {
                kind: 'permanent_residency',
                op: 'in',
                expected: ['CA'] as CountryAlpha2Code[], // This will pass
              },
            ],
          },
        ],
      }

      const result = getAndStateOutput(mockContext, state, mockInput)

      assert.equal(result.kind, 'and')
      assert.equal(result.children.length, 2)
      assert.equal(result.children[0].similarity, 1) // Age passes
      assert.equal(result.children[1].similarity, 1) // Or passes (because permanent_residency matches)
      assert.equal(result.similarity, 1) // (1 + 1) / 2 = 1
    })
  })

  describe('getOrStateOutput', () => {
    it('should return maximum similarity when all children pass', () => {
      const state: OrState = {
        kind: 'or',
        children: [
          {
            kind: 'age',
            op: '>=',
            expected: 25,
          },
          {
            kind: 'citizenship',
            op: 'in',
            expected: ['US'] as CountryAlpha2Code[],
          },
        ],
      }

      const result = getOrStateOutput(mockContext, state, mockInput)

      assert.equal(result.kind, 'or')
      assert.equal(result.children.length, 2)
      assert.equal(result.children[0].similarity, 1)
      assert.equal(result.children[1].similarity, 1)
      assert.equal(result.similarity, 1) // max(1, 1) = 1
    })

    it('should return maximum similarity when only one child passes', () => {
      const state: OrState = {
        kind: 'or',
        children: [
          {
            kind: 'age',
            op: '>=',
            expected: 35, // This will fail
          },
          {
            kind: 'citizenship',
            op: 'in',
            expected: ['US'] as CountryAlpha2Code[], // This will pass
          },
        ],
      }

      const result = getOrStateOutput(mockContext, state, mockInput)

      assert.equal(result.kind, 'or')
      assert.equal(result.children.length, 2)
      assert.equal(result.children[0].similarity, 0) // Age fails
      assert.equal(result.children[1].similarity, 1) // Citizenship passes
      assert.equal(result.similarity, 1) // max(0, 1) = 1
    })

    it('should return 0 similarity when all children fail', () => {
      const state: OrState = {
        kind: 'or',
        children: [
          {
            kind: 'age',
            op: '>=',
            expected: 35, // This will fail
          },
          {
            kind: 'citizenship',
            op: 'in',
            expected: ['FR'] as CountryAlpha2Code[], // This will fail
          },
        ],
      }

      const result = getOrStateOutput(mockContext, state, mockInput)

      assert.equal(result.kind, 'or')
      assert.equal(result.children.length, 2)
      assert.equal(result.children[0].similarity, 0)
      assert.equal(result.children[1].similarity, 0)
      assert.equal(result.similarity, 0) // max(0, 0) = 0
    })

    it('should handle empty children array', () => {
      const state: OrState = {
        kind: 'or',
        children: [],
      }

      const result = getOrStateOutput(mockContext, state, mockInput)

      assert.equal(result.kind, 'or')
      assert.equal(result.children.length, 0)
      assert.equal(result.similarity, 0)
    })

    it('should handle nested and/or operations', () => {
      const state: OrState = {
        kind: 'or',
        children: [
          {
            kind: 'and',
            children: [
              {
                kind: 'age',
                op: '>=',
                expected: 35, // This will fail
              },
              {
                kind: 'citizenship',
                op: 'in',
                expected: ['US'] as CountryAlpha2Code[], // This would pass but AND needs both
              },
            ],
          },
          {
            kind: 'citizenship',
            op: 'in',
            expected: ['US'] as CountryAlpha2Code[], // This will pass
          },
        ],
      }

      const result = getOrStateOutput(mockContext, state, mockInput)

      assert.equal(result.kind, 'or')
      assert.equal(result.children.length, 2)
      assert.equal(result.children[0].similarity, 0) // AND: min(0, 1) = 0
      assert.equal(result.children[1].similarity, 1) // Citizenship passes
      assert.equal(result.similarity, 1) // max(0, 1) = 1
    })
  })

  describe('complex nested scenarios', () => {
    it('should handle deeply nested and/or combinations', () => {
      const state: AndState = {
        kind: 'and',
        children: [
          {
            kind: 'or',
            children: [
              {
                kind: 'age',
                op: 'between',
                expected: { min: 25, max: 35 },
              },
              {
                kind: 'citizenship',
                op: 'in',
                expected: ['CA'] as CountryAlpha2Code[],
              },
            ],
          },
          {
            kind: 'and',
            children: [
              {
                kind: 'permanent_residency',
                op: 'in',
                expected: ['CA', 'US'] as CountryAlpha2Code[],
              },
              {
                kind: 'work_experiences',
                op: 'contains',
                expected: {
                  employer_country_in: ['US'] as CountryAlpha2Code[],
                },
              },
            ],
          },
        ],
      }

      const result = getAndStateOutput(mockContext, state, mockInput)

      assert.equal(result.kind, 'and')
      assert.equal(result.children.length, 2)

      // First OR: age between 25-35 (passes) OR citizenship CA (fails) = max(1, 0) = 1
      assert.equal(result.children[0].similarity, 1)

      // Second AND: permanent_residency CA (passes) AND work_experiences US (passes) = (1 + 1) / 2 = 1
      assert.equal(result.children[1].similarity, 1)

      // Overall AND: (1 + 1) / 2 = 1
      assert.equal(result.similarity, 1)
    })

    it('should handle work experiences state correctly', () => {
      const state: OrState = {
        kind: 'or',
        children: [
          {
            kind: 'work_experiences',
            op: 'contains',
            expected: {
              employer_country_in: ['FR'] as CountryAlpha2Code[], // This will fail
              min_duration: {
                value: 6,
                unit: 'month',
              }, // This might pass
            },
          },
          {
            kind: 'age',
            op: '>=',
            expected: 25, // This will pass
          },
        ],
      }

      const result = getOrStateOutput(mockContext, state, mockInput)

      assert.equal(result.kind, 'or')
      assert.equal(result.children.length, 2)

      // Work experiences: some filters pass, some fail - should get partial similarity
      assert.ok(result.children[0].similarity > 0)
      assert.ok(result.children[0].similarity < 1)

      // Age: should pass
      assert.equal(result.children[1].similarity, 1)

      // OR takes the maximum
      assert.equal(result.similarity, 1)
    })
  })

  describe('edge cases', () => {
    it('should handle single child in and operation', () => {
      const state: AndState = {
        kind: 'and',
        children: [
          {
            kind: 'age',
            op: '>=',
            expected: 25,
          },
        ],
      }

      const result = getAndStateOutput(mockContext, state, mockInput)

      assert.equal(result.similarity, 1)
    })

    it('should handle single child in or operation', () => {
      const state: OrState = {
        kind: 'or',
        children: [
          {
            kind: 'age',
            op: '>=',
            expected: 35, // This will fail
          },
        ],
      }

      const result = getOrStateOutput(mockContext, state, mockInput)

      assert.equal(result.similarity, 0)
    })

    it('should handle multiple levels of nesting', () => {
      const state: OrState = {
        kind: 'or',
        children: [
          {
            kind: 'and',
            children: [
              {
                kind: 'or',
                children: [
                  {
                    kind: 'age',
                    op: '>=',
                    expected: 35, // Fails
                  },
                  {
                    kind: 'citizenship',
                    op: 'in',
                    expected: ['GB'] as CountryAlpha2Code[], // Fails
                  },
                ],
              },
            ],
          },
          {
            kind: 'permanent_residency',
            op: 'in',
            expected: ['CA'] as CountryAlpha2Code[], // Passes
          },
        ],
      }

      const result = getOrStateOutput(mockContext, state, mockInput)

      assert.equal(result.kind, 'or')
      assert.equal(result.similarity, 1) // Because permanent_residency passes
    })
  })
})
