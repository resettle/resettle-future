import assert from 'node:assert'
import { describe, it } from 'node:test'

import { round2, round3 } from './number'

describe('number', () => {
  describe('round2', () => {
    it('should round to 2 decimal places', () => {
      assert.strictEqual(round2(1.234), 1.23)
    })

    it('should round up when third decimal is 5 or greater', () => {
      assert.strictEqual(round2(1.235), 1.24)
      assert.strictEqual(round2(1.236), 1.24)
    })

    it('should round down when third decimal is less than 5', () => {
      assert.strictEqual(round2(1.234), 1.23)
      assert.strictEqual(round2(1.231), 1.23)
    })

    it('should handle negative numbers', () => {
      assert.strictEqual(round2(-1.234), -1.23)
      assert.strictEqual(round2(-1.235), -1.24)
    })

    it('should handle numbers with exactly 2 decimal places', () => {
      assert.strictEqual(round2(1.23), 1.23)
    })

    it('should handle whole numbers', () => {
      assert.strictEqual(round2(5), 5)
    })

    it('should handle numbers with 1 decimal place', () => {
      assert.strictEqual(round2(1.2), 1.2)
    })
  })

  describe('round3', () => {
    it('should round to 3 decimal places', () => {
      assert.strictEqual(round3(1.2345), 1.235)
    })

    it('should round up when fourth decimal is 5 or greater', () => {
      assert.strictEqual(round3(1.2345), 1.235)
      assert.strictEqual(round3(1.2346), 1.235)
    })

    it('should round down when fourth decimal is less than 5', () => {
      assert.strictEqual(round3(1.2344), 1.234)
      assert.strictEqual(round3(1.2341), 1.234)
    })

    it('should handle negative numbers', () => {
      assert.strictEqual(round3(-1.2345), -1.235)
      assert.strictEqual(round3(-1.2344), -1.234)
    })

    it('should handle numbers with exactly 3 decimal places', () => {
      assert.strictEqual(round3(1.234), 1.234)
    })

    it('should handle whole numbers', () => {
      assert.strictEqual(round3(5), 5)
    })

    it('should handle numbers with fewer than 3 decimal places', () => {
      assert.strictEqual(round3(1.2), 1.2)
      assert.strictEqual(round3(1.23), 1.23)
    })
  })
})
