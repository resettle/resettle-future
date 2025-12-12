import type { S3Client } from '@aws-sdk/client-s3'
import { convertCountryNameToAlpha2 } from '@resettle/country-region'
import type { IntelligenceDatabase } from '@resettle/database/intelligence'
import type { CountryAlpha2Code, CurrencyCode } from '@resettle/schema'
import type { PlaceFeatureCode } from '@resettle/schema/intelligence'
import { sleepMs } from '@resettle/utils'
import { load } from 'cheerio'
import { HeaderGenerator, PRESETS } from 'header-generator'
import type { Expression, Kysely, SelectQueryBuilder, SqlBool } from 'kysely'
import { join } from 'node:path'
import { z } from 'zod'

import { getCurrentMonth, getStartOfMonth, type RefDir } from '../_common'
import { listFiles, loadFile, refDirToRef, saveFile } from '../node'

const optionalNumber = z.number().optional()

const numbeoCityRestaurantsDataSchema = z.object({
  mealInexpensive: optionalNumber,
  meal2People: optionalNumber,
  mcMeal: optionalNumber,
  domesticBeer: optionalNumber,
  importedBeer: optionalNumber,
  cappuccino: optionalNumber,
  cokePepsi: optionalNumber,
  water: optionalNumber,
})

type NumbeoCityRestaurantsData = z.infer<typeof numbeoCityRestaurantsDataSchema>

const numbeoCityMarketsDataSchema = z.object({
  milk: optionalNumber,
  milk1Liter: optionalNumber,
  loafOfFreshWhiteBread: optionalNumber,
  rice: optionalNumber,
  eggs: optionalNumber,
  localCheese: optionalNumber,
  chickenFillets: optionalNumber,
  beefRound: optionalNumber,
  apples: optionalNumber,
  banana: optionalNumber,
  oranges: optionalNumber,
  tomato: optionalNumber,
  potato: optionalNumber,
  onion: optionalNumber,
  lettuce: optionalNumber,
  water: optionalNumber,
  bottleOfWine: optionalNumber,
  domesticBeer: optionalNumber,
  importedBeer: optionalNumber,
  cigarettes: optionalNumber,
})

type NumbeoCityMarketsData = z.infer<typeof numbeoCityMarketsDataSchema>

const numbeoCityTransportationDataSchema = z.object({
  oneWayTicket: optionalNumber,
  monthlyPass: optionalNumber,
  taxiStart: optionalNumber,
  taxi1Km: optionalNumber,
  taxi1HourWaiting: optionalNumber,
  gasoline: optionalNumber,
  gasoline1Liter: optionalNumber,
  volkswagen: optionalNumber,
  toyota: optionalNumber,
})

type NumbeoCityTransportationData = z.infer<
  typeof numbeoCityTransportationDataSchema
>

const numbeoCityUtilitiesDataSchema = z.object({
  basic: optionalNumber,
  mobile: optionalNumber,
  internet: optionalNumber,
})

type NumbeoCityUtilitiesData = z.infer<typeof numbeoCityUtilitiesDataSchema>

const numbeoCitySportsDataSchema = z.object({
  fitnessClub: optionalNumber,
  tennisCourt: optionalNumber,
  cinema: optionalNumber,
})

type NumbeoCitySportsData = z.infer<typeof numbeoCitySportsDataSchema>

const numbeoCityChildcareDataSchema = z.object({
  preschool: optionalNumber,
  internationalPrimarySchool: optionalNumber,
})

type NumbeoCityChildcareData = z.infer<typeof numbeoCityChildcareDataSchema>

const numbeoCityClothingDataSchema = z.object({
  jeans: optionalNumber,
  summerDress: optionalNumber,
  runningShoes: optionalNumber,
  businessShoes: optionalNumber,
})

type NumbeoCityClothingData = z.infer<typeof numbeoCityClothingDataSchema>

const numbeoCityRentDataSchema = z.object({
  inCityCentre1Bedroom: optionalNumber,
  outsideOfCenter1Bedroom: optionalNumber,
  inCityCentre3Bedrooms: optionalNumber,
  outsideOfCenter3Bedrooms: optionalNumber,
})

type NumbeoCityRentData = z.infer<typeof numbeoCityRentDataSchema>

const numbeoCityBuyApartmentDataSchema = z.object({
  inCityCentre: optionalNumber,
  outsideOfCentre: optionalNumber,
})

type NumbeoCityBuyApartmentData = z.infer<
  typeof numbeoCityBuyApartmentDataSchema
>

const numbeoCitySalaryDataSchema = z.object({
  averageMonthlyNetSalary: optionalNumber,
  mortgageInterestRate: optionalNumber,
})

type NumbeoCitySalaryData = z.infer<typeof numbeoCitySalaryDataSchema>

type CountrySlugRow = {
  code: CountryAlpha2Code
  name: string
  link: string
}

type CitySlugRow = { name: string; link: string }

type CitySlugs = Partial<Record<CountryAlpha2Code, CitySlugRow[]>>

type PostprocessUpdate = {
  type: 'update'
  countryCode: CountryAlpha2Code
  from: string
  to: string
}

type PostprocessDelete = {
  type: 'delete'
  countryCode: CountryAlpha2Code
  city: string
}

export type PostprocessAction = PostprocessDelete | PostprocessUpdate

export type CityData = {
  country: string
  code: CountryAlpha2Code
  city: string
  entries: number
  currency: CurrencyCode
  restaurantsData: NumbeoCityRestaurantsData
  marketsData: NumbeoCityMarketsData
  transportationData: NumbeoCityTransportationData
  utilitiesData: NumbeoCityUtilitiesData
  sportsData: NumbeoCitySportsData
  childcareData: NumbeoCityChildcareData
  clothingData: NumbeoCityClothingData
  rentData: NumbeoCityRentData
  buyApartmentData: NumbeoCityBuyApartmentData
  salaryData: NumbeoCitySalaryData
}

export type PostprocessedCityData = CityData & { originalCity: string }

