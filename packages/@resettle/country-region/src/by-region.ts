import {
  COUNTRY_ALPHA_2_CODE_OPTIONS,
  type CountryAlpha2Code,
  type CountryAlpha3Code,
  type RegionScope,
} from '@resettle/schema'

import { convertAlpha2ToAlpha3, convertAlpha3ToAlpha2 } from './alpha2-alpha3'

export const CENTRAL_AFRICA_COUNTRY_ALPHA_3_CODES: CountryAlpha3Code[] = [
  'AGO',
  'CMR',
  'CAF',
  'TCD',
  'COG',
  'COD',
  'GNQ',
  'GAB',
  'STP',
]

/**
 * Checks if a country is in the Central Africa region
 * @param countryCode - The country code to check
 * @returns True if the country is in the Central Africa region, false otherwise
 */
export const isCentralAfricaCountry = (countryCode: CountryAlpha2Code) => {
  return CENTRAL_AFRICA_COUNTRY_ALPHA_3_CODES.includes(
    convertAlpha2ToAlpha3(countryCode),
  )
}

export const EASTERN_AFRICA_COUNTRY_ALPHA_3_CODES: CountryAlpha3Code[] = [
  'BDI',
  'COM',
  'DJI',
  'ERI',
  'ETH',
  'KEN',
  'MDG',
  'MWI',
  'MUS',
  'MYT',
  'MOZ',
  'RWA',
  'SYC',
  'SOM',
  'SSD',
  'TZA',
  'UGA',
  'ZMB',
  'ZWE',
]

/**
 * Checks if a country is in the Eastern Africa region
 * @param countryCode - The country code to check
 * @returns True if the country is in the Eastern Africa region, false otherwise
 */
export const isEasternAfricaCountry = (countryCode: CountryAlpha2Code) => {
  return EASTERN_AFRICA_COUNTRY_ALPHA_3_CODES.includes(
    convertAlpha2ToAlpha3(countryCode),
  )
}

export const NORTHERN_AFRICA_COUNTRY_ALPHA_3_CODES: CountryAlpha3Code[] = [
  'DZA',
  'EGY',
  'LBY',
  'MAR',
  'SDN',
  'TUN',
]

/**
 * Checks if a country is in the Northern Africa region
 * @param countryCode - The country code to check
 * @returns True if the country is in the Northern Africa region, false otherwise
 */
export const isNorthernAfricaCountry = (countryCode: CountryAlpha2Code) => {
  return NORTHERN_AFRICA_COUNTRY_ALPHA_3_CODES.includes(
    convertAlpha2ToAlpha3(countryCode),
  )
}

export const SOUTHERN_AFRICA_COUNTRY_ALPHA_3_CODES: CountryAlpha3Code[] = [
  'BWA',
  'SWZ',
  'LSO',
  'NAM',
  'ZAF',
]

/**
 * Checks if a country is in the Southern Africa region
 * @param countryCode - The country code to check
 * @returns True if the country is in the Southern Africa region, false otherwise
 */
export const isSouthernAfricaCountry = (countryCode: CountryAlpha2Code) => {
  return SOUTHERN_AFRICA_COUNTRY_ALPHA_3_CODES.includes(
    convertAlpha2ToAlpha3(countryCode),
  )
}

export const WESTERN_AFRICA_COUNTRY_ALPHA_3_CODES: CountryAlpha3Code[] = [
  'BEN',
  'BFA',
  'CPV',
  'GMB',
  'GHA',
  'GIN',
  'GNB',
  'CIV',
  'LBR',
  'MLI',
  'MRT',
  'NER',
  'NGA',
  'SEN',
  'SLE',
  'TGO',
]

/**
 * Checks if a country is in the Western Africa region
 * @param countryCode - The country code to check
 * @returns True if the country is in the Western Africa region, false otherwise
 */
export const isWesternAfricaCountry = (countryCode: CountryAlpha2Code) => {
  return WESTERN_AFRICA_COUNTRY_ALPHA_3_CODES.includes(
    convertAlpha2ToAlpha3(countryCode),
  )
}

export const AFRICA_COUNTRY_ALPHA_3_CODES: CountryAlpha3Code[] = [
  ...NORTHERN_AFRICA_COUNTRY_ALPHA_3_CODES,
  ...EASTERN_AFRICA_COUNTRY_ALPHA_3_CODES,
  ...CENTRAL_AFRICA_COUNTRY_ALPHA_3_CODES,
  ...SOUTHERN_AFRICA_COUNTRY_ALPHA_3_CODES,
  ...WESTERN_AFRICA_COUNTRY_ALPHA_3_CODES,
]

