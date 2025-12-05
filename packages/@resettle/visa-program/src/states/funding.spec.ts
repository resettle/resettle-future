import { type Monetary } from '@resettle/schema'
import { round2 } from '@resettle/utils'
import assert from 'node:assert'
import { describe, it } from 'node:test'

import { createMockContext } from '../mock'
import {
  DEFAULT_FUNDING_SIMILARITY,
  getFundingStateOutput,
  type FundingState,
} from './funding'

const mockContext = createMockContext()

describe('funding state', () => {
  describe('getFundingStateOutput', () => {
    describe('>= operation', () => {
      it('should return similarity 1 when funding amount is greater than expected (same currency)', () => {
        const state: FundingState = {
          kind: 'funding',
          op: '>=',
          expected: {
            amount: 50000,
            currency: 'USD',
          } satisfies Monetary,
        }

        const result = getFundingStateOutput(mockContext, state, {
          funding: {
            amount: 75000,
            currency: 'USD',
          } satisfies Monetary,
        })

        assert.deepStrictEqual(result, {
          kind: 'funding',
          op: '>=',
          expected: {
            amount: 50000,
            currency: 'USD',
          },
          actual: {
            amount: 75000,
            currency: 'USD',
          },
          similarity: 1,
        })
      })

      it('should return similarity 1 when funding amount is equal to expected (same currency)', () => {
        const state: FundingState = {
          kind: 'funding',
          op: '>=',
          expected: {
            amount: 50000,
            currency: 'USD',
          } satisfies Monetary,
        }

        const result = getFundingStateOutput(mockContext, state, {
          funding: {
            amount: 50000,
            currency: 'USD',
          } satisfies Monetary,
        })

        assert.deepStrictEqual(result, {
          kind: 'funding',
          op: '>=',
          expected: {
            amount: 50000,
            currency: 'USD',
          },
          actual: {
            amount: 50000,
            currency: 'USD',
          },
          similarity: 1,
        })
      })

      it('should return partial similarity when funding amount is less than expected (same currency)', () => {
        const state: FundingState = {
          kind: 'funding',
          op: '>=',
          expected: {
            amount: 50000,
            currency: 'USD',
          } satisfies Monetary,
        }

        const result = getFundingStateOutput(mockContext, state, {
          funding: {
            amount: 25000,
            currency: 'USD',
          } satisfies Monetary,
        })

        assert.deepStrictEqual(result, {
          kind: 'funding',
          op: '>=',
          expected: {
            amount: 50000,
            currency: 'USD',
          },
          actual: {
            amount: 25000,
            currency: 'USD',
          },
          similarity: 0.5, // 25000 / 50000
        })
      })

      it('should return similarity 1 when funding amount is greater than expected (different currencies)', () => {
        const state: FundingState = {
          kind: 'funding',
          op: '>=',
          expected: {
            amount: 50000,
            currency: 'USD',
          } satisfies Monetary,
        }

        const result = getFundingStateOutput(mockContext, state, {
          funding: {
            amount: 68000, // Higher than 50000 EUR when converted to USD (50000 / 0.8674)
            currency: 'EUR',
          } satisfies Monetary,
        })

        assert.deepStrictEqual(result, {
          kind: 'funding',
          op: '>=',
          expected: {
            amount: 50000,
            currency: 'USD',
          },
          actual: {
            amount: 68000,
            currency: 'EUR',
          },
          similarity: 1,
        })
      })

      it('should return partial similarity when funding amount is less than expected (different currencies)', () => {
        const state: FundingState = {
          kind: 'funding',
          op: '>=',
          expected: {
            amount: 50000,
            currency: 'USD',
          } satisfies Monetary,
        }

        const result = getFundingStateOutput(mockContext, state, {
          funding: {
            amount: 25000, // Less than required when converted
            currency: 'EUR',
          } satisfies Monetary,
        })

        const expectedUSD = 50000 / 1.0 // 50000 USD
        const actualUSD = round2(25000 / 0.8674) // ~28823 USD
        const expectedSimilarity = actualUSD / expectedUSD

        assert.deepStrictEqual(result, {
          kind: 'funding',
          op: '>=',
          expected: {
            amount: 50000,
            currency: 'USD',
          },
          actual: {
            amount: 25000,
            currency: 'EUR',
          },
          similarity: expectedSimilarity,
        })
      })

      it('should return 0 similarity when exchange rate is not available for expected currency', () => {
        const state: FundingState = {
          kind: 'funding',
          op: '>=',
          expected: {
            amount: 50000,
            currency: 'XYZ', // Non-existent currency
          } as unknown as Monetary,
        }

        const result = getFundingStateOutput(mockContext, state, {
          funding: {
            amount: 75000,
            currency: 'USD',
          } satisfies Monetary,
        })

        assert.deepStrictEqual(result, {
          kind: 'funding',
          op: '>=',
          expected: {
            amount: 50000,
            currency: 'XYZ',
          },
          actual: {
            amount: 75000,
            currency: 'USD',
          },
          similarity: 0,
        })
      })

      it('should return 0 similarity when exchange rate is not available for actual currency', () => {
        const state: FundingState = {
          kind: 'funding',
          op: '>=',
          expected: {
            amount: 50000,
            currency: 'USD',
          } satisfies Monetary,
        }

        const result = getFundingStateOutput(mockContext, state, {
          funding: {
            amount: 75000,
            currency: 'XYZ', // Non-existent currency
          } as unknown as Monetary,
        })

        assert.deepStrictEqual(result, {
          kind: 'funding',
          op: '>=',
          expected: {
            amount: 50000,
            currency: 'USD',
          },
          actual: {
            amount: 75000,
            currency: 'XYZ',
          },
          similarity: 0,
        })
      })

      it('should return default similarity when no funding is provided', () => {
        const state: FundingState = {
          kind: 'funding',
          op: '>=',
          expected: {
            amount: 50000,
            currency: 'USD',
          } satisfies Monetary,
        }

        const result = getFundingStateOutput(mockContext, state, {})

        assert.deepStrictEqual(result, {
          kind: 'funding',
          op: '>=',
          expected: {
            amount: 50000,
            currency: 'USD',
          },
          actual: undefined,
          similarity: DEFAULT_FUNDING_SIMILARITY,
        })
      })

      it('should return default similarity when funding is undefined', () => {
        const state: FundingState = {
          kind: 'funding',
          op: '>=',
          expected: {
            amount: 50000,
            currency: 'USD',
          } satisfies Monetary,
        }

        const result = getFundingStateOutput(mockContext, state, {
          funding: undefined,
        })

        assert.deepStrictEqual(result, {
          kind: 'funding',
          op: '>=',
          expected: {
            amount: 50000,
            currency: 'USD',
          },
          actual: undefined,
          similarity: DEFAULT_FUNDING_SIMILARITY,
        })
      })

      it('should handle different currency combinations correctly', () => {
        const state: FundingState = {
          kind: 'funding',
          op: '>=',
          expected: {
            amount: 43434, // ~50000 USD when converted from CAD
            currency: 'CAD',
          } satisfies Monetary,
        }

        const result = getFundingStateOutput(mockContext, state, {
          funding: {
            amount: 37045, // ~50000 USD when converted from GBP
            currency: 'GBP',
          } satisfies Monetary,
        })

        // Both should be approximately 50000 USD, so similarity should be close to 1
        assert.deepStrictEqual(result.kind, 'funding')
        assert.deepStrictEqual(result.op, '>=')
        assert.deepStrictEqual(result.expected, {
          amount: 43434,
          currency: 'CAD',
        })
        assert.deepStrictEqual(result.actual, {
          amount: 37045,
          currency: 'GBP',
        })
        assert.ok(result.similarity < 1)
      })
    })
  })
})
