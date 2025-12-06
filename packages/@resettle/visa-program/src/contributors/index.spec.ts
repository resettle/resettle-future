import assert from 'node:assert'
import { describe, it, mock } from 'node:test'

import type { StateOutput } from '../states'
import type { Context, StateInputOverrides } from '../types'
import type { Contributor, OrContributor } from './index'
import { applyContributor } from './index'

describe('contributors', () => {
  const createMockContext = (
    overrides: Partial<StateInputOverrides> = {},
  ): Context => ({
    exchangeRatesData: [],
    institutionRankingsData: [],
    fortuneGlobal500Data: [],
    occupationClassificationCrosswalksData: [],
    occupationClassificationsData: [],
    getRefValue: mock.fn(),
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
        const mockGetStateOutput = mock.fn<() => StateOutput>()
        const mockApplyPointsContributor = mock.fn()

        mockGetStateOutput.mock.mockImplementationOnce(() => mockStateOutput)

        const context = createMockContext()
        const result = applyContributor(
          context,
          contributor,
          mockStateInput,
          mockGetStateOutput,
          { points: mockApplyPointsContributor },
        )
        assert.deepStrictEqual(mockGetStateOutput.mock.calls[0].arguments, [
          context,
          mockPointsState,
          mockStateInput,
        ])
        assert.deepStrictEqual(
          mockApplyPointsContributor.mock.calls[0].arguments,
          [context, contributor],
        )
        assert.deepStrictEqual(result, {
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
        const mockGetStateOutput = mock.fn<() => StateOutput>()
        const mockApplyPointsContributor = mock.fn()

        mockGetStateOutput.mock.mockImplementationOnce(() => mockStateOutput)
        const context = createMockContext()
        const result = applyContributor(
          context,
          contributor,
          mockStateInput,
          mockGetStateOutput,
          { points: mockApplyPointsContributor },
        )

        assert.deepStrictEqual(mockGetStateOutput.mock.calls[0].arguments, [
          context,
          mockPointsState,
          mockStateInput,
        ])
        assert.equal(mockApplyPointsContributor.mock.callCount(), 0)
        assert.deepStrictEqual(result, {
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
        const mockGetStateOutput = mock.fn<() => StateOutput>()
        const mockApplyPointsContributor = mock.fn()

        mockGetStateOutput.mock.mockImplementationOnce(() => mockStateOutput)

        const context = createMockContext()
        const result = applyContributor(
          context,
          contributor,
          mockStateInput,
          mockGetStateOutput,
          { points: mockApplyPointsContributor },
        )

        assert.equal(mockApplyPointsContributor.mock.callCount(), 0)
        assert.ok(result.kind === 'points')
        assert.ok(!result.is_applied)
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
        const mockGetStateOutput = mock.fn<() => StateOutput>()
        const mockApplyPointsContributor = mock.fn()

        mockGetStateOutput.mock.mockImplementationOnce(() => mockStateOutput)

        const context = createMockContext()
        const result = applyContributor(
          context,
          contributor,
          mockStateInput,
          mockGetStateOutput,
          { points: mockApplyPointsContributor },
        )
        assert.deepStrictEqual(
          mockApplyPointsContributor.mock.calls[0].arguments,
          [context, contributor],
        )

        assert.ok(result.kind === 'points')
        assert.ok(result.is_applied)
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
        const mockGetStateOutput = mock.fn<() => StateOutput>(
          () => mockStateOutput1,
        )
        const mockApplyPointsContributor = mock.fn()

        mockGetStateOutput.mock.mockImplementationOnce(
          () => mockStateOutput2,
          1,
        )

        const context = createMockContext()
        const result = applyContributor(
          context,
          orContributor,
          mockStateInput,
          mockGetStateOutput,
          { points: mockApplyPointsContributor },
        )

        assert.equal(mockGetStateOutput.mock.callCount(), 2)
        assert.equal(mockApplyPointsContributor.mock.callCount(), 1)
        assert.deepStrictEqual(
          mockApplyPointsContributor.mock.calls[0].arguments,
          [context, orContributor.children[0]],
        )

        assert.deepStrictEqual(result, {
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
        const mockGetStateOutput = mock.fn<() => StateOutput>()
        const mockApplyPointsContributor = mock.fn()

        mockGetStateOutput.mock.mockImplementationOnce(() => mockStateOutput)

        const context = createMockContext()
        const result = applyContributor(
          context,
          orContributor,
          mockStateInput,
          mockGetStateOutput,
          { points: mockApplyPointsContributor },
        )

        assert.equal(mockApplyPointsContributor.mock.callCount(), 0)

        assert.ok(result.kind === 'or')
        assert.ok(!result.applied_child_index)
        assert.ok(!result.children[0].is_applied)
      })

      it('should handle empty children array', () => {
        const orContributor: OrContributor = {
          kind: 'or',
          children: [],
        }
        const mockGetStateOutput = mock.fn<() => StateOutput>()
        const mockApplyPointsContributor = mock.fn()

        const context = createMockContext()
        const result = applyContributor(
          context,
          orContributor,
          mockStateInput,
          mockGetStateOutput,
          { points: mockApplyPointsContributor },
        )

        assert.equal(mockGetStateOutput.mock.callCount(), 0)
        assert.equal(mockApplyPointsContributor.mock.callCount(), 0)

        assert.deepStrictEqual(result, {
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

        const mockGetStateOutput = mock.fn<() => StateOutput>()
        const mockApplyPointsContributor = mock.fn()

        mockGetStateOutput.mock.mockImplementationOnce(() => mockStateOutput)

        const context = createMockContext()
        const result = applyContributor(
          context,
          contributor,
          mockStateInput,
          mockGetStateOutput,
          { points: mockApplyPointsContributor },
        )

        assert.deepStrictEqual(
          mockApplyPointsContributor.mock.calls[0].arguments,
          [context, contributor],
        )

        assert.ok(result.kind === 'points')
        assert.ok(result.is_applied)
        assert.equal(result.op, '-')
        assert.equal(result.value, 15)
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

        const mockGetStateOutput = mock.fn<() => StateOutput>()
        const mockApplyPointsContributor = mock.fn()

        mockGetStateOutput.mock.mockImplementationOnce(() => mockStateOutput)

        const context = createMockContext()
        const result = applyContributor(
          context,
          contributor,
          mockStateInput,
          mockGetStateOutput,
          { points: mockApplyPointsContributor },
        )

        assert.deepStrictEqual(
          mockApplyPointsContributor.mock.calls[0].arguments,
          [context, contributor],
        )

        assert.ok(result.kind === 'points')
        assert.ok(result.is_applied)
        assert.equal(result.op, '*')
        assert.equal(result.value, 2)
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

        const mockGetStateOutput = mock.fn<() => StateOutput>()
        const mockApplyPointsContributor = mock.fn()

        mockGetStateOutput.mock.mockImplementationOnce(() => mockStateOutput)

        const context = createMockContext()
        const result = applyContributor(
          context,
          contributor,
          mockStateInput,
          mockGetStateOutput,
          { points: mockApplyPointsContributor },
        )

        assert.deepStrictEqual(
          mockApplyPointsContributor.mock.calls[0].arguments,
          [context, contributor],
        )

        assert.ok(result.kind === 'points')
        assert.ok(result.is_applied)
        assert.equal(result.op, '/')
        assert.equal(result.value, 3)
      })
    })
  })
})
