import assert from 'node:assert'
import { describe, it } from 'node:test'

import { safeParseInt } from './safe-parsers'

describe('safe-parsers', () => {
  describe('safeParseInt', () => {
    it('should parse an integer', () => {
      assert.strictEqual(safeParseInt('123'), 123)
    })

    it('should parse a bigint', () => {
      assert.strictEqual(safeParseInt(BigInt(123)), 123)
    })

    it('should parse a number', () => {
      assert.strictEqual(safeParseInt(123), 123)
    })
  })
})