const restaurantsKeyMapping = {
  'Meal, Inexpensive Restaurant': 'mealInexpensive',
  'Meal at an Inexpensive Restaurant': 'mealInexpensive',
  'Meal for 2 People, Mid-range Restaurant, Three-course': 'meal2People',
  'Meal for Two at a Mid-Range Restaurant (Three Courses, Without Drinks)':
    'meal2People',
  'McMeal at McDonalds (or Equivalent Combo Meal)': 'mcMeal',
  "Combo Meal at McDonald's (or Equivalent Fast-Food Meal)": 'mcMeal',
  'Domestic Beer (1 pint draught)': 'domesticBeer',
  'Domestic Draft Beer (1 Pint)': 'domesticBeer',
  'Imported Beer (12 oz small bottle)': 'importedBeer',
  'Imported Beer (12 oz Small Bottle)': 'importedBeer',
  'Cappuccino (regular)': 'cappuccino',
  'Cappuccino (Regular Size)': 'cappuccino',
  'Coke/Pepsi (12 oz small bottle)': 'cokePepsi',
  'Soft Drink (Coca-Cola or Pepsi, 12 oz Small Bottle)': 'cokePepsi',
  'Water (12 oz small bottle)': 'water',
  'Bottled Water (12 oz)': 'water',
} as const

const marketsKeyMapping = {
  'Milk (regular), (1 gallon)': 'milk',
  'Milk (Regular, 1 Liter)': 'milk1Liter',
  'Loaf of Fresh White Bread (1 lb)': 'loafOfFreshWhiteBread',
  'Fresh White Bread (1 lb Loaf)': 'loafOfFreshWhiteBread',
  'Rice (white), (1 lb)': 'rice',
  'White Rice (1 lb)': 'rice',
  'Eggs (regular) (12)': 'eggs',
  'Eggs (12, Large Size)': 'eggs',
  'Local Cheese (1 lb)': 'localCheese',
  'Chicken Fillets (1 lb)': 'chickenFillets',
  'Beef Round (1 lb) (or Equivalent Back Leg Red Meat)': 'beefRound',
  'Beef Round or Equivalent Back Leg Red Meat (1 lb)': 'beefRound',
  'Apples (1 lb)': 'apples',
  'Banana (1 lb)': 'banana',
  'Bananas (1 lb)': 'banana',
  'Oranges (1 lb)': 'oranges',
  'Tomato (1 lb)': 'tomato',
  'Tomatoes (1 lb)': 'tomato',
  'Potato (1 lb)': 'potato',
  'Potatoes (1 lb)': 'potato',
  'Onion (1 lb)': 'onion',
  'Onions (1 lb)': 'onion',
  'Lettuce (1 head)': 'lettuce',
  'Lettuce (1 Head)': 'lettuce',
  'Water (1.5 liter bottle)': 'water',
  'Bottled Water (50 oz)': 'water',
  'Bottle of Wine (Mid-Range)': 'bottleOfWine',
  'Domestic Beer (0.5 liter bottle)': 'domesticBeer',
  'Domestic Beer (16.9 oz Bottle)': 'domesticBeer',
  'Imported Beer (12 oz small bottle)': 'importedBeer',
  'Imported Beer (12 oz Small Bottle)': 'importedBeer',
  'Cigarettes 20 Pack (Marlboro)': 'cigarettes',
  'Cigarettes (Pack of 20, Marlboro)': 'cigarettes',
} as const

const transportationKeyMapping = {
  'One-way Ticket (Local Transport)': 'oneWayTicket',
  'One-Way Ticket (Local Transport)': 'oneWayTicket',
  'Monthly Pass (Regular Price)': 'monthlyPass',
  'Monthly Public Transport Pass (Regular Price)': 'monthlyPass',
  'Taxi Start (Normal Tariff)': 'taxiStart',
  'Taxi Start (Standard Tariff)': 'taxiStart',
  'Taxi 1 mile (Normal Tariff)': 'taxi1Km',
  'Taxi 1 mile (Standard Tariff)': 'taxi1Km',
  'Taxi 1hour Waiting (Normal Tariff)': 'taxi1HourWaiting',
  'Taxi 1 Hour Waiting (Standard Tariff)': 'taxi1HourWaiting',
  'Gasoline (1 gallon)': 'gasoline',
  'Gasoline (1 Liter)': 'gasoline1Liter',
  'Volkswagen Golf 1.4 90 KW Trendline (Or Equivalent New Car)': 'volkswagen',
  'Volkswagen Golf 1.5 (or Equivalent New Compact Car)': 'volkswagen',
  'Toyota Corolla Sedan 1.6l 97kW Comfort (Or Equivalent New Car)': 'toyota',
  'Toyota Corolla Sedan 1.6 (or Equivalent New Mid-Size Car)': 'toyota',
} as const

const utilitiesKeyMapping = {
  'Basic (Electricity, Heating, Cooling, Water, Garbage) for 915 sq ft Apartment':
    'basic',
  'Basic Utilities for 915 Square Feet Apartment (Electricity, Heating, Cooling, Water, Garbage)':
    'basic',
  'Mobile Phone Monthly Plan with Calls and 10GB+ Data': 'mobile',
  'Mobile Phone Plan (Monthly, with Calls and 10GB+ Data)': 'mobile',
  'Internet (60 Mbps or More, Unlimited Data, Cable/ADSL)': 'internet',
  'Broadband Internet (Unlimited Data, 60 Mbps or Higher)': 'internet',
} as const

const sportsKeyMapping = {
  'Fitness Club, Monthly Fee for 1 Adult': 'fitnessClub',
  'Monthly Fitness Club Membership': 'fitnessClub',
  'Tennis Court Rent (1 Hour on Weekend)': 'tennisCourt',
  'Tennis Court Rental (1 Hour, Weekend)': 'tennisCourt',
  'Cinema, International Release, 1 Seat': 'cinema',
  'Cinema Ticket (International Release)': 'cinema',
} as const

const childcareKeyMapping = {
  'Preschool (or Kindergarten), Full Day, Private, Monthly for 1 Child':
    'preschool',
  'Private Full-Day Preschool or Kindergarten, Monthly Fee per Child':
    'preschool',
  'International Primary School, Yearly for 1 Child':
    'internationalPrimarySchool',
  'International Primary School, Annual Tuition per Child':
    'internationalPrimarySchool',
} as const

