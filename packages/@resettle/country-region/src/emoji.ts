import type { CountryAlpha2Code } from '@resettle/schema'

/**
 * Get the emoji for a country flag
 * @param countryCode - The country code
 * @returns The emoji for the country flag
 */
export const getCountryFlagEmoji = (countryCode: CountryAlpha2Code): string => {
  const codePoints = countryCode
    .split('')
    .map(char => 127397 + char.charCodeAt(0))

  return String.fromCodePoint(...codePoints)
}

export const getCountryCodeFromCountryFlagEmoji = (
  emoji: string,
): CountryAlpha2Code => {
  const codePoints = Array.from(emoji, c => c.codePointAt(0)!)
  const base = 0x1f1e6 // Unicode regional indicator 'A'
  return codePoints
    .map(cp => String.fromCharCode(cp - base + 65))
    .join('') as CountryAlpha2Code
}
