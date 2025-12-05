import { type CurrencyCode } from '@resettle/schema'
import type { ExchangeRateData } from '@resettle/schema/global'
import { round2 } from '@resettle/utils'

/**
 * Convert an amount from one currency to another
 * @param exchangeRates - The exchange rates data
 * @param amount - The amount to convert
 * @param from - The currency to convert from
 * @param to - The currency to convert to
 */
export const convertCurrency = (
  exchangeRates: ExchangeRateData[],
  amount: number,
  from: CurrencyCode,
  to: CurrencyCode,
) => {
  const fromRate = exchangeRates.find(r => r.currency_code === from)
  const toRate = exchangeRates.find(r => r.currency_code === to)
  if (!fromRate) {
    throw new Error(`Currency ${from} is not supported`)
  }

  if (!toRate) {
    throw new Error(`Currency ${to} is not supported`)
  }

  return round2((amount / fromRate.rate_to_usd) * toRate.rate_to_usd)
}
