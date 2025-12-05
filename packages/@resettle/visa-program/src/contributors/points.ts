import type { Context } from '../types'

export type PointsContributor = {
  kind: 'points'
  op: '+' | '-' | '*' | '/'
  value: number
}

export const applyPointsContributor = (
  context: Context,
  contributor: PointsContributor,
) => {
  context.stateInputOverrides.points ??= 0

  switch (contributor.op) {
    case '+':
      context.stateInputOverrides.points += contributor.value
      break
    case '-':
      context.stateInputOverrides.points -= contributor.value
      break
    case '*':
      context.stateInputOverrides.points *= contributor.value
      break
    case '/':
      context.stateInputOverrides.points /= contributor.value
      break
  }
}