/**
 * Checks if a country is in the Africa region
 * @param countryCode - The country code to check
 * @returns True if the country is in the Africa region, false otherwise
 */
export const isAfricaCountry = (countryCode: CountryAlpha2Code) => {
  return AFRICA_COUNTRY_ALPHA_3_CODES.includes(
    convertAlpha2ToAlpha3(countryCode),
  )
}

export const CENTRAL_ASIA_COUNTRY_ALPHA_3_CODES: CountryAlpha3Code[] = [
  'KGZ',
  'KAZ',
  'TJK',
  'TKM',
  'UZB',
]

/**
 * Checks if a country is in the Central Asia region
 * @param countryCode - The country code to check
 * @returns True if the country is in the Central Asia region, false otherwise
 */
export const isCentralAsiaCountry = (countryCode: CountryAlpha2Code) => {
  return CENTRAL_ASIA_COUNTRY_ALPHA_3_CODES.includes(
    convertAlpha2ToAlpha3(countryCode),
  )
}

export const EASTERN_ASIA_COUNTRY_ALPHA_3_CODES: CountryAlpha3Code[] = [
  'CHN',
  'JPN',
  'MNG',
  'PRK',
  'KOR',
  'TWN',
]

/**
 * Checks if a country is in the Eastern Asia region
 * @param countryCode - The country code to check
 * @returns True if the country is in the Eastern Asia region, false otherwise
 */
export const isEasternAsiaCountry = (countryCode: CountryAlpha2Code) => {
  return EASTERN_ASIA_COUNTRY_ALPHA_3_CODES.includes(
    convertAlpha2ToAlpha3(countryCode),
  )
}

export const SOUTHEAST_ASIA_COUNTRY_ALPHA_3_CODES: CountryAlpha3Code[] = [
  'BRN',
  'IDN',
  'KHM',
  'LAO',
  'MMR',
  'MYS',
  'PHL',
  'SGP',
  'THA',
  'TLS',
  'VNM',
]

/**
 * Checks if a country is in the Southeast Asia region
 * @param countryCode - The country code to check
 * @returns True if the country is in the Southeast Asia region, false otherwise
 */
export const isSoutheastAsiaCountry = (countryCode: CountryAlpha2Code) => {
  return SOUTHEAST_ASIA_COUNTRY_ALPHA_3_CODES.includes(
    convertAlpha2ToAlpha3(countryCode),
  )
}

export const SOUTHERN_ASIA_COUNTRY_ALPHA_3_CODES: CountryAlpha3Code[] = [
  'AFG',
  'BGD',
  'BTN',
  'IND',
  'IOT',
  'LKA',
  'MDV',
  'NPL',
  'PAK',
]

/**
 * Checks if a country is in the Southern Asia region
 * @param countryCode - The country code to check
 * @returns True if the country is in the Southern Asia region, false otherwise
 */
export const isSouthernAsiaCountry = (countryCode: CountryAlpha2Code) => {
  return SOUTHERN_ASIA_COUNTRY_ALPHA_3_CODES.includes(
    convertAlpha2ToAlpha3(countryCode),
  )
}

export const WESTERN_ASIA_COUNTRY_ALPHA_3_CODES: CountryAlpha3Code[] = [
  'ARE',
  'ARM',
  'AZE',
  'BHR',
  'CYP',
  'GEO',
  'IRL',
  'IRQ',
  'IRN',
  'JOR',
  'KWT',
  'LBN',
  'OMN',
  'PSE',
  'QAT',
  'SAU',
  'SYR',
  'TUR',
  'YEM',
]

/**
 * Checks if a country is in the Western Asia region
 * @param countryCode - The country code to check
 * @returns True if the country is in the Western Asia region, false otherwise
 */
export const isWesternAsiaCountry = (countryCode: CountryAlpha2Code) => {
  return WESTERN_ASIA_COUNTRY_ALPHA_3_CODES.includes(
    convertAlpha2ToAlpha3(countryCode),
  )
}