const clothingKeyMapping = {
  '1 Pair of Jeans (Levis 501 Or Similar)': 'jeans',
  "Jeans (Levi's 501 or Similar)": 'jeans',
  '1 Summer Dress in a Chain Store (Zara, H&M, ...)': 'summerDress',
  'Summer Dress in a Chain Store (e.g. Zara or H&M)': 'summerDress',
  '1 Pair of Nike Running Shoes (Mid-Range)': 'runningShoes',
  'Nike Running Shoes (Mid-Range)': 'runningShoes',
  '1 Pair of Men Leather Business Shoes': 'businessShoes',
  "Men's Leather Business Shoes": 'businessShoes',
} as const

const rentKeyMapping = {
  'Apartment (1 bedroom) in City Centre': 'inCityCentre1Bedroom',
  '1 Bedroom Apartment in City Centre': 'inCityCentre1Bedroom',
  'Apartment (1 bedroom) Outside of Centre': 'outsideOfCenter1Bedroom',
  '1 Bedroom Apartment Outside of City Centre': 'outsideOfCenter1Bedroom',
  'Apartment (3 bedrooms) in City Centre': 'inCityCentre3Bedrooms',
  '3 Bedroom Apartment in City Centre': 'inCityCentre3Bedrooms',
  'Apartment (3 bedrooms) Outside of Centre': 'outsideOfCenter3Bedrooms',
  '3 Bedroom Apartment Outside of City Centre': 'outsideOfCenter3Bedrooms',
} as const

const buyApartmentKeyMapping = {
  'Price per Square Feet to Buy Apartment in City Centre': 'inCityCentre',
  'Price per Square Feet to Buy Apartment Outside of Centre': 'outsideOfCentre',
} as const

const salaryKeyMapping = {
  'Average Monthly Net Salary (After Tax)': 'averageMonthlyNetSalary',
  'Mortgage Interest Rate in Percentages (%), Yearly, for 20 Years Fixed-Rate':
    'mortgageInterestRate',
  'Annual Mortgage Interest Rate (20-Year Fixed, in %)': 'mortgageInterestRate',
} as const

const parsePrice = (value: string) => {
  return parseFloat(value.split(' ')[0].replace(/[,]/g, ''))
}

const getCountrySlugs = async () => {
  const res = await fetch('https://www.numbeo.com/quality-of-life/')
  const html = await res.text()
  const $ = load(html)
  const results: CountrySlugRow[] = []
  $(
    'body > div:nth-child(3) > div.small_font.links_for_countries > table > tbody > tr > td',
  )
    .find('a')
    .each((_i, e) => {
      const name = $(e).text().trim()
      results.push({
        link: e.attribs.href.split('?')[1],
        name,
        code: convertCountryNameToAlpha2(name)!,
      })
    })

  // We ignore Alderney, it's empty and the country code (GG) collides with Guernsey.
  return results.filter(r => r.name !== 'Alderney')
}

export const downloadCountrySlugs = async (
  ctx: { s3: S3Client },
  ref: RefDir,
) => {
  const key = `numbeo/country-slugs-${getCurrentMonth()}.json`
  const computedRef = refDirToRef(ref, key)
  let content: CountrySlugRow[]
  const result = await loadFile(ctx, computedRef, { stream: false })
  if (!result.success) {
    content = await getCountrySlugs()
    await saveFile(ctx, computedRef, JSON.stringify(content, null, 2), {})
  } else {
    content = JSON.parse(result.data.toString('utf-8'))
  }

  return content
}

const getCitySlugs = async (countries: CountrySlugRow[], timeout: number) => {
  const results: CitySlugs = {}
  for (const country of countries) {
    const res = await fetch(
      `https://www.numbeo.com/cost-of-living/country_result.jsp?${country.link}`,
    )
    const html = await res.text()
    const $ = load(html)

    const cities: { name: string; link: string }[] = []

    $('#city > option').each(function (_i, elem) {
      const value = elem.attribs.value
      if (value) {
        cities.push({ name: $(this).text(), link: value })
      }
    })

    if (cities.length === 0) {
      throw new Error(`No cities in ${country.name} scraped, something is off`)
    }

    results[country.code as CountryAlpha2Code] = cities
    console.log(`${cities.length} cities of ${country.name} scraped`)
    await sleepMs(timeout)
  }

  return results
}

export const downloadCitySlugs = async (
  ctx: { s3: S3Client },
  ref: RefDir,
  timeout: number,
): Promise<CitySlugs> => {
  const key = `numbeo/city-slugs-${getCurrentMonth()}.json`
  const computedRef = refDirToRef(ref, key)
  let content: CitySlugs
  const result = await loadFile(ctx, computedRef, { stream: false })
  if (!result.success) {
    const countries = await downloadCountrySlugs(ctx, ref)
    content = await getCitySlugs(countries, timeout)
    await saveFile(ctx, computedRef, JSON.stringify(content, null, 2), {})
  } else {
    content = JSON.parse(result.data.toString('utf-8'))
    const missingCountries: CountryAlpha2Code[] = []
    for (const [country, cities] of Object.entries(content)) {
      if (cities.length === 0) {
        missingCountries.push(country as CountryAlpha2Code)
      }
    }

    if (missingCountries.length > 0) {
      let countries = await downloadCountrySlugs(ctx, ref)
      countries = countries.filter(c => missingCountries.includes(c.code))
      content = { ...content, ...(await getCitySlugs(countries, timeout)) }
      await saveFile(ctx, computedRef, JSON.stringify(content, null, 2), {})
    }
  }

  return content
}

