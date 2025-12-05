import { getBooleanSimilarity } from '../utils/similarity'

export const DEFAULT_AGE_SIMILARITY = 0.2

export type AgeStateInput = {
  age?: number
}

export type AgeState =
  | {
      kind: 'age'
      op: '>=' | '<='
      expected: number
    }
  | {
      kind: 'age'
      op: 'between'
      expected: {
        min: number
        max: number
      }
    }

export type AgeStateOutput =
  | {
      kind: 'age'
      op: '>=' | '<='
      expected: number
      actual?: number
      similarity: number
    }
  | {
      kind: 'age'
      op: 'between'
      expected: {
        min: number
        max: number
      }
      actual?: number
      similarity: number
    }

export const getAgeStateOutput = (
  state: AgeState,
  { age }: AgeStateInput,
): AgeStateOutput => {
  switch (state.op) {
    case '<=':
      return {
        kind: state.kind,
        op: state.op,
        expected: state.expected,
        actual: age,
        similarity: age
          ? getBooleanSimilarity(age <= state.expected)
          : DEFAULT_AGE_SIMILARITY,
      }
    case '>=':
      return {
        kind: state.kind,
        op: state.op,
        expected: state.expected,
        actual: age,
        similarity: age
          ? getBooleanSimilarity(age >= state.expected)
          : DEFAULT_AGE_SIMILARITY,
      }
    case 'between':
      return {
        kind: state.kind,
        op: state.op,
        expected: state.expected,
        actual: age,
        similarity: age
          ? getBooleanSimilarity(
              age >= state.expected.min && age <= state.expected.max,
            )
          : DEFAULT_AGE_SIMILARITY,
      }
  }
}
