import type { CountryAlpha2Code } from '@resettle/schema'

export const EU_COUNTRY_ALPHA_2_CODES: CountryAlpha2Code[] = [
  'AT',
  'BE',
  'BG',
  'HR',
  'CY',
  'CZ',
  'DK',
  'EE',
  'FI',
  'FR',
  'DE',
  'GR',
  'HU',
  'IE',
  'IT',
  'LV',
  'LT',
  'LU',
  'MT',
  'NL',
  'PL',
  'PT',
  'RO',
  'SK',
  'SI',
  'ES',
  'SE',
]

/**
 * Check if a country is in the EU
 * @param countryCode - The country code
 * @returns True if the country is in the EU, false otherwise
 */
export const isEUCountry = (countryCode: CountryAlpha2Code): boolean => {
  return EU_COUNTRY_ALPHA_2_CODES.includes(countryCode)
}