const getCityData = async (
  country: string,
  city: string,
  headers: Record<string, string>,
) => {
  const params = new URLSearchParams({ country, city })
  const resp = await fetch(
    `https://www.numbeo.com/cost-of-living/city_result.jsp?${params.toString()}`,
    {
      method: 'GET',
      headers,
    },
  )
  const content = await resp.text()
  const $ = load(content)
  const filtered = $('#displayCurrency > option').filter(function () {
    return $(this).attr('selected') === 'selected'
  })
  const currency = filtered.text().trim() as CurrencyCode
  const comment = $('body > div:nth-child(3) > div.align_like_price_table')
    .text()
    .trim()
  const entries = parseInt(comment.split(' ')[3])
  const restaurantsData: NumbeoCityRestaurantsData = {}
  const marketsData: NumbeoCityMarketsData = {}
  const transportationData: NumbeoCityTransportationData = {}
  const utilitiesData: NumbeoCityUtilitiesData = {}
  const sportsData: NumbeoCitySportsData = {}
  const childcareData: NumbeoCityChildcareData = {}
  const clothingData: NumbeoCityClothingData = {}
  const rentData: NumbeoCityRentData = {}
  const buyApartmentData: NumbeoCityBuyApartmentData = {}
  const salaryData: NumbeoCitySalaryData = {}
  const restaurantsKeys = Object.keys(restaurantsKeyMapping)
  const marketsKeys = Object.keys(marketsKeyMapping)
  const transportationKeys = Object.keys(transportationKeyMapping)
  const utilitiesKeys = Object.keys(utilitiesKeyMapping)
  const sportsKeys = Object.keys(sportsKeyMapping)
  const childcareKeys = Object.keys(childcareKeyMapping)
  const clothingKeys = Object.keys(clothingKeyMapping)
  const rentKeys = Object.keys(rentKeyMapping)
  const buyApartmentKeys = Object.keys(buyApartmentKeyMapping)
  const salaryKeys = Object.keys(salaryKeyMapping)
  let dataTarget: any = undefined
  let key: any = undefined
  $('table.data_wide_table tbody tr').each(function () {
    $(this)
      .children()
      .each(function (i) {
        if (i === 0 && this.tagName === 'th') {
          return
        } else {
          const originalKey = $(this).text().trim()
          if (restaurantsKeys.includes(originalKey)) {
            dataTarget = restaurantsData
            key =
              restaurantsKeyMapping[
                originalKey as keyof typeof restaurantsKeyMapping
              ]
          } else if (marketsKeys.includes(originalKey)) {
            dataTarget = marketsData
            key =
              marketsKeyMapping[originalKey as keyof typeof marketsKeyMapping]
          } else if (transportationKeys.includes(originalKey)) {
            dataTarget = transportationData
            key =
              transportationKeyMapping[
                originalKey as keyof typeof transportationKeyMapping
              ]
          } else if (utilitiesKeys.includes(originalKey)) {
            dataTarget = utilitiesData
            key =
              utilitiesKeyMapping[
                originalKey as keyof typeof utilitiesKeyMapping
              ]
          } else if (sportsKeys.includes(originalKey)) {
            dataTarget = sportsData
            key = sportsKeyMapping[originalKey as keyof typeof sportsKeyMapping]
          } else if (childcareKeys.includes(originalKey)) {
            dataTarget = childcareData
            key =
              childcareKeyMapping[
                originalKey as keyof typeof childcareKeyMapping
              ]
          } else if (clothingKeys.includes(originalKey)) {
            dataTarget = clothingData
            key =
              clothingKeyMapping[originalKey as keyof typeof clothingKeyMapping]
          } else if (rentKeys.includes(originalKey)) {
            dataTarget = rentData
            key = rentKeyMapping[originalKey as keyof typeof rentKeyMapping]
          } else if (buyApartmentKeys.includes(originalKey)) {
            dataTarget = buyApartmentData
            key =
              buyApartmentKeyMapping[
                originalKey as keyof typeof buyApartmentKeyMapping
              ]
          } else if (salaryKeys.includes(originalKey)) {
            dataTarget = salaryData
            key = salaryKeyMapping[originalKey as keyof typeof salaryKeyMapping]
          }
        }

        if (i === 1 && dataTarget && key) {
          const price = $(this).text().trim()
          if (price.includes('?')) {
            return
          }

          const parsed = parsePrice(price)
          dataTarget[key] = parsed
        }

        if (i === 2) {
          dataTarget = undefined
          key = undefined
        }
      })
  })

  return {
    currency,
    entries,
    restaurantsData,
    marketsData,
    transportationData,
    utilitiesData,
    sportsData,
    childcareData,
    clothingData,
    rentData,
    buyApartmentData,
    salaryData,
  }
}

const headerGenerator = new HeaderGenerator(PRESETS.MODERN_WINDOWS_CHROME)

