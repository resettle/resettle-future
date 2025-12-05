import type { CountryAlpha2Code } from '@resettle/schema'
import assert from 'node:assert'
import { describe, it } from 'node:test'

import { createMockContext } from './mock'
import { run, type Program } from './runtime'

describe('runtime', () => {
  const mockContext = createMockContext()

  const mockInput = {
    age: 30,
    citizenship: ['US'] satisfies CountryAlpha2Code[],
    permanent_residency: ['CA'] satisfies CountryAlpha2Code[],
    work_experiences: [],
    education_experiences: [],
    points: 0,
  }

  describe('run', () => {
    it('should evaluate a simple program with one clause', () => {
      const program: Program = {
        id: 'test',
        depends_on: ['age'],
        clauses: [
          {
            id: 'check_age',
            kind: 'output',
            state: {
              kind: 'age',
              op: '>=',
              expected: 25,
            },
          },
        ],
      }

      const result = run(program, mockContext, mockInput)

      assert.ok(result.clauses.length === 1)
      assert.deepStrictEqual(result.clauses[0], {
        id: 'check_age',
        kind: 'output',
        state: {
          kind: 'age',
          op: '>=',
          expected: 25,
          actual: 30,
          similarity: 1,
        },
      })
      assert.equal(result.similarity, 1)
    })

    it('should evaluate a program with effects', () => {
      const program: Program = {
        id: 'test',
        depends_on: ['age', 'points'],
        clauses: [
          {
            id: 'add_points_if_age_ok',
            kind: 'eval',
            contributors: [
              {
                kind: 'points',
                op: '+',
                value: 10,
                expected_state: {
                  kind: 'age',
                  op: '>=',
                  expected: 25,
                },
                expected_state_similarity: 0.5,
              },
            ],
          },
          {
            id: 'check_points_after_eval',
            kind: 'output',
            state: {
              kind: 'points',
              op: '>=',
              expected: 10,
            },
          },
        ],
      }

      const result = run(program, mockContext, mockInput)

      assert.ok(result.clauses.length === 2)

      const evalClause = result.clauses[0]
      assert(evalClause.kind === 'eval')
      assert.ok(evalClause.contributors.length === 1)
      const contributor = evalClause.contributors[0]
      if (contributor.kind !== 'or') {
        assert.ok(contributor.is_applied)
      }

      const outputClause = result.clauses[1]
      assert(outputClause.kind === 'output')
      if (outputClause.state.kind === 'points') {
        assert.equal(outputClause.state.actual, 10)
      }
      assert.equal(outputClause.state.similarity, 1)
      assert.equal(result.similarity, 1)
    })

    it('should not trigger effects when similarity is below threshold', () => {
      const program: Program = {
        id: 'test',
        depends_on: ['age', 'points'],
        clauses: [
          {
            id: 'add_points_if_age_high',
            kind: 'eval',
            contributors: [
              {
                kind: 'points',
                op: '+',
                value: 10,
                expected_state: {
                  kind: 'age',
                  op: '>=',
                  expected: 35, // fails for age 30
                },
                expected_state_similarity: 0.5,
              },
            ],
          },
          {
            id: 'check_points_after_eval',
            kind: 'output',
            state: {
              kind: 'points',
              op: '>=',
              expected: 10,
            },
          },
        ],
      }

      const result = run(program, mockContext, mockInput)

      const evalClause = result.clauses[0]
      assert(evalClause.kind === 'eval')
      const contributor = evalClause.contributors[0]
      if (contributor.kind !== 'or') {
        assert.ok(!contributor.is_applied)
      }

      const outputClause = result.clauses[1]
      assert(outputClause.kind === 'output')
      if (outputClause.state.kind === 'points') {
        assert.equal(outputClause.state.actual, 0)
      }
      assert.equal(outputClause.state.similarity, 0)
    })

    it('should calculate weighted similarity correctly', () => {
      const program: Program = {
        id: 'test',
        depends_on: ['age'],
        clauses: [
          {
            id: 'check_age_case_1',
            kind: 'output',
            state: {
              kind: 'age',
              op: '>=',
              expected: 25,
            },
            weight: 2, // This passes with similarity 1
          },
          {
            id: 'check_age_case_2',
            kind: 'output',
            state: {
              kind: 'age',
              op: '>=',
              expected: 35,
            },
            weight: 1, // This fails with similarity 0
          },
        ],
      }

      const result = run(program, mockContext, mockInput)

      assert.equal(result.clauses.length, 2)

      const clause1 = result.clauses[0]
      const clause2 = result.clauses[1]

      assert(clause1.kind === 'output')
      assert(clause2.kind === 'output')

      assert.equal(clause1.state.similarity, 1)
      assert.equal(clause2.state.similarity, 0)
      // Weighted average: (1*2 + 0*1) / (2+1) = 2/3 ≈ 0.667
      assert.equal(result.similarity, 2 / 3)
    })

    it('should handle complex nested states', () => {
      const program: Program = {
        id: 'test',
        depends_on: ['age', 'citizenship', 'points'],
        clauses: [
          {
            id: 'eval_age_and_citizenship',
            kind: 'eval',
            contributors: [
              {
                kind: 'points',
                op: '+',
                value: 2,
                expected_state: {
                  kind: 'and',
                  children: [
                    {
                      kind: 'age',
                      op: '>=',
                      expected: 25,
                    },
                    {
                      kind: 'citizenship',
                      op: 'in',
                      expected: ['US', 'CA'],
                    },
                  ],
                },
                // default expected_state_similarity is 1 (strict)
              },
            ],
          },
          {
            id: 'check_points',
            kind: 'output',
            state: {
              kind: 'points',
              op: '>=',
              expected: 10,
            },
          },
        ],
      }

      const result = run(program, mockContext, mockInput)

      assert.equal(result.clauses.length, 2)

      const evalClause = result.clauses[0]
      assert(evalClause.kind === 'eval')
      const contributor = evalClause.contributors[0]
      if (contributor.kind !== 'or') {
        assert.ok(contributor.is_applied)
      }

      const outputClause = result.clauses[1]
      assert(outputClause.kind === 'output')
      if (outputClause.state.kind === 'points') {
        assert.equal(outputClause.state.actual, 2)
      }
      assert.equal(outputClause.state.similarity, 0.2)
      assert.equal(result.similarity, 0.2)
    })

    it('should handle programs with no clauses', () => {
      const program: Program = {
        id: 'test',
        depends_on: [],
        clauses: [],
      }

      const result = run(program, mockContext, mockInput)

      assert.equal(result.clauses.length, 0)
      assert.equal(result.similarity, 0)
    })

    it('should handle effects with no threshold (default to 1)', () => {
      const program: Program = {
        id: 'test',
        depends_on: ['age', 'points'],
        clauses: [
          {
            id: 'eval_no_threshold',
            kind: 'eval',
            contributors: [
              {
                kind: 'points',
                op: '+',
                value: 5,
                expected_state: {
                  kind: 'age',
                  op: '>=',
                  expected: 35, // fails
                },
                // expected_state_similarity not provided -> defaults to 1
              },
            ],
          },
          {
            id: 'check_points',
            kind: 'output',
            state: {
              kind: 'points',
              op: '>=',
              expected: 5,
            },
          },
        ],
      }

      const result = run(program, mockContext, mockInput)

      const evalClause = result.clauses[0]
      assert(evalClause.kind === 'eval')
      const contributor = evalClause.contributors[0]
      if (contributor.kind !== 'or') {
        assert.ok(!contributor.is_applied)
      }

      const outputClause = result.clauses[1]
      assert(outputClause.kind === 'output')
      if (outputClause.state.kind === 'points') {
        assert.equal(outputClause.state.actual, 0)
      }
      assert.equal(outputClause.state.similarity, 0)
    })
  })
})