export const ASIA_COUNTRY_ALPHA_3_CODES: CountryAlpha3Code[] = [
  ...CENTRAL_ASIA_COUNTRY_ALPHA_3_CODES,
  ...EASTERN_ASIA_COUNTRY_ALPHA_3_CODES,
  ...SOUTHEAST_ASIA_COUNTRY_ALPHA_3_CODES,
  ...SOUTHERN_ASIA_COUNTRY_ALPHA_3_CODES,
  ...WESTERN_ASIA_COUNTRY_ALPHA_3_CODES,
]

/**
 * Checks if a country is in the Asia region
 * @param countryCode - The country code to check
 * @returns True if the country is in the Asia region, false otherwise
 */
export const isAsiaCountry = (countryCode: CountryAlpha2Code) => {
  return ASIA_COUNTRY_ALPHA_3_CODES.includes(convertAlpha2ToAlpha3(countryCode))
}

export const CENTRAL_EUROPE_COUNTRY_ALPHA_3_CODES: CountryAlpha3Code[] = [
  'AUT',
  'HRV',
  'CZE',
  'DEU',
  'HUN',
  'LIE',
  'POL',
  'SVK',
  'SVN',
  'CHE',
]

/**
 * Checks if a country is in the Central Europe region
 * @param countryCode - The country code to check
 * @returns True if the country is in the Central Europe region, false otherwise
 */
export const isCentralEuropeCountry = (countryCode: CountryAlpha2Code) => {
  return CENTRAL_EUROPE_COUNTRY_ALPHA_3_CODES.includes(
    convertAlpha2ToAlpha3(countryCode),
  )
}

export const EASTERN_EUROPE_COUNTRY_ALPHA_3_CODES: CountryAlpha3Code[] = [
  'RUS',
  'EST',
  'LVA',
  'LTU',
  'BLR',
  'UKR',
]

/**
 * Checks if a country is in the Eastern Europe region
 * @param countryCode - The country code to check
 * @returns True if the country is in the Eastern Europe region, false otherwise
 */
export const isEasternEuropeCountry = (countryCode: CountryAlpha2Code) => {
  return EASTERN_EUROPE_COUNTRY_ALPHA_3_CODES.includes(
    convertAlpha2ToAlpha3(countryCode),
  )
}

export const NORTHERN_EUROPE_COUNTRY_ALPHA_3_CODES: CountryAlpha3Code[] = [
  'DNK',
  'FIN',
  'ISL',
  'NOR',
  'SWE',
]

/**
 * Checks if a country is in the Northern Europe region
 * @param countryCode - The country code to check
 * @returns True if the country is in the Northern Europe region, false otherwise
 */
export const isNorthernEuropeCountry = (countryCode: CountryAlpha2Code) => {
  return NORTHERN_EUROPE_COUNTRY_ALPHA_3_CODES.includes(
    convertAlpha2ToAlpha3(countryCode),
  )
}

export const SOUTHERN_EUROPE_COUNTRY_ALPHA_3_CODES: CountryAlpha3Code[] = [
  'ALB',
  'AND',
  'BIH',
  'BGR',
  'GRC',
  'ITA',
  'XKX',
  'MLT',
  'MNE',
  'MKD',
  'PRT',
  'SMR',
  'SRB',
  'ROU',
  'ESP',
  'VAT',
]

/**
 * Checks if a country is in the Southern Europe region
 * @param countryCode - The country code to check
 * @returns True if the country is in the Southern Europe region, false otherwise
 */
export const isSouthernEuropeCountry = (countryCode: CountryAlpha2Code) => {
  return SOUTHERN_EUROPE_COUNTRY_ALPHA_3_CODES.includes(
    convertAlpha2ToAlpha3(countryCode),
  )
}

export const WESTERN_EUROPE_COUNTRY_ALPHA_3_CODES: CountryAlpha3Code[] = [
  'BEL',
  'FRA',
  'IRL',
  'LUX',
  'MCO',
  'NLD',
  'GBR',
]

/**
 * Checks if a country is in the Western Europe region
 * @param countryCode - The country code to check
 * @returns True if the country is in the Western Europe region, false otherwise
 */
export const isWesternEuropeCountry = (countryCode: CountryAlpha2Code) => {
  return WESTERN_EUROPE_COUNTRY_ALPHA_3_CODES.includes(
    convertAlpha2ToAlpha3(countryCode),
  )
}

