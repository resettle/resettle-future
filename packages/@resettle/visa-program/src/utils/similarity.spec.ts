import assert from 'node:assert'
import { describe, it } from 'node:test'

import {
  getBooleanSimilarity,
  getDateSimilarity,
  getPercentageSimilarity,
} from './similarity'

describe('getBooleanSimilarity', () => {
  it('should return 1 for true condition', () => {
    assert.equal(getBooleanSimilarity(true), 1)
  })

  it('should return 0 for false condition', () => {
    assert.equal(getBooleanSimilarity(false), 0)
  })
})

describe('getPercentageSimilarity', () => {
  describe('with >= operator (default)', () => {
    it('should return 1 when actual >= expected', () => {
      assert.equal(getPercentageSimilarity(50, 75), 1)
      assert.equal(getPercentageSimilarity(50, 50), 1)
    })

    it('should return ratio when actual < expected', () => {
      assert.equal(getPercentageSimilarity(100, 50), 0.5)
      assert.equal(getPercentageSimilarity(80, 40), 0.5)
    })

    it('should handle edge cases', () => {
      assert.equal(getPercentageSimilarity(0, 100), 1)
      assert.equal(getPercentageSimilarity(100, 0), 0)
    })
  })

  describe('with <= operator', () => {
    it('should return 1 when actual <= expected', () => {
      assert.equal(getPercentageSimilarity(75, 50, '<='), 1)
      assert.equal(getPercentageSimilarity(50, 50, '<='), 1)
    })

    it('should return ratio when actual > expected', () => {
      assert.equal(getPercentageSimilarity(50, 100, '<='), 0.5)
      assert.equal(getPercentageSimilarity(40, 80, '<='), 0.5)
    })

    it('should handle edge cases', () => {
      assert.equal(getPercentageSimilarity(100, 0, '<='), 1)
      assert.equal(getPercentageSimilarity(0, 100, '<='), 0)
    })
  })

  describe('with == operator', () => {
    it('should return 0 for exact match', () => {
      assert.equal(getPercentageSimilarity(50, 50, '=='), 0)
    })

    it('should return relative difference', () => {
      assert.equal(getPercentageSimilarity(100, 50, '=='), 0.5)
      assert.equal(getPercentageSimilarity(50, 100, '=='), 1)
    })

    it('should handle edge cases', () => {
      assert.equal(getPercentageSimilarity(0, 100, '=='), Infinity)
      assert.equal(getPercentageSimilarity(100, 0, '=='), 1)
    })
  })
})

describe('getDateSimilarity', () => {
  const date1 = new Date('2023-01-01')
  const date2 = new Date('2023-06-01')
  const date3 = new Date('2023-12-01')

  describe('with > operator', () => {
    it('should return 1 when actual > expected', () => {
      assert.equal(getDateSimilarity(date1, date2, '>'), 1)
      assert.equal(getDateSimilarity(date2, date3, '>'), 1)
    })

    it('should return 0 when actual <= expected', () => {
      assert.equal(getDateSimilarity(date2, date1, '>'), 0)
      assert.equal(getDateSimilarity(date1, date1, '>'), 0)
    })
  })

  describe('with < operator', () => {
    it('should return 1 when actual < expected', () => {
      assert.equal(getDateSimilarity(date2, date1, '<'), 1)
      assert.equal(getDateSimilarity(date3, date2, '<'), 1)
    })

    it('should return 0 when actual >= expected', () => {
      assert.equal(getDateSimilarity(date1, date2, '<'), 0)
      assert.equal(getDateSimilarity(date1, date1, '<'), 0)
    })
  })

  it('should handle same dates', () => {
    const sameDate = new Date('2023-01-01')
    assert.equal(getDateSimilarity(date1, sameDate, '>'), 0)
    assert.equal(getDateSimilarity(date1, sameDate, '<'), 0)
  })

  it('should handle edge case dates', () => {
    const veryOldDate = new Date('1900-01-01')
    const veryNewDate = new Date('2100-01-01')

    assert.equal(getDateSimilarity(veryOldDate, veryNewDate, '>'), 1)
    assert.equal(getDateSimilarity(veryNewDate, veryOldDate, '<'), 1)
  })
})
