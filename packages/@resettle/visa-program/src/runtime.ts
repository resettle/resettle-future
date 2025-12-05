import {
  applyContributor,
  type Contributor,
  type ContributorOutput,
} from './contributors'
import { getRefValue } from './refs'
import type { State, StateInput, StateOutput } from './states'
import { getStateOutput } from './states'
import type { Context, ContextBindings, ContextInput } from './types'

export type OutputClause = {
  id?: string
  kind: 'output'
  state: State
  weight?: number
  decisive?: boolean
}

export type OutputClauseOutput = {
  id?: string
  kind: 'output'
  state: StateOutput
  weight?: number
  decisive?: boolean
}

export type EvalClause = {
  id?: string
  kind: 'eval'
  contributors: Contributor[]
}

export type EvalClauseOutput = {
  id?: string
  kind: 'eval'
  contributors: ContributorOutput[]
}

export type Clause = OutputClause | EvalClause
export type ClauseOutput = OutputClauseOutput | EvalClauseOutput

export type Dependency = keyof StateInput

export type Program = {
  id: string
  depends_on: Dependency[]
  clauses: Clause[]
}

export type ProgramOutput = {
  id: string
  depends_on: Dependency[]
  clauses: ClauseOutput[]
  similarity: number
}

export const run = (
  program: Program,
  contextInput: ContextInput,
  stateInput: StateInput,
): ProgramOutput => {
  const stateInputOverrides: Partial<StateInput> = {}

  const contextBindings: ContextBindings = {
    getRefValue,
    stateInputOverrides,
  }

  const context: Context = {
    ...contextInput,
    ...contextBindings,
  }

  const clauses: ClauseOutput[] = program.clauses.map(clause => {
    switch (clause.kind) {
      case 'output': {
        const stateOutput = getStateOutput(context, clause.state, {
          ...stateInput,
          ...stateInputOverrides,
        })

        return {
          ...clause,
          state: stateOutput,
        }
      }
      case 'eval': {
        const contributorsOutput = clause.contributors.map(contributor =>
          applyContributor(context, contributor, stateInput),
        )

        return {
          ...clause,
          contributors: contributorsOutput,
        }
      }
    }
  })

  const outputClauses = clauses.filter(clause => clause.kind === 'output')

  const totalWeight = outputClauses.reduce(
    (sum, clause) => sum + (clause.weight ?? 1),
    0,
  )

  const weightedSimilaritySum = outputClauses.reduce((sum, clause) => {
    const weight = clause.weight ?? 1

    return sum + clause.state.similarity * weight
  }, 0)

  let similarity = totalWeight > 0 ? weightedSimilaritySum / totalWeight : 0

  const decisiveClauses = outputClauses.filter(
    clause => clause.decisive === true,
  )

  if (decisiveClauses.length > 0) {
    const decisiveSimilarities = decisiveClauses
      .map(clause => clause.state.similarity)
      .filter(sim => sim < 1) // Only consider similarities less than 1

    if (decisiveSimilarities.length > 0) {
      const minDecisiveSimilarity = Math.min(...decisiveSimilarities)

      similarity = Math.min(similarity, minDecisiveSimilarity)
    }
  }

  return {
    id: program.id,
    depends_on: program.depends_on,
    clauses,
    similarity,
  }
}