export const downloadData = async (
  ctx: { s3: S3Client },
  ref: RefDir,
  countrySlugs: CountrySlugRow[],
  citySlugs: CitySlugs,
  start: number,
  end: number,
  timeout: number,
) => {
  const headers = headerGenerator.getHeaders()
  const pageSize = 100

  const ordered: { country: string; code: CountryAlpha2Code; city: string }[] =
    []

  for (const country of countrySlugs) {
    for (const city of citySlugs[country.code]!) {
      ordered.push({
        country: country.name,
        code: country.code,
        city: city.name,
      })
    }
  }

  const maxPage = Math.ceil(ordered.length / pageSize) - 1
  console.log(`${end - start + 1} / ${maxPage + 1} pages to be scraped`)
  for (let i = start; i <= end; i++) {
    const key = `numbeo/${getCurrentMonth()}/cost-of-living-${i}.json`
    let targetPage = ordered.slice(pageSize * i, pageSize * (i + 1))
    let rows: {
      country: string
      code: CountryAlpha2Code
      city: string
      entries: number
      [key: string]: any
    }[] = []

    const computedRef = refDirToRef(ref, key)
    let updates: { index: number; action: 'insert' | 'replace' }[] = Array(
      targetPage.length,
    )
      .fill(null)
      .map((_, i) => ({ index: i, action: 'insert' }))
    const result = await loadFile(ctx, computedRef, { stream: false })
    if (result.success) {
      const json = JSON.parse(result.data.toString('utf-8')) as {
        country: string
        code: CountryAlpha2Code
        city: string
        entries: number
        [key: string]: any
      }[]
      rows = json
      const newUpdates: { index: number; action: 'insert' | 'replace' }[] = []
      for (let i = 0; i < targetPage.length; i++) {
        const item = targetPage[i]
        const found = json.findIndex(
          e => e.city === item.city && e.country === item.country,
        )
        if (found < 0) {
          newUpdates.push({ index: i, action: 'insert' })
        } else if (
          Object.keys(json[found].restaurantsData).length === 0 &&
          Object.keys(json[found].marketsData).length === 0 &&
          Object.keys(json[found].transportationData).length === 0 &&
          Object.keys(json[found].utilitiesData).length === 0 &&
          Object.keys(json[found].sportsData).length === 0 &&
          Object.keys(json[found].childcareData).length === 0 &&
          Object.keys(json[found].clothingData).length === 0 &&
          Object.keys(json[found].rentData).length === 0 &&
          Object.keys(json[found].buyApartmentData).length === 0 &&
          Object.keys(json[found].salaryData).length === 0 &&
          (json[found].entries === undefined ||
            json[found].entries === null ||
            json[found].entries > 0)
        ) {
          newUpdates.push({ index: i, action: 'replace' })
        }
      }

      updates = newUpdates
    }

    if (updates.length > 0) {
      console.log(`Page ${i}: ${updates.length} items to scrape`)
    }

    for (const update of updates) {
      const item = targetPage[update.index]
      const data = await getCityData(item.country, item.city, headers)
      if (
        isNaN(data.entries) &&
        (data.currency as any) === '' &&
        // Those two are special false positives.
        !['Fürstenwalde/Spree, Brandenburg', 'Victoria/Rabat'].includes(
          item.city,
        )
      ) {
        throw new Error('Banned, try again')
      }
      const newItem = {
        country: item.country,
        code: item.code,
        city: item.city,
        ...data,
      }
      if (update.action === 'insert') {
        rows = [
          ...rows.slice(0, update.index),
          newItem,
          ...rows.slice(update.index),
        ]
      } else {
        rows[update.index] = newItem
      }
      console.log(`${update.index}: ${item.country} - ${item.city} scraped`)
      if (ref.type === 'fs') {
        await saveFile(ctx, computedRef, JSON.stringify(rows, null, 2), {})
      }
      await sleepMs(timeout)
    }

    await saveFile(ctx, computedRef, JSON.stringify(rows, null, 2), {})
  }
}

const postprocessCityData = (
  cities: CityData[],
  actions: PostprocessAction[],
): PostprocessedCityData[] => {
  const deletes = actions.filter(a => a.type === 'delete')
  const updates = actions.filter(a => a.type === 'update')
  return cities
    .filter(c => {
      const found = deletes.find(
        d => d.countryCode === c.code && d.city === c.city,
      )
      return !Boolean(found)
    })
    .map(city => {
      const found = updates.find(
        u => u.countryCode === city.code && u.from === city.city,
      )
      if (found) {
        return { ...city, city: found.to, originalCity: found.from }
      }

      return { ...city, originalCity: city.city }
    })
}

type M = Record<string, string>

type QueryBuilder = SelectQueryBuilder<
  IntelligenceDatabase,
  'place_name_or_alias' | 'place',
  {
    external_id: number
    name: string
    feature_code: PlaceFeatureCode
    population: string
  }
>

const processParenthesis = async (city: CityData, query: QueryBuilder) => {
  const realName = city.city.replace(/\(.*\)/g, '').trim()
  const possibleNames = city.city
    .split('(')[1]
    .split(')')[0]
    .split(',')
    .map(s => s.trim())
  return await query
    .where(eb => {
      const ors: Expression<SqlBool>[] = []

      ors.push(eb('place_name_or_alias.name', '=', realName))
      for (const n of possibleNames) {
        ors.push(eb('place_name_or_alias.name', '=', n))
      }

      return eb.or(ors)
    })
    .execute()
}

const processComma = async (
  city: CityData,
  query: QueryBuilder,
  admin1Mapper: (state: string) => string,
  admin2Mapper?: (state: string) => { admin1: string; admin2: string },
) => {
  const parts = city.city.split(',')
  const name = parts[0].trim()
  const tail = parts[parts.length - 1].trim()

  if (admin2Mapper) {
    const { admin1, admin2 } = admin2Mapper(tail)
    query = query
      .where('place.admin2_code', '=', admin2)
      .where('place.admin1_code', '=', admin1)
      .where('place_name_or_alias.name', '=', name)
  } else {
    const state = admin1Mapper(tail)
    query = query
      .where('place.admin1_code', '=', state)
      .where('place_name_or_alias.name', '=', name)
  }

  return await query.execute()
}

export type NumbeoGeonamesMap = {
  numbeo: {
    country: string
    code: CountryAlpha2Code
    city: string
    originalCity: string
  }
  geonames: number[]
}

/**
 * Map numbeo cities to geonames
 * @param ctx - The context
 * @param ctx.s3 - The S3 client
 * @param ctx.db - The intelligence database
 * @param cities - The cities to map
 * @returns The mapped cities
 */
