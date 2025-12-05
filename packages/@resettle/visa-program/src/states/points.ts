import { getPercentageSimilarity } from '../utils/similarity'

export type PointsStateInput = {
  points?: number
}

export type PointsState = {
  kind: 'points'
  op: '>=' | '<='
  expected: number
  max?: number
}

export type PointsStateOutput = {
  kind: 'points'
  op: '>=' | '<='
  expected: number
  actual: number
  max?: number
  similarity: number
}

export const getPointsStateOutput = (
  state: PointsState,
  stateInput: PointsStateInput,
): PointsStateOutput => {
  const actual = stateInput.points || 0

  switch (state.op) {
    case '>=':
      return {
        kind: 'points',
        op: state.op,
        expected: state.expected,
        actual,
        max: state.max,
        similarity: getPercentageSimilarity(state.expected, actual, '>='),
      }
    case '<=':
      return {
        kind: 'points',
        op: state.op,
        expected: state.expected,
        actual,
        max: state.max,
        similarity: getPercentageSimilarity(state.expected, actual, '<='),
      }
  }
}
