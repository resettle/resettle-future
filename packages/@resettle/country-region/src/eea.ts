import type { CountryAlpha2Code } from '@resettle/schema'

export const EEA_COUNTRY_ALPHA_2_CODES: CountryAlpha2Code[] = [
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
  'IS',
  'LI',
  'NO',
]

export const isEEACountry = (countryCode: CountryAlpha2Code): boolean => {
  return EEA_COUNTRY_ALPHA_2_CODES.includes(countryCode)
}
