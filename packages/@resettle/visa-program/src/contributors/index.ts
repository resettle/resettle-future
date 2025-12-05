import {
  getStateOutput,
  type State,
  type StateInput,
  type StateOutput,
} from '../states'
import type { Context } from '../types'
import { applyPointsContributor, type PointsContributor } from './points'

type ContributorUnion = PointsContributor

type ContributorChildUnion = ContributorUnion & {
  expected_state: State
  expected_state_similarity?: number
}

type ContributorChildOutputUnion = ContributorUnion & {
  is_applied: boolean
  expected_state: StateOutput
  expected_state_similarity: number
}

export type OrContributor = {
  kind: 'or'
  children: ContributorChildUnion[]
}

export type OrContributorOutput = {
  kind: 'or'
  children: ContributorChildOutputUnion[]
  applied_child_index?: number
}

export type Contributor = ContributorChildUnion | OrContributor

export type ContributorOutput =
  | ContributorChildOutputUnion
  | OrContributorOutput

const applyContributorByKind = (
  context: Context,
  contributor: ContributorChildUnion,
): void => {
  switch (contributor.kind) {
    case 'points':
      applyPointsContributor(context, contributor)
      break
  }
}

export const applyContributor = (
  context: Context,
  contributor: Contributor,
  stateInput: StateInput,
): ContributorOutput => {
  if (contributor.kind === 'or') {
    const childrenOutput: ContributorChildOutputUnion[] = []

    let appliedChildIndex: number | undefined = undefined

    for (let i = 0; i < contributor.children.length; i++) {
      const child = contributor.children[i]
      const expectedStateSimilarity = child.expected_state_similarity || 1

      const actualStateOutput = getStateOutput(
        context,
        child.expected_state,
        stateInput,
      )

      if (
        actualStateOutput.similarity >= expectedStateSimilarity &&
        appliedChildIndex === undefined
      ) {
        // Apply the first matching child
        applyContributorByKind(context, child)

        childrenOutput.push({
          kind: child.kind,
          op: child.op,
          value: child.value,
          expected_state: actualStateOutput,
          expected_state_similarity: actualStateOutput.similarity,
          is_applied: true,
        })

        appliedChildIndex = i
      } else {
        childrenOutput.push({
          kind: child.kind,
          op: child.op,
          value: child.value,
          expected_state: actualStateOutput,
          expected_state_similarity: actualStateOutput.similarity,
          is_applied: false,
        })
      }
    }

    return {
      kind: 'or',
      children: childrenOutput,
      applied_child_index: appliedChildIndex,
    }
  }

  const expectedStateSimilarity = contributor.expected_state_similarity || 1

  const actualStateOutput = getStateOutput(
    context,
    contributor.expected_state,
    stateInput,
  )

  if (actualStateOutput.similarity < expectedStateSimilarity) {
    return {
      kind: contributor.kind,
      op: contributor.op,
      value: contributor.value,
      expected_state: actualStateOutput,
      expected_state_similarity: actualStateOutput.similarity,
      is_applied: false,
    }
  }

  applyContributorByKind(context, contributor)

  return {
    kind: contributor.kind,
    op: contributor.op,
    value: contributor.value,
    expected_state: actualStateOutput,
    expected_state_similarity: actualStateOutput.similarity,
    is_applied: true,
  }
}
