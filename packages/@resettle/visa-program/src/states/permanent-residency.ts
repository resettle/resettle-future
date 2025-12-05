import type { CountryAlpha2Code } from '@resettle/schema'

import { getBooleanSimilarity } from '../utils/similarity'

export const DEFAULT_PERMANENT_RESIDENCY_SIMILARITY = 0.2

export type PermanentResidencyStateInput = {
  permanent_residency?: CountryAlpha2Code[]
}

export type PermanentResidencyState = {
  kind: 'permanent_residency'
  op: 'in' | 'not_in' | 'former_in'
  expected: CountryAlpha2Code[]
}

export type PermanentResidencyStateOutput = {
  kind: 'permanent_residency'
  op: 'in' | 'not_in' | 'former_in'
  expected: CountryAlpha2Code[]
  actual?: CountryAlpha2Code[]
  similarity: number
}

export const getPermanentResidencyStateOutput = (
  state: PermanentResidencyState,
  { permanent_residency }: PermanentResidencyStateInput,
): PermanentResidencyStateOutput => {
  switch (state.op) {
    case 'in':
    case 'former_in':
      return {
        kind: state.kind,
        op: state.op,
        expected: state.expected,
        actual: permanent_residency,
        similarity: permanent_residency
          ? getBooleanSimilarity(
              state.expected.some(country =>
                permanent_residency.includes(country),
              ),
            )
          : DEFAULT_PERMANENT_RESIDENCY_SIMILARITY,
      }
    case 'not_in':
      return {
        kind: state.kind,
        op: state.op,
        expected: state.expected,
        actual: permanent_residency,
        similarity: permanent_residency
          ? getBooleanSimilarity(
              !state.expected.some(country =>
                permanent_residency.includes(country),
              ),
            )
          : DEFAULT_PERMANENT_RESIDENCY_SIMILARITY,
      }
  }
}