export const EUROPE_COUNTRY_ALPHA_3_CODES: CountryAlpha3Code[] = [
  ...CENTRAL_EUROPE_COUNTRY_ALPHA_3_CODES,
  ...EASTERN_EUROPE_COUNTRY_ALPHA_3_CODES,
  ...NORTHERN_EUROPE_COUNTRY_ALPHA_3_CODES,
  ...SOUTHERN_EUROPE_COUNTRY_ALPHA_3_CODES,
  ...WESTERN_EUROPE_COUNTRY_ALPHA_3_CODES,
]

/**
 * Checks if a country is in the Europe region
 * @param countryCode - The country code to check
 * @returns True if the country is in the Europe region, false otherwise
 */
export const isEuropeCountry = (countryCode: CountryAlpha2Code) => {
  return EUROPE_COUNTRY_ALPHA_3_CODES.includes(
    convertAlpha2ToAlpha3(countryCode),
  )
}

export const CARIBBEAN_COUNTRY_ALPHA_3_CODES: CountryAlpha3Code[] = [
  'ATG',
  'BHS',
  'BRB',
  'CUB',
  'DMA',
  'DOM',
  'GRD',
  'HTI',
  'JAM',
  'KNA',
  'LCA',
  'VCT',
  'TTO',
]

/**
 * Checks if a country is in the Caribbean region
 * @param countryCode - The country code to check
 * @returns True if the country is in the Caribbean region, false otherwise
 */
export const isCaribbeanCountry = (countryCode: CountryAlpha2Code) => {
  return CARIBBEAN_COUNTRY_ALPHA_3_CODES.includes(
    convertAlpha2ToAlpha3(countryCode),
  )
}

export const CENTRAL_AMERICA_COUNTRY_ALPHA_3_CODES: CountryAlpha3Code[] = [
  'MEX',
  'BLZ',
  'CRI',
  'SLV',
  'GTM',
  'HND',
  'NIC',
  'PAN',
]

/**
 * Checks if a country is in the Central America region
 * @param countryCode - The country code to check
 * @returns True if the country is in the Central America region, false otherwise
 */
export const isCentralAmericaCountry = (countryCode: CountryAlpha2Code) => {
  return CENTRAL_AMERICA_COUNTRY_ALPHA_3_CODES.includes(
    convertAlpha2ToAlpha3(countryCode),
  )
}

export const NORTHERN_AMERICA_COUNTRY_ALPHA_3_CODES: CountryAlpha3Code[] = [
  'CAN',
  'USA',
]

/**
 * Checks if a country is in the Northern America region
 * @param countryCode - The country code to check
 * @returns True if the country is in the Northern America region, false otherwise
 */
export const isNorthernAmericaCountry = (countryCode: CountryAlpha2Code) => {
  return NORTHERN_AMERICA_COUNTRY_ALPHA_3_CODES.includes(
    convertAlpha2ToAlpha3(countryCode),
  )
}

export const NORTH_AMERICA_COUNTRY_ALPHA_3_CODES: CountryAlpha3Code[] = [
  ...CARIBBEAN_COUNTRY_ALPHA_3_CODES,
  ...CENTRAL_AMERICA_COUNTRY_ALPHA_3_CODES,
  ...NORTHERN_AMERICA_COUNTRY_ALPHA_3_CODES,
]

/**
 * Checks if a country is in the North America region
 * @param countryCode - The country code to check
 * @returns True if the country is in the North America region, false otherwise
 */
export const isNorthAmericaCountry = (countryCode: CountryAlpha2Code) => {
  return NORTH_AMERICA_COUNTRY_ALPHA_3_CODES.includes(
    convertAlpha2ToAlpha3(countryCode),
  )
}

export const OCEANIA_COUNTRY_ALPHA_3_CODES: CountryAlpha3Code[] = [
  'AUS',
  'FJI',
  'KIR',
  'MHL',
  'FSM',
  'NRU',
  'NZL',
  'PLW',
  'PNG',
  'WSM',
  'SLB',
  'TON',
  'TUV',
  'VUT',
]

/**
 * Checks if a country is in the Oceania region
 * @param countryCode - The country code to check
 * @returns True if the country is in the Oceania region, false otherwise
 */
export const isOceaniaCountry = (countryCode: CountryAlpha2Code) => {
  return OCEANIA_COUNTRY_ALPHA_3_CODES.includes(
    convertAlpha2ToAlpha3(countryCode),
  )
}