const map = async (
  ctx: { s3: S3Client; db: Kysely<IntelligenceDatabase> },
  cities: PostprocessedCityData[],
) => {
  const entries: NumbeoGeonamesMap[] = []

  let count = 0
  for (const city of cities) {
    let similar: {
      external_id: number
      name: string
      population: string
      feature_code: PlaceFeatureCode
    }[]
    const query = ctx.db
      .selectFrom('place_name_or_alias')
      .innerJoin('place', 'place.id', 'place_name_or_alias.id')
      .select([
        'place.external_id',
        'place_name_or_alias.name',
        'place.population',
        'place.feature_code',
      ])
      .where('place_name_or_alias.country_code', '=', city.code)
      .where('place.feature_code', 'like', 'PPL%' as any)
      .orderBy('place.population', 'desc')
      .orderBy('place.feature_code', 'desc')
      .limit(1)
    if (city.city.includes('(')) {
      similar = await processParenthesis(city, query)
    } else if (city.code === 'US') {
      similar = await processComma(city, query, s => s)
    } else if (city.code === 'CA' && city.city.includes(',')) {
      const MAP: M = {
        AB: '01',
        BC: '02',
        MB: '03',
        NB: '04',
        NL: '05',
        NS: '07',
        ON: '08',
        PE: '09',
        QC: '10',
        SK: '11',
        YT: '12',
        NT: '13',
        NU: '14',
      }
      similar = await processComma(city, query, s => MAP[s])
    } else if (city.code === 'AU' && city.city.includes(',')) {
      const MAP: M = {
        NSW: '02',
        WA: '08',
        VIC: '07',
      }
      similar = await processComma(city, query, s => MAP[s])
    } else if (city.code === 'CN' && city.city.includes(',')) {
      const MAP: M = {
        Yunnan: '29',
        Sichuan: '32',
        Shandong: '25',
        Jiangsu: '04',
        Shaanxi: '26',
      }
      similar = await processComma(city, query, s => MAP[s])
    } else if (city.code === 'BR' && city.city.includes(',')) {
      const MAP: M = {
        'Rio Grande do Sul': '23',
        'Minas Gerais': '15',
      }
      similar = await processComma(city, query, s => MAP[s])
    } else if (city.code === 'CR' && city.city.includes(',')) {
      const MAP: M = {
        Limon: '06',
      }
      similar = await processComma(city, query, s => MAP[s])
    } else if (city.code === 'DE' && city.city.includes(',')) {
      const MAP: M = {
        Thüringen: '15',
        Niedersachsen: '06',
      }
      similar = await processComma(city, query, s => MAP[s])
    } else if (city.code === 'ES' && city.city.includes(',')) {
      const MAP: M = {
        Tenerife: '53',
        Andalucía: '51',
      }
      similar = await processComma(city, query, s => MAP[s])
    } else if (city.code === 'GB' && city.city.includes(',')) {
      const MAP: Record<string, { admin1: string; admin2: string }> = {
        Norfolk: { admin1: 'ENG', admin2: 'I9' },
        'North Ayrshire': { admin1: 'SCT', admin2: 'V7' },
        Shropshire: { admin1: 'ENG', admin2: 'L6' },
        Denbighshire: { admin1: 'WLS', admin2: 'X9' },
        Worcestershire: { admin1: 'ENG', admin2: 'Q4' },
        Cambridgeshire: { admin1: 'ENG', admin2: 'C3' },
        Lancashire: { admin1: 'ENG', admin2: 'H2' },
        'South Ayrshire': { admin1: 'SCT', admin2: 'W4' },
        'East Ayrshire': { admin1: 'SCT', admin2: 'U4' },
      }
      similar = await processComma(
        city,
        query,
        s => s,
        s => MAP[s],
      )
    } else if (city.code === 'GE' && city.city.includes(',')) {
      const MAP: M = {
        Adjara: '04',
      }
      similar = await processComma(city, query, s => MAP[s])
    } else if (city.code === 'IN' && city.city.includes(',')) {
      const MAP: M = {
        'Tamil Nadu': '25',
        Kerala: '13',
        Gujarat: '09',
        'Uttar Pradesh': '36',
      }
      similar = await processComma(city, query, s => MAP[s])
    } else if (city.code === 'IT' && city.city.includes(',')) {
      const MAP: M = {
        Veneto: '20',
        Molise: '11',
      }
      similar = await processComma(city, query, s => MAP[s])
    } else if (city.code === 'MX' && city.city.includes(',')) {
      const MAP: M = {
        Sonora: '26',
        'Baja California Sur': '03',
        Veracruz: '30',
      }
      similar = await processComma(city, query, s => MAP[s])
    } else if (city.code === 'MY' && city.city.includes(',')) {
      const MAP: M = {
        Selangor: '12',
        Perlis: '08',
        Perak: '07',
        Sabah: '16',
      }
      similar = await processComma(city, query, s => MAP[s])
    } else if (city.code === 'NP' && city.city.includes(',')) {
      // Narayangarh <-> Bharatpur
      similar = []
    } else if (city.code === 'PA' && city.city.includes(',')) {
      const MAP: M = {
        'Isla Colon': '04',
        Herrera: '06',
      }
      similar = await processComma(city, query, s => MAP[s])
    } else if (city.code === 'PH' && city.city.includes(',')) {
      const MAP: Record<string, { admin1: string; admin2: string }> = {
        Cavite: { admin1: '40', admin2: '20' },
        'La Union': { admin1: '01', admin2: '36' },
        Laguna: { admin1: '40', admin2: '33' },
      }
      similar = await processComma(
        city,
        query,
        s => s,
        s => MAP[s],
      )
    } else if (city.code === 'ZA' && city.city.includes(',')) {
      const MAP: M = {
        WC: '11',
        GP: '06',
      }
      similar = await processComma(city, query, s => MAP[s])
    } else if (
      (city.code === 'GR' || city.code === 'ID') &&
      city.city.includes(',')
    ) {
      const parts = city.city.split(',')
      const name = parts[0].trim()
      similar = await query
        .where('place_name_or_alias.name', '=', name)
        .execute()
    } else if (['TW', 'PH'].includes(city.code) && city.city.endsWith('City')) {
      const parts = city.city.split(' ')
      const name = parts[0].trim()
      similar = await query
        .where('place_name_or_alias.name', '=', name)
        .execute()
    } else {
      similar = await query
        .where('place_name_or_alias.name', '=', city.city)
        .execute()
    }

    entries.push({
      numbeo: {
        country: city.country,
        code: city.code,
        city: city.city,
        originalCity: city.originalCity,
      },
      geonames: similar.map(s => s.external_id),
    })

    count++
  }

  return entries
}

