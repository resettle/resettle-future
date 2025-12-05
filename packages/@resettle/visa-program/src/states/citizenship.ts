import type { CountryAlpha2Code } from '@resettle/schema'

import { getBooleanSimilarity } from '../utils/similarity'

export const DEFAULT_CITIZENSHIP_SIMILARITY = 0.2

export type CitizenshipStateInput = {
  citizenship?: CountryAlpha2Code[]
}

export type CitizenshipState = {
  kind: 'citizenship'
  op: 'in' | 'not_in' | 'former_in' | 'never_in'
  expected: CountryAlpha2Code[]
}

export type CitizenshipStateOutput = {
  kind: 'citizenship'
  op: 'in' | 'not_in' | 'former_in' | 'never_in'
  expected: CountryAlpha2Code[]
  actual?: CountryAlpha2Code[]
  similarity: number
}

export const getCitizenshipStateOutput = (
  state: CitizenshipState,
  { citizenship }: CitizenshipStateInput,
): CitizenshipStateOutput => {
  switch (state.op) {
    case 'in':
    case 'former_in':
      return {
        kind: state.kind,
        op: state.op,
        expected: state.expected,
        actual: citizenship,
        similarity: citizenship
          ? getBooleanSimilarity(
              state.expected.some(country => citizenship.includes(country)),
            )
          : DEFAULT_CITIZENSHIP_SIMILARITY,
      }
    case 'not_in':
    case 'never_in':
      return {
        kind: state.kind,
        op: state.op,
        expected: state.expected,
        actual: citizenship,
        similarity: citizenship
          ? getBooleanSimilarity(
              !state.expected.some(country => citizenship.includes(country)),
            )
          : DEFAULT_CITIZENSHIP_SIMILARITY,
      }
  }
}