export const SOUTH_AMERICA_COUNTRY_ALPHA_3_CODES: CountryAlpha3Code[] = [
  'ARG',
  'BOL',
  'BRA',
  'CHL',
  'COL',
  'ECU',
  'GUY',
  'PRY',
  'PER',
  'SUR',
  'URY',
  'VEN',
]

/**
 * Checks if a country is in the South America region
 * @param countryCode - The country code to check
 * @returns True if the country is in the South America region, false otherwise
 */
export const isSouthAmericaCountry = (countryCode: CountryAlpha2Code) => {
  return SOUTH_AMERICA_COUNTRY_ALPHA_3_CODES.includes(
    convertAlpha2ToAlpha3(countryCode),
  )
}

/**
 * Checks if a country is in a specific region
 * @param countryCode - The country code to check
 * @param scope - The region to check
 * @returns True if the country is in the region, false otherwise
 */
export const isScopedCountry = (
  countryCode: CountryAlpha2Code,
  scope: RegionScope,
) => {
  switch (scope) {
    case 'africa':
      return isAfricaCountry(countryCode)
    case 'antarctica':
      return false
    case 'asia':
      return isAsiaCountry(countryCode)
    case 'caribbean':
      return isCaribbeanCountry(countryCode)
    case 'central-africa':
      return isCentralAfricaCountry(countryCode)
    case 'central-america':
      return isCentralAmericaCountry(countryCode)
    case 'central-asia':
      return isCentralAsiaCountry(countryCode)
    case 'central-europe':
      return isCentralEuropeCountry(countryCode)
    case 'eastern-africa':
      return isEasternAfricaCountry(countryCode)
    case 'eastern-asia':
      return isEasternAsiaCountry(countryCode)
    case 'eastern-europe':
      return isEasternEuropeCountry(countryCode)
    case 'europe':
      return isEuropeCountry(countryCode)
    case 'global':
      return true
    case 'north-america':
      return isNorthAmericaCountry(countryCode)
    case 'northern-africa':
      return isNorthernAfricaCountry(countryCode)
    case 'northern-america':
      return isNorthernAmericaCountry(countryCode)
    case 'northern-europe':
      return isNorthernEuropeCountry(countryCode)
    case 'oceania':
      return isOceaniaCountry(countryCode)
    case 'south-america':
      return isSouthAmericaCountry(countryCode)
    case 'southeast-asia':
      return isSoutheastAsiaCountry(countryCode)
    case 'southern-africa':
      return isSouthernAfricaCountry(countryCode)
    case 'southern-asia':
      return isSouthernAsiaCountry(countryCode)
    case 'southern-europe':
      return isSouthernEuropeCountry(countryCode)
    case 'western-africa':
      return isWesternAfricaCountry(countryCode)
    case 'western-asia':
      return isWesternAsiaCountry(countryCode)
    case 'western-europe':
      return isWesternEuropeCountry(countryCode)
    default:
      return false
  }
}

/**
 * Gets the countries in a specific region
 * @param scope - The region to get the countries for
 * @returns The countries in the region
 */
