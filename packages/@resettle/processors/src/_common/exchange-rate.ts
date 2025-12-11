import type { CurrencyCode } from '@resettle/schema'

export type ExchangeRates = {
  success: boolean
  timestamp: number
  base: CurrencyCode
  date: string
  rates: Partial<Record<CurrencyCode, number>>
}

export const downloadExchangeRates = async (apiKey: string) => {
  const response = await fetch(
    'https://api.apilayer.com/exchangerates_data/latest?base=USD',
    {
      headers: {
        apikey: apiKey,
      },
    },
  )

  const content = await response.json()

  return content as ExchangeRates
}
