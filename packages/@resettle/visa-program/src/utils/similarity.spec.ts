/*
import type { Monetary } from '@resettle/schema'
import assert from 'node:assert'
import { beforeEach, describe, it, mock } from 'node:test'

import {
  getBooleanSimilarity,
  getDateSimilarity,
  getMonetarySimilarity,
  getPercentageSimilarity,
} from './similarity'

// Mock the currency module
const mocked = mock.module('./currency', {
  namedExports: {
    convertCurrency: mock.fn(),
  },
})

import type { ExchangeRateData } from '@resettle/schema/global'
import { convertCurrency } from './currency'

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

describe('getMonetarySimilarity', () => {
  const date = new Date('2023-01-01')
  const mockExchangeRates: ExchangeRateData[] = [
    {
      currency_code: 'USD',
      rate_to_usd: 1,
      created_at: date,
    },
    {
      currency_code: 'EUR',
      rate_to_usd: 0.85,
      created_at: date,
    },
    {
      currency_code: 'GBP',
      rate_to_usd: 0.75,
      created_at: date,
    },
  ]

  beforeEach(() => {
    mocked.restore()
  })

  it('should compare monetary values in same currency', () => {
    const expected: Monetary = { amount: 1000, currency: 'USD' }
    const actual: Monetary = { amount: 1200, currency: 'USD' }

    vi.mocked(convertCurrency)
      .mockReturnValueOnce(1000) // expected amount in USD
      .mockReturnValueOnce(1200) // actual amount in USD

    const result = getMonetarySimilarity(expected, actual, mockExchangeRates)

    assert.equal(result, 1) // 1200 >= 1000, so similarity is 1
    assert
      .equal(convertCurrency)
      .toHaveBeenCalledWith(mockExchangeRates, 1000, 'USD', 'USD')
    assert
      .equal(convertCurrency)
      .toHaveBeenCalledWith(mockExchangeRates, 1200, 'USD', 'USD')
  })

  it('should compare monetary values in different currencies', () => {
    const expected: Monetary = { amount: 1000, currency: 'USD' }
    const actual: Monetary = { amount: 850, currency: 'EUR' }

    vi.mocked(convertCurrency)
      .mockReturnValueOnce(1000) // expected amount in USD
      .mockReturnValueOnce(1000) // actual amount converted to USD

    const result = getMonetarySimilarity(expected, actual, mockExchangeRates)

    assert.equal(result, 1) // 1000 >= 1000, so similarity is 1
    assert
      .equal(convertCurrency)
      .toHaveBeenCalledWith(mockExchangeRates, 1000, 'USD', 'USD')
    assert
      .equal(convertCurrency)
      .toHaveBeenCalledWith(mockExchangeRates, 850, 'EUR', 'USD')
  })

  it('should return ratio when actual is less than expected', () => {
    const expected: Monetary = { amount: 1000, currency: 'USD' }
    const actual: Monetary = { amount: 500, currency: 'USD' }

    vi.mocked(convertCurrency)
      .mockReturnValueOnce(1000) // expected amount in USD
      .mockReturnValueOnce(500) // actual amount in USD

    const result = getMonetarySimilarity(expected, actual, mockExchangeRates)

    assert.equal(result, 0.5) // 500 / 1000 = 0.5
  })

  it('should return 0 when currency conversion fails', () => {
    const expected: Monetary = { amount: 1000, currency: 'USD' }
    const actual: Monetary = { amount: 500, currency: 'JPY' }

    vi.mocked(convertCurrency).mockImplementation(() => {
      throw new Error('Currency not supported')
    })

    const result = getMonetarySimilarity(expected, actual, mockExchangeRates)

    assert.equal(result, 0)
  })

  it('should handle zero amounts', () => {
    const expected: Monetary = { amount: 0, currency: 'USD' }
    const actual: Monetary = { amount: 100, currency: 'USD' }

    vi.mocked(convertCurrency)
      .mockReturnValueOnce(0) // expected amount in USD
      .mockReturnValueOnce(100) // actual amount in USD

    const result = getMonetarySimilarity(expected, actual, mockExchangeRates)

    assert.equal(result, 1) // 100 >= 0, so similarity is 1
  })

  it('should handle negative amounts', () => {
    const expected: Monetary = { amount: -1000, currency: 'USD' }
    const actual: Monetary = { amount: -500, currency: 'USD' }

    vi.mocked(convertCurrency)
      .mockReturnValueOnce(-1000) // expected amount in USD
      .mockReturnValueOnce(-500) // actual amount in USD

    const result = getMonetarySimilarity(expected, actual, mockExchangeRates)

    assert.equal(result, 1) // actual amount is greater than expected amount
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
*/
