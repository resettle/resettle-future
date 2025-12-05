import { getBooleanSimilarity } from '../../utils/similarity'

export const DEFAULT_ISRAEL_SIMILARITY = 0.2

export type IsraelStateInput = {
  bagrut_english_3_passed?: boolean
}

export type IsraelState = {
  kind: 'israel'
  op: 'bagrut_english_3_passed'
  expected: boolean
}

export type IsraelStateOutput = {
  kind: 'israel'
  op: 'bagrut_english_3_passed'
  expected: boolean
  actual?: boolean
  similarity: number
}

export const getIsraelStateOutput = (
  state: IsraelState,
  { bagrut_english_3_passed }: IsraelStateInput,
): IsraelStateOutput => {
  return {
    kind: state.kind,
    op: state.op,
    expected: state.expected,
    actual: bagrut_english_3_passed,
    similarity: bagrut_english_3_passed
      ? getBooleanSimilarity(bagrut_english_3_passed === state.expected)
      : DEFAULT_ISRAEL_SIMILARITY,
  }
}