export const getCountriesByRegionScope = (
  scope: RegionScope,
): CountryAlpha2Code[] => {
  switch (scope) {
    case 'africa':
      return AFRICA_COUNTRY_ALPHA_3_CODES.map(c => convertAlpha3ToAlpha2(c))
    case 'antarctica':
      return []
    case 'asia':
      return ASIA_COUNTRY_ALPHA_3_CODES.map(c => convertAlpha3ToAlpha2(c))
    case 'caribbean':
      return CARIBBEAN_COUNTRY_ALPHA_3_CODES.map(c => convertAlpha3ToAlpha2(c))
    case 'central-africa':
      return CENTRAL_AFRICA_COUNTRY_ALPHA_3_CODES.map(c =>
        convertAlpha3ToAlpha2(c),
      )
    case 'central-america':
      return CENTRAL_AMERICA_COUNTRY_ALPHA_3_CODES.map(c =>
        convertAlpha3ToAlpha2(c),
      )
    case 'central-asia':
      return CENTRAL_ASIA_COUNTRY_ALPHA_3_CODES.map(c =>
        convertAlpha3ToAlpha2(c),
      )
    case 'central-europe':
      return CENTRAL_EUROPE_COUNTRY_ALPHA_3_CODES.map(c =>
        convertAlpha3ToAlpha2(c),
      )
    case 'eastern-africa':
      return EASTERN_AFRICA_COUNTRY_ALPHA_3_CODES.map(c =>
        convertAlpha3ToAlpha2(c),
      )
    case 'eastern-asia':
      return EASTERN_ASIA_COUNTRY_ALPHA_3_CODES.map(c =>
        convertAlpha3ToAlpha2(c),
      )
    case 'eastern-europe':
      return EASTERN_EUROPE_COUNTRY_ALPHA_3_CODES.map(c =>
        convertAlpha3ToAlpha2(c),
      )
    case 'europe':
      return EUROPE_COUNTRY_ALPHA_3_CODES.map(c => convertAlpha3ToAlpha2(c))
    case 'global':
      return [...COUNTRY_ALPHA_2_CODE_OPTIONS]
    case 'north-america':
      return NORTH_AMERICA_COUNTRY_ALPHA_3_CODES.map(c =>
        convertAlpha3ToAlpha2(c),
      )
    case 'northern-africa':
      return NORTHERN_AFRICA_COUNTRY_ALPHA_3_CODES.map(c =>
        convertAlpha3ToAlpha2(c),
      )
    case 'northern-america':
      return NORTHERN_AMERICA_COUNTRY_ALPHA_3_CODES.map(c =>
        convertAlpha3ToAlpha2(c),
      )
    case 'northern-europe':
      return NORTHERN_EUROPE_COUNTRY_ALPHA_3_CODES.map(c =>
        convertAlpha3ToAlpha2(c),
      )
    case 'oceania':
      return OCEANIA_COUNTRY_ALPHA_3_CODES.map(c => convertAlpha3ToAlpha2(c))
    case 'south-america':
      return SOUTH_AMERICA_COUNTRY_ALPHA_3_CODES.map(c =>
        convertAlpha3ToAlpha2(c),
      )
    case 'southeast-asia':
      return SOUTHEAST_ASIA_COUNTRY_ALPHA_3_CODES.map(c =>
        convertAlpha3ToAlpha2(c),
      )
    case 'southern-africa':
      return SOUTHERN_AFRICA_COUNTRY_ALPHA_3_CODES.map(c =>
        convertAlpha3ToAlpha2(c),
      )
    case 'southern-asia':
      return SOUTHERN_ASIA_COUNTRY_ALPHA_3_CODES.map(c =>
        convertAlpha3ToAlpha2(c),
      )
    case 'southern-europe':
      return SOUTHERN_EUROPE_COUNTRY_ALPHA_3_CODES.map(c =>
        convertAlpha3ToAlpha2(c),
      )
    case 'western-africa':
      return WESTERN_AFRICA_COUNTRY_ALPHA_3_CODES.map(c =>
        convertAlpha3ToAlpha2(c),
      )
    case 'western-asia':
      return WESTERN_ASIA_COUNTRY_ALPHA_3_CODES.map(c =>
        convertAlpha3ToAlpha2(c),
      )
    case 'western-europe':
      return WESTERN_EUROPE_COUNTRY_ALPHA_3_CODES.map(c =>
        convertAlpha3ToAlpha2(c),
      )
    default:
      return []
  }
}

/**
 * Checks if a region is a sub scope of another region
 * @param a - The region to check
 * @param b - The region to check against
 * @returns True if the region is a sub scope of the other region, false otherwise
 */
export const isSubScopeOf = (a: RegionScope, b: RegionScope) => {
  if (b === 'global') {
    return a !== 'global'
  }

  if (b === 'africa') {
    return (
      a === 'central-africa' ||
      a === 'eastern-africa' ||
      a === 'western-africa' ||
      a === 'northern-africa' ||
      a === 'southern-africa'
    )
  }

  if (b === 'asia') {
    return (
      a === 'central-asia' ||
      a === 'eastern-asia' ||
      a === 'western-asia' ||
      a === 'southern-asia' ||
      a === 'southeast-asia'
    )
  }

  if (b === 'europe') {
    return (
      a === 'central-europe' ||
      a === 'western-europe' ||
      a === 'eastern-europe' ||
      a === 'northern-europe' ||
      a === 'southern-europe'
    )
  }

  if (b === 'north-america') {
    return (
      a === 'northern-america' || a === 'caribbean' || a === 'central-america'
    )
  }

  return false
}
