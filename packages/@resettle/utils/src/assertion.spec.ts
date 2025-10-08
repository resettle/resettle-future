import assert from 'node:assert'
import { describe, it } from 'node:test'

import { assert as assertUtil } from './assertion'

describe('assert', () => {
  it('should throw an error if the condition is false', () => {
    assert.throws(() => assertUtil(false), {
      message: 'Wrong assertion encountered',
    })
  })

  it('should not throw an error if the condition is true', () => {
    assert.doesNotThrow(() => assertUtil(true))
  })
})
