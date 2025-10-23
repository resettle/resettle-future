import type { CountryAlpha2Code } from '@resettle/schema'

export const SCHENGEN_COUNTRY_ALPHA_2_CODES: CountryAlpha2Code[] = [
  'AT',
  'BE',
  'BG',
  'HR',
  'CZ',
  'DK',
  'EE',
  'FI',
  'FR',
  'DE',
  'GR',
  'HU',
  'IS',
  'IT',
  'LV',
  'LI',
  'LT',
  'LU',
  'MT',
  'NL',
  'NO',
  'PL',
  'PT',
  'RO',
  'SK',
  'SI',
  'ES',
  'SE',
  'CH',
]

/**
 * Check if a country is in the Schengen Area
 * @param countryCode - The country code
 * @returns True if the country is in the Schengen Area, false otherwise
 */
export const isSchengenCountry = (countryCode: CountryAlpha2Code): boolean => {
  return SCHENGEN_COUNTRY_ALPHA_2_CODES.includes(countryCode)
}
