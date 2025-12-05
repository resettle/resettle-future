import type { Monetary } from '@resettle/schema'
import type { ExchangeRateData } from '@resettle/schema/global'

import { convertCurrency } from './currency'

/**
 * Get the similarity of a boolean condition
 * @param condition - The condition to check
 * @returns The similarity of the condition
 */
export const getBooleanSimilarity = (condition: boolean) => {
  return condition ? 1 : 0
}

/**
 * Get the similarity of a percentage condition
 * @param expected - The expected value
 * @param actual - The actual value
 * @param op - The operator to use
 * @returns The similarity of the percentage condition
 */
export const getPercentageSimilarity = (
  expected: number,
  actual: number,
  op: '>=' | '<=' | '==' = '>=',
) => {
  switch (op) {
    case '>=':
      return actual >= expected ? 1 : actual / expected
    case '<=':
      return actual <= expected ? 1 : expected / actual
    case '==':
      return Math.abs(actual - expected) / expected
  }
}

/**
 * Get the similarity of a monetary condition
 * @param expected - The expected value
 * @param actual - The actual value
 * @param exchangeRates - The exchange rates data
 * @returns The similarity of the monetary condition
 */
export const getMonetarySimilarity = (
  expected: Monetary,
  actual: Monetary,
  exchangeRates: ExchangeRateData[],
) => {
  try {
    // Convert both amounts to the base currency for comparison
    const expectedAmount = convertCurrency(
      exchangeRates,
      expected.amount,
      expected.currency,
      'USD',
    )

    const actualAmount = convertCurrency(
      exchangeRates,
      actual.amount,
      actual.currency,
      'USD',
    )

    return getPercentageSimilarity(expectedAmount, actualAmount, '>=')
  } catch {
    // Return 0 if the exchange rate is not available
    // Usually indicates that the currency is not widely supported
    return 0
  }
}

/**
 * Get the similarity of a date condition
 * @param expected - The expected value
 * @param actual - The actual value
 * @param op - The operator to use
 * @returns The similarity of the date condition
 */
export const getDateSimilarity = (
  expected: Date,
  actual: Date,
  op: '>' | '<',
) => {
  switch (op) {
    case '>':
      if (actual > expected) {
        return 1
      } else {
        return 0
      }
    case '<':
      if (actual < expected) {
        return 1
      } else {
        return 0
      }
  }
}

/**
 * Get the similarity of a set condition
 * @param expected - The expected value
 * @param actual - The actual value
 * @param op - The operator to use
 * @returns The similarity of the set condition
 */
export const getSetSimilarity = (
  expected: number[],
  actual: number[],
  op: '>' | '<>',
) => {
  switch (op) {
    case '<>': {
      const expectedMap = new Map<number, number>()
      const actualMap = new Map<number, number>()

      for (const n of expected) {
        expectedMap.set(n, (expectedMap.get(n) || 0) + 1)
      }

      for (const n of actual) {
        actualMap.set(n, (actualMap.get(n) || 0) + 1)
      }

      let intersection = 0
      let union = 0

      const allKeys = new Set([...expectedMap.keys(), ...actualMap.keys()])

      for (const key of allKeys) {
        const aCount = expectedMap.get(key) || 0
        const bCount = actualMap.get(key) || 0

        intersection += Math.min(aCount, bCount)
        union += Math.max(aCount, bCount)
      }

      return union === 0 ? 1 : intersection / union
    }
    case '>': {
      let count = 0

      for (const e of expected) {
        if (!actual.includes(e)) {
          count++
        }
      }

      return getPercentageSimilarity(expected.length, count, '==')
    }
  }
}
