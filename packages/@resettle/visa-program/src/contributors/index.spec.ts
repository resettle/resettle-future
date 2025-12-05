/*
import assert from 'node:assert'
import { beforeEach, describe, it, mock } from 'node:test'

import { getStateOutput } from '../states'
import type { Context, StateInputOverrides } from '../types'
import type { Contributor, OrContributor } from './index'
import { applyContributor } from './index'
import { applyPointsContributor } from './points'

// Mock the dependencies
mock.module('../states', {
  namedExports: {
    getStateOutput: mock.fn(),
  },
})

mock.module('./points', {
  namedExports: {
    applyPointsContributor: mock.fn(),
  },
})

const mockGetStateOutput = vi.mocked(getStateOutput)
const mockApplyPointsContributor = vi.mocked(applyPointsContributor)

describe('contributors', () => {
  const createMockContext = (
    overrides: Partial<StateInputOverrides> = {},
  ): Context => ({
    exchangeRatesData: {
      base: 'USD' as const,
      date: new Date(),
      rates: {},
    },
    institutionRankingsData: [],
    fortuneGlobal500Data: [],
    occupationClassificationCrosswalksData: {} as any,
    occupationClassificationsData: {} as any,
    noc2021Teer2025Data: [],
    getRefValue: vi.fn(),
    stateInputOverrides: {
      points: 0,
      ...overrides,
    },
  })

  const mockStateInput = {
    points: 50,
  }

  const mockPointsState = {
    kind: 'points' as const,
    op: '>=' as const,
    expected: 60,
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('applyContributor', () => {
    describe('with individual contributor', () => {
      it('should apply points contributor when similarity threshold is met', () => {
        const contributor: Contributor = {
          kind: 'points',
          op: '+',
          value: 10,
          expected_state: mockPointsState,
          expected_state_similarity: 0.8,
        }

        const mockStateOutput = {
          kind: 'points' as const,
          op: '>=' as const,
          expected: 60,
          actual: 50,
          similarity: 0.9,
        }

        mockGetStateOutput.mockReturnValue(mockStateOutput)

        const context = createMockContext()
        const result = applyContributor(context, contributor, mockStateInput)

        expect(mockGetStateOutput).toHaveBeenCalledWith(
          context,
          mockPointsState,
          mockStateInput,
        )
        expect(mockApplyPointsContributor).toHaveBeenCalledWith(
          context,
          contributor,
        )
        expect(result).toEqual({
          kind: 'points',
          op: '+',
          value: 10,
          expected_state: mockStateOutput,
          expected_state_similarity: 0.9,
          is_applied: true,
        })
      })

      it('should not apply points contributor when similarity threshold is not met', () => {
        const contributor: Contributor = {
          kind: 'points',
          op: '+',
          value: 10,
          expected_state: mockPointsState,
          expected_state_similarity: 0.8,
        }

        const mockStateOutput = {
          kind: 'points' as const,
          op: '>=' as const,
          expected: 60,
          actual: 50,
          similarity: 0.7,
        }

        mockGetStateOutput.mockReturnValue(mockStateOutput)

        const context = createMockContext()
        const result = applyContributor(context, contributor, mockStateInput)

        expect(mockGetStateOutput).toHaveBeenCalledWith(
          context,
          mockPointsState,
          mockStateInput,
        )
        expect(mockApplyPointsContributor).not.toHaveBeenCalled()
        expect(result).toEqual({
          kind: 'points',
          op: '+',
          value: 10,
          expected_state: mockStateOutput,
          expected_state_similarity: 0.7,
          is_applied: false,
        })
      })

      it('should use default similarity threshold of 1 when not specified', () => {
        const contributor: Contributor = {
          kind: 'points',
          op: '+',
          value: 10,
          expected_state: mockPointsState,
        }

        const mockStateOutput = {
          kind: 'points' as const,
          op: '>=' as const,
          expected: 60,
          actual: 50,
          similarity: 0.9,
        }

        mockGetStateOutput.mockReturnValue(mockStateOutput)

        const context = createMockContext()
        const result = applyContributor(context, contributor, mockStateInput)

        expect(mockApplyPointsContributor).not.toHaveBeenCalled()

        assert(result.kind === 'points')
        expect(result.is_applied).toBe(false)
      })

      it('should apply when similarity equals threshold', () => {
        const contributor: Contributor = {
          kind: 'points',
          op: '+',
          value: 10,
          expected_state: mockPointsState,
          expected_state_similarity: 0.8,
        }

        const mockStateOutput = {
          kind: 'points' as const,
          op: '>=' as const,
          expected: 60,
          actual: 50,
          similarity: 0.8,
        }

        mockGetStateOutput.mockReturnValue(mockStateOutput)

        const context = createMockContext()
        const result = applyContributor(context, contributor, mockStateInput)

        expect(mockApplyPointsContributor).toHaveBeenCalledWith(
          context,
          contributor,
        )

        assert(result.kind === 'points')
        expect(result.is_applied).toBe(true)
      })
    })

    describe('with OrContributor', () => {
      it('should apply first matching child and not apply subsequent matches', () => {
        const orContributor: OrContributor = {
          kind: 'or',
          children: [
            {
              kind: 'points',
              op: '+',
              value: 5,
              expected_state: mockPointsState,
              expected_state_similarity: 0.8,
            },
            {
              kind: 'points',
              op: '+',
              value: 10,
              expected_state: mockPointsState,
              expected_state_similarity: 0.7,
            },
          ],
        }

        const mockStateOutput1 = {
          kind: 'points' as const,
          op: '>=' as const,
          expected: 60,
          actual: 50,
          similarity: 0.9,
        }

        const mockStateOutput2 = {
          kind: 'points' as const,
          op: '>=' as const,
          expected: 60,
          actual: 50,
          similarity: 0.8,
        }

        mockGetStateOutput
          .mockReturnValueOnce(mockStateOutput1)
          .mockReturnValueOnce(mockStateOutput2)

        const context = createMockContext()
        const result = applyContributor(context, orContributor, mockStateInput)

        expect(mockGetStateOutput).toHaveBeenCalledTimes(2)
        expect(mockApplyPointsContributor).toHaveBeenCalledTimes(1)
        expect(mockApplyPointsContributor).toHaveBeenCalledWith(
          context,
          orContributor.children[0],
        )

        expect(result).toEqual({
          kind: 'or',
          children: [
            {
              kind: 'points',
              op: '+',
              value: 5,
              expected_state: mockStateOutput1,
              expected_state_similarity: 0.9,
              is_applied: true,
            },
            {
              kind: 'points',
              op: '+',
              value: 10,
              expected_state: mockStateOutput2,
              expected_state_similarity: 0.8,
              is_applied: false,
            },
          ],
          applied_child_index: 0,
        })
      })

      it('should not apply any child when none meet threshold', () => {
        const orContributor: OrContributor = {
          kind: 'or',
          children: [
            {
              kind: 'points',
              op: '+',
              value: 5,
              expected_state: mockPointsState,
              expected_state_similarity: 0.8,
            },
          ],
        }

        const mockStateOutput = {
          kind: 'points' as const,
          op: '>=' as const,
          expected: 60,
          actual: 50,
          similarity: 0.6,
        }

        mockGetStateOutput.mockReturnValue(mockStateOutput)

        const context = createMockContext()
        const result = applyContributor(context, orContributor, mockStateInput)

        expect(mockApplyPointsContributor).not.toHaveBeenCalled()

        assert(result.kind === 'or')
        expect(result.applied_child_index).toBeUndefined()
        expect(result.children[0].is_applied).toBe(false)
      })

      it('should handle empty children array', () => {
        const orContributor: OrContributor = {
          kind: 'or',
          children: [],
        }

        const context = createMockContext()
        const result = applyContributor(context, orContributor, mockStateInput)

        expect(mockGetStateOutput).not.toHaveBeenCalled()
        expect(mockApplyPointsContributor).not.toHaveBeenCalled()

        expect(result).toEqual({
          kind: 'or',
          children: [],
          applied_child_index: undefined,
        })
      })
    })

    describe('with different operations', () => {
      it('should handle subtraction operation', () => {
        const contributor: Contributor = {
          kind: 'points',
          op: '-',
          value: 15,
          expected_state: mockPointsState,
          expected_state_similarity: 0.8,
        }

        const mockStateOutput = {
          kind: 'points' as const,
          op: '>=' as const,
          expected: 60,
          actual: 50,
          similarity: 0.9,
        }

        mockGetStateOutput.mockReturnValue(mockStateOutput)

        const context = createMockContext()
        const result = applyContributor(context, contributor, mockStateInput)

        expect(mockApplyPointsContributor).toHaveBeenCalledWith(
          context,
          contributor,
        )

        assert(result.kind === 'points')
        expect(result.is_applied).toBe(true)
        expect(result.op).toBe('-')
        expect(result.value).toBe(15)
      })

      it('should handle multiplication operation', () => {
        const contributor: Contributor = {
          kind: 'points',
          op: '*',
          value: 2,
          expected_state: mockPointsState,
          expected_state_similarity: 0.8,
        }

        const mockStateOutput = {
          kind: 'points' as const,
          op: '>=' as const,
          expected: 60,
          actual: 50,
          similarity: 0.9,
        }

        mockGetStateOutput.mockReturnValue(mockStateOutput)

        const context = createMockContext()
        const result = applyContributor(context, contributor, mockStateInput)

        expect(mockApplyPointsContributor).toHaveBeenCalledWith(
          context,
          contributor,
        )

        assert(result.kind === 'points')
        expect(result.is_applied).toBe(true)
        expect(result.op).toBe('*')
        expect(result.value).toBe(2)
      })

      it('should handle division operation', () => {
        const contributor: Contributor = {
          kind: 'points',
          op: '/',
          value: 3,
          expected_state: mockPointsState,
          expected_state_similarity: 0.8,
        }

        const mockStateOutput = {
          kind: 'points' as const,
          op: '>=' as const,
          expected: 60,
          actual: 50,
          similarity: 0.9,
        }

        mockGetStateOutput.mockReturnValue(mockStateOutput)

        const context = createMockContext()
        const result = applyContributor(context, contributor, mockStateInput)

        expect(mockApplyPointsContributor).toHaveBeenCalledWith(
          context,
          contributor,
        )

        assert(result.kind === 'points')
        assert.ok(result.is_applied)
        assert.equal(result.op, '/')
        assert.equal(result.value, 3)
      })
    })
  })
})
*/
