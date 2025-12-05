import type { Monetary } from '@resettle/schema'

import type { Context } from '../types'
import { getMonetarySimilarity } from '../utils/similarity'

export const DEFAULT_FUNDING_SIMILARITY = 0.2

export type FundingStateInput = {
  funding?: Monetary
}

export type FundingState = {
  kind: 'funding'
  op: '>='
  expected: Monetary
}

export type FundingStateOutput = {
  kind: 'funding'
  op: '>='
  expected: Monetary
  actual?: Monetary
  similarity: number
}

export const getFundingStateOutput = (
  context: Context,
  state: FundingState,
  { funding }: FundingStateInput,
): FundingStateOutput => {
  switch (state.op) {
    case '>=':
      return {
        kind: state.kind,
        op: state.op,
        expected: state.expected,
        actual: funding,
        similarity: funding
          ? getMonetarySimilarity(
              state.expected,
              funding,
              context.exchangeRatesData,
            )
          : DEFAULT_FUNDING_SIMILARITY,
      }
  }
}
