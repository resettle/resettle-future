import type { CurrencyCode } from '@resettle/schema'
import type { ExchangeRateData } from '@resettle/schema/global'
import assert from 'node:assert'
import { describe, it } from 'node:test'

import { convertCurrency } from './currency'

describe('convertCurrency', () => {
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
    {
      currency_code: 'JPY',
      rate_to_usd: 110,
      created_at: date,
    },
    {
      currency_code: 'AUD',
      rate_to_usd: 1.3,
      created_at: date,
    },
    {
      currency_code: 'CAD',
      rate_to_usd: 1.2,
      created_at: date,
    },
  ]

  it('should convert USD to EUR correctly', () => {
    const result = convertCurrency(mockExchangeRates, 100, 'USD', 'EUR')
    assert.equal(result, 85)
  })

  it('should convert EUR to USD correctly', () => {
    const result = convertCurrency(mockExchangeRates, 85, 'EUR', 'USD')
    assert.equal(result, 100)
  })

  it('should convert between non-USD currencies correctly', () => {
    // GBP to EUR: 100 GBP -> USD -> EUR
    // 100 / 0.75 = 133.33 USD
    // 133.33 * 0.85 = 113.33 EUR
    const result = convertCurrency(mockExchangeRates, 100, 'GBP', 'EUR')
    assert.equal(result, 113.33)
  })

  it('should handle same currency conversion', () => {
    const result = convertCurrency(mockExchangeRates, 100, 'USD', 'USD')
    assert.equal(result, 100)
  })

  it('should handle decimal amounts correctly', () => {
    const result = convertCurrency(mockExchangeRates, 123.45, 'USD', 'EUR')
    assert.equal(result, 104.93)
  })

  it('should handle large amounts', () => {
    const result = convertCurrency(mockExchangeRates, 1000000, 'USD', 'JPY')
    assert.equal(result, 110000000)
  })

  it('should handle small amounts', () => {
    const result = convertCurrency(mockExchangeRates, 0.01, 'USD', 'EUR')
    assert.equal(result, 0.01)
  })

  it('should handle zero amount', () => {
    const result = convertCurrency(mockExchangeRates, 0, 'USD', 'EUR')
    assert.equal(result, 0)
  })

  it('should round to 2 decimal places', () => {
    const result = convertCurrency(mockExchangeRates, 100, 'USD', 'GBP')
    assert.equal(result, 75)

    // Test with a value that would have more than 2 decimal places
    const result2 = convertCurrency(mockExchangeRates, 100, 'GBP', 'JPY')
    assert.equal(result2, 14666.67)
  })

  it('should throw error for unsupported from currency', () => {
    assert.throws(
      () => {
        convertCurrency(mockExchangeRates, 100, 'XYZ' as CurrencyCode, 'USD')
      },
      {
        name: 'Error',
        message: 'Currency XYZ is not supported',
      },
    )
  })

  it('should throw error for unsupported to currency', () => {
    assert.throws(
      () => {
        convertCurrency(mockExchangeRates, 100, 'USD', 'XYZ' as CurrencyCode)
      },
      {
        name: 'Error',
        message: 'Currency XYZ is not supported',
      },
    )
  })
})
