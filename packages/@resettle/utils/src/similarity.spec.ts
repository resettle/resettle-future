import assert from 'node:assert'
import { describe, it } from 'node:test'

import { cosineSimilarity } from './similarity'

describe('similarity', () => {
  it('throws', () => {
    assert.throws(() => cosineSimilarity([0], [1, 2]), {
      name: 'Error',
      message: 'Arrays must be of same size',
    })
  })

  it('equals 0 if one of them is 0', () => {
    assert.equal(cosineSimilarity([0, 0], [1, 1]), 0)
    assert.equal(cosineSimilarity([1, 1], [0, 0]), 0)
  })

  it('calculates', () => {
    assert.equal(cosineSimilarity([0.5], [0.5]), 1)
    assert.equal(
      cosineSimilarity([0.5, 0.2], [0.2, 0.5]),
      (0.5 * 0.2 + 0.2 * 0.5) /
        (Math.sqrt(0.5 * 0.5 + 0.2 * 0.2) * Math.sqrt(0.2 * 0.2 + 0.5 * 0.5)),
    )
  })
})