export const processNumbeo = async (
  ctx: {
    s3: S3Client
    db: Kysely<IntelligenceDatabase>
  },
  ref: RefDir,
  month?: string,
) => {
  if (!month) {
    month = getCurrentMonth()
  }
  const startOfMonth = getStartOfMonth(new Date(month))
  const files = await listFiles(
    ctx,
    ref.type === 'fs'
      ? { type: 'fs', directory: join(ref.directory, 'numbeo', month) }
      : ref,
    { prefix: ref.type === 'fs' ? '' : `numbeo/${month}/` },
  )

  const cities: CityData[] = []
  for (const file of files) {
    const computedRef = refDirToRef(
      ref,
      ref.type === 'fs' ? join('numbeo', month, file) : file,
    )
    const result = await loadFile(ctx, computedRef, { stream: false })
    if (!result.success) {
      throw new Error(`Something went wrong when reading file ${file}`)
    }
    cities.push(...(JSON.parse(result.data.toString('utf-8')) as CityData[]))
  }
  const mapFile = `numbeo/map-${month}.json`
  const postprocessActionsFile = `numbeo/postprocess-${month}.json`
  const computedMapRef = refDirToRef(ref, mapFile)
  const computedPostprocessActionsRef = refDirToRef(ref, postprocessActionsFile)
  const mapResult = await loadFile(ctx, computedMapRef, { stream: false })
  let rows: NumbeoGeonamesMap[] = []
  if (!mapResult.success) {
    const postprocessResult = await loadFile(
      ctx,
      computedPostprocessActionsRef,
      {
        stream: false,
      },
    )
    if (!postprocessResult.success) {
      throw new Error(`Missing file: ${postprocessActionsFile}`)
    }

    const content = postprocessResult.data.toString('utf-8')
    const postprocessActions = JSON.parse(content) as PostprocessAction[]

    rows = await map(ctx, postprocessCityData(cities, postprocessActions))
    await saveFile(ctx, computedMapRef, JSON.stringify(rows, null, 2), {})
  } else {
    rows = JSON.parse(mapResult.data.toString('utf-8'))
  }

  for (const row of rows) {
    if (row.geonames.length === 1) {
      const found = cities.find(
        c =>
          c.country === row.numbeo.country &&
          c.city === row.numbeo.originalCity,
      )
      if (found) {
        const place = await ctx.db
          .updateTable('place')
          .set(
            'numbeo_reference',
            JSON.stringify({
              country_name: row.numbeo.country,
              city_name: row.numbeo.originalCity,
            }),
          )
          .where('external_id', '=', row.geonames[0])
          .returningAll()
          .execute()
        await ctx.db
          .insertInto('cost_of_living_data')
          .values({
            place_id: place[0].id,
            currency_code: found.currency,
            restaurants_meal_inexpensive:
              found.restaurantsData.mealInexpensive ?? null,
            restaurants_meal_2_people:
              found.restaurantsData.meal2People ?? null,
            restaurants_mc_meal: found.restaurantsData.mcMeal ?? null,
            restaurants_domestic_beer:
              found.restaurantsData.domesticBeer ?? null,
            restaurants_imported_beer:
              found.restaurantsData.importedBeer ?? null,
            restaurants_cappuccino: found.restaurantsData.cappuccino ?? null,
            restaurants_coke_pepsi: found.restaurantsData.cokePepsi ?? null,
            restaurants_water: found.restaurantsData.water ?? null,
            markets_milk: found.marketsData.milk
              ? found.marketsData.milk
              : found.marketsData.milk1Liter
                ? found.marketsData.milk1Liter / 0.2642
                : null,
            markets_loaf_of_fresh_white_bread:
              found.marketsData.loafOfFreshWhiteBread ?? null,
            markets_rice: found.marketsData.rice ?? null,
            markets_eggs: found.marketsData.eggs ?? null,
            markets_local_cheese: found.marketsData.localCheese ?? null,
            markets_chicken_fillets: found.marketsData.chickenFillets ?? null,
            markets_beef_round: found.marketsData.beefRound ?? null,
            markets_apples: found.marketsData.apples ?? null,
            markets_banana: found.marketsData.banana ?? null,
            markets_oranges: found.marketsData.oranges ?? null,
            markets_tomato: found.marketsData.tomato ?? null,
            markets_potato: found.marketsData.potato ?? null,
            markets_onion: found.marketsData.onion ?? null,
            markets_lettuce: found.marketsData.lettuce ?? null,
            markets_water: found.marketsData.water ?? null,
            markets_bottle_of_wine: found.marketsData.bottleOfWine ?? null,
            markets_domestic_beer: found.marketsData.domesticBeer ?? null,
            markets_imported_beer: found.marketsData.importedBeer ?? null,
            markets_cigarettes: found.marketsData.cigarettes ?? null,
            transportation_one_way_ticket:
              found.transportationData.oneWayTicket ?? null,
            transportation_monthly_pass:
              found.transportationData.monthlyPass ?? null,
            transportation_taxi_start:
              found.transportationData.taxiStart ?? null,
            transportation_taxi_1_km: found.transportationData.taxi1Km ?? null,
            transportation_taxi_1_hour_waiting:
              found.transportationData.taxi1HourWaiting ?? null,
            transportation_gasoline: found.transportationData.gasoline
              ? found.transportationData.gasoline
              : found.transportationData.gasoline1Liter
                ? found.transportationData.gasoline1Liter / 0.2642
                : null,
            transportation_volkswagen:
              found.transportationData.volkswagen ?? null,
            transportation_toyota: found.transportationData.toyota ?? null,
            utilities_basic: found.utilitiesData.basic ?? null,
            utilities_mobile: found.utilitiesData.mobile ?? null,
            utilities_internet: found.utilitiesData.internet ?? null,
            sports_fitness_club: found.sportsData.fitnessClub ?? null,
            sports_tennis_court: found.sportsData.tennisCourt ?? null,
            sports_cinema: found.sportsData.cinema ?? null,
            childcare_preschool: found.childcareData.preschool ?? null,
            childcare_international_primary_school:
              found.childcareData.internationalPrimarySchool ?? null,
            clothing_jeans: found.clothingData.jeans ?? null,
            clothing_summer_dress: found.clothingData.summerDress ?? null,
            clothing_running_shoes: found.clothingData.runningShoes ?? null,
            clothing_business_shoes: found.clothingData.businessShoes ?? null,
            rent_in_city_centre_1_bedroom:
              found.rentData.inCityCentre1Bedroom ?? null,
            rent_outside_of_center_1_bedroom:
              found.rentData.outsideOfCenter1Bedroom ?? null,
            rent_in_city_centre_3_bedrooms:
              found.rentData.inCityCentre3Bedrooms ?? null,
            rent_outside_of_center_3_bedrooms:
              found.rentData.outsideOfCenter3Bedrooms ?? null,
            buy_apartment_in_city_centre:
              found.buyApartmentData.inCityCentre ?? null,
            buy_apartment_outside_of_centre:
              found.buyApartmentData.outsideOfCentre ?? null,
            salary_average_monthly_net_salary:
              found.salaryData.averageMonthlyNetSalary ?? null,
            salary_mortgage_interest_rate:
              found.salaryData.mortgageInterestRate ?? null,
            created_at: startOfMonth,
          })
          .onConflict(oc =>
            oc.columns(['place_id', 'created_at']).doUpdateSet(eb => ({
              currency_code: eb.ref('excluded.currency_code'),
              restaurants_meal_inexpensive: eb.ref(
                'excluded.restaurants_meal_inexpensive',
              ),
              restaurants_meal_2_people: eb.ref(
                'excluded.restaurants_meal_2_people',
              ),
              restaurants_mc_meal: eb.ref('excluded.restaurants_mc_meal'),
              restaurants_domestic_beer: eb.ref(
                'excluded.restaurants_domestic_beer',
              ),
              restaurants_imported_beer: eb.ref(
                'excluded.restaurants_imported_beer',
              ),
              restaurants_cappuccino: eb.ref('excluded.restaurants_cappuccino'),
              restaurants_coke_pepsi: eb.ref('excluded.restaurants_coke_pepsi'),
              restaurants_water: eb.ref('excluded.restaurants_water'),
              markets_milk: eb.ref('excluded.markets_milk'),
              markets_loaf_of_fresh_white_bread: eb.ref(
                'excluded.markets_loaf_of_fresh_white_bread',
              ),
              markets_rice: eb.ref('excluded.markets_rice'),
              markets_eggs: eb.ref('excluded.markets_eggs'),
              markets_local_cheese: eb.ref('excluded.markets_local_cheese'),
              markets_chicken_fillets: eb.ref(
                'excluded.markets_chicken_fillets',
              ),
              markets_beef_round: eb.ref('excluded.markets_beef_round'),
              markets_apples: eb.ref('excluded.markets_apples'),
              markets_banana: eb.ref('excluded.markets_banana'),
              markets_oranges: eb.ref('excluded.markets_oranges'),
              markets_tomato: eb.ref('excluded.markets_tomato'),
              markets_potato: eb.ref('excluded.markets_potato'),
              markets_onion: eb.ref('excluded.markets_onion'),
              markets_lettuce: eb.ref('excluded.markets_lettuce'),
              markets_water: eb.ref('excluded.markets_water'),
              markets_bottle_of_wine: eb.ref('excluded.markets_bottle_of_wine'),
              markets_domestic_beer: eb.ref('excluded.markets_domestic_beer'),
              markets_imported_beer: eb.ref('excluded.markets_imported_beer'),
              markets_cigarettes: eb.ref('excluded.markets_cigarettes'),
              transportation_one_way_ticket: eb.ref(
                'excluded.transportation_one_way_ticket',
              ),
              transportation_monthly_pass: eb.ref(
                'excluded.transportation_monthly_pass',
              ),
              transportation_taxi_start: eb.ref(
                'excluded.transportation_taxi_start',
              ),
              transportation_taxi_1_km: eb.ref(
                'excluded.transportation_taxi_1_km',
              ),
              transportation_taxi_1_hour_waiting: eb.ref(
                'excluded.transportation_taxi_1_hour_waiting',
              ),
              transportation_gasoline: eb.ref(
                'excluded.transportation_gasoline',
              ),
              transportation_volkswagen: eb.ref(
                'excluded.transportation_volkswagen',
              ),
              transportation_toyota: eb.ref('excluded.transportation_toyota'),
              utilities_basic: eb.ref('excluded.utilities_basic'),
              utilities_mobile: eb.ref('excluded.utilities_mobile'),
              utilities_internet: eb.ref('excluded.utilities_internet'),
              sports_fitness_club: eb.ref('excluded.sports_fitness_club'),
              sports_tennis_court: eb.ref('excluded.sports_tennis_court'),
              sports_cinema: eb.ref('excluded.sports_cinema'),
              childcare_preschool: eb.ref('excluded.childcare_preschool'),
              childcare_international_primary_school: eb.ref(
                'excluded.childcare_international_primary_school',
              ),
              clothing_jeans: eb.ref('excluded.clothing_jeans'),
              clothing_summer_dress: eb.ref('excluded.clothing_summer_dress'),
              clothing_running_shoes: eb.ref('excluded.clothing_running_shoes'),
              clothing_business_shoes: eb.ref(
                'excluded.clothing_business_shoes',
              ),
              rent_in_city_centre_1_bedroom: eb.ref(
                'excluded.rent_in_city_centre_1_bedroom',
              ),
              rent_outside_of_center_1_bedroom: eb.ref(
                'excluded.rent_outside_of_center_1_bedroom',
              ),
              rent_in_city_centre_3_bedrooms: eb.ref(
                'excluded.rent_in_city_centre_3_bedrooms',
              ),
              rent_outside_of_center_3_bedrooms: eb.ref(
                'excluded.rent_outside_of_center_3_bedrooms',
              ),
              buy_apartment_in_city_centre: eb.ref(
                'excluded.buy_apartment_in_city_centre',
              ),
              buy_apartment_outside_of_centre: eb.ref(
                'excluded.buy_apartment_outside_of_centre',
              ),
              salary_average_monthly_net_salary: eb.ref(
                'excluded.salary_average_monthly_net_salary',
              ),
              salary_mortgage_interest_rate: eb.ref(
                'excluded.salary_mortgage_interest_rate',
              ),
            })),
          )
          .execute()
      }
    }
  }

  await ctx.db
    .updateTable('metadata')
    .set('numbeo_updated_at', startOfMonth)
    .execute()
}
