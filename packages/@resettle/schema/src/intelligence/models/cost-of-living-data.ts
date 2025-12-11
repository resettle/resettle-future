import { z } from 'zod'

import {
  currencyCodeSchema,
  dateSchema,
  numberNullableSchema,
  uuidSchema,
} from '../../_common'

export const costOfLivingDataSchema = z.object({
  place_id: uuidSchema,
  currency_code: currencyCodeSchema,
  restaurants_meal_inexpensive: numberNullableSchema,
  restaurants_meal_2_people: numberNullableSchema,
  restaurants_mc_meal: numberNullableSchema,
  restaurants_domestic_beer: numberNullableSchema,
  restaurants_imported_beer: numberNullableSchema,
  restaurants_cappuccino: numberNullableSchema,
  restaurants_coke_pepsi: numberNullableSchema,
  restaurants_water: numberNullableSchema,
  markets_milk: numberNullableSchema,
  markets_loaf_of_fresh_white_bread: numberNullableSchema,
  markets_rice: numberNullableSchema,
  markets_eggs: numberNullableSchema,
  markets_local_cheese: numberNullableSchema,
  markets_chicken_fillets: numberNullableSchema,
  markets_beef_round: numberNullableSchema,
  markets_apples: numberNullableSchema,
  markets_banana: numberNullableSchema,
  markets_oranges: numberNullableSchema,
  markets_tomato: numberNullableSchema,
  markets_potato: numberNullableSchema,
  markets_onion: numberNullableSchema,
  markets_lettuce: numberNullableSchema,
  markets_water: numberNullableSchema,
  markets_bottle_of_wine: numberNullableSchema,
  markets_domestic_beer: numberNullableSchema,
  markets_imported_beer: numberNullableSchema,
  markets_cigarettes: numberNullableSchema,
  transportation_one_way_ticket: numberNullableSchema,
  transportation_monthly_pass: numberNullableSchema,
  transportation_taxi_start: numberNullableSchema,
  transportation_taxi_1_km: numberNullableSchema,
  transportation_taxi_1_hour_waiting: numberNullableSchema,
  transportation_gasoline: numberNullableSchema,
  transportation_volkswagen: numberNullableSchema,
  transportation_toyota: numberNullableSchema,
  utilities_basic: numberNullableSchema,
  utilities_mobile: numberNullableSchema,
  utilities_internet: numberNullableSchema,
  sports_fitness_club: numberNullableSchema,
  sports_tennis_court: numberNullableSchema,
  sports_cinema: numberNullableSchema,
  childcare_preschool: numberNullableSchema,
  childcare_international_primary_school: numberNullableSchema,
  clothing_jeans: numberNullableSchema,
  clothing_summer_dress: numberNullableSchema,
  clothing_running_shoes: numberNullableSchema,
  clothing_business_shoes: numberNullableSchema,
  rent_in_city_centre_1_bedroom: numberNullableSchema,
  rent_outside_of_center_1_bedroom: numberNullableSchema,
  rent_in_city_centre_3_bedrooms: numberNullableSchema,
  rent_outside_of_center_3_bedrooms: numberNullableSchema,
  buy_apartment_in_city_centre: numberNullableSchema,
  buy_apartment_outside_of_centre: numberNullableSchema,
  salary_average_monthly_net_salary: numberNullableSchema,
  salary_mortgage_interest_rate: numberNullableSchema,
  created_at: dateSchema,
})

export const costOfLivingDataResponseSchema = z.object({
  place_id: uuidSchema,
  currency_code: currencyCodeSchema,
  dining: z.object({
    inexpensive: numberNullableSchema.describe(
      'A meal at an inexpensive restaurant',
    ),
    mid_tier: numberNullableSchema.describe(
      'A meal for two at an mid-tier restaurant',
    ),
    mcdonalds: numberNullableSchema.describe(`A combo meal at McDonald's`),
    domestic_beer: numberNullableSchema.describe(
      'Domestic beer (1 US liquid pint or 473.2 ml)',
    ),
    imported_beer: numberNullableSchema.describe(
      'A bottle of imported beer (12 oz or 330 ml)',
    ),
    cappuccino: numberNullableSchema.describe('A cup of cappuccino'),
    soft_drink: numberNullableSchema.describe(
      'A bottle of soft drink (Coke, 12 oz or 330 ml)',
    ),
    water: numberNullableSchema.describe('A bottle of water (12 oz or 330 ml)'),
  }),
  grocery: z.object({
    milk: numberNullableSchema.describe('Milk (1 gallon or 3.8 l)'),
    bread: numberNullableSchema.describe('White bread (1 lb or 0.45 kg)'),
    rice: numberNullableSchema.describe('Rice (1 lb or 0.45 kg)'),
    eggs: numberNullableSchema.describe('A dozen of eggs (12)'),
    cheese: numberNullableSchema.describe('Cheese (1 lb or 0.45 kg)'),
    chicken_fillets: numberNullableSchema.describe(
      'Chicken fillets (1 lb or 0.45 kg)',
    ),
    beef_round: numberNullableSchema.describe('Beef round (1 lb or 0.45 kg)'),
    apples: numberNullableSchema.describe('Apples (1 lb or 0.45 kg)'),
    bananas: numberNullableSchema.describe('Bananas (1 lb or 0.45 kg)'),
    oranges: numberNullableSchema.describe('Oranges (1 lb or 0.45 kg)'),
    tomatoes: numberNullableSchema.describe('Tomatoes (1 lb or 0.45 kg)'),
    potatoes: numberNullableSchema.describe('Potatoes (1 lb or 0.45 kg)'),
    onions: numberNullableSchema.describe('Onions (1 lb or 0.45 kg)'),
    lettuce: numberNullableSchema.describe('Lettuce (1 lb or 0.45 kg)'),
    water: numberNullableSchema.describe('Water (0.4 gallon or 1.5 l)'),
    wine: numberNullableSchema.describe('A bottle of mid-tier wine'),
    domestic_beer: numberNullableSchema.describe(
      'Domestic beer (17 oz or 0.5 l)',
    ),
    imported_beer: numberNullableSchema.describe(
      'A bottle of imported beer (12 oz or 330 ml)',
    ),
    cigarettes: numberNullableSchema.describe('A pack of 20 cigarettes'),
  }),
  transportation: z.object({
    one_way_ticket: numberNullableSchema.describe(
      'One way ticket of local public transport',
    ),
    monthly_pass: numberNullableSchema.describe(
      'Monthly pass of local public transport',
    ),
    taxi_start: numberNullableSchema.describe('Taxi start price'),
    taxi_1_mile: numberNullableSchema.describe('Taxi price (1 mile or 1.6 km)'),
    taxi_1_hour_waiting: numberNullableSchema.describe(
      'Taxi price (1 hour waiting)',
    ),
    gasoline: numberNullableSchema.describe('Gasoline (1 gallon or 3.8 l)'),
    compact_car: numberNullableSchema.describe('New car (compact sized)'),
    mid_car: numberNullableSchema.describe('New car (mid-sized)'),
  }),
  utilities: z.object({
    basic: numberNullableSchema.describe(
      'Basic utilities (electricity, heating, cooling, water) fee for a mid-sized apartment',
    ),
    mobile: numberNullableSchema.describe(
      'Mobile phone monthly plan with calls and data',
    ),
    internet: numberNullableSchema.describe(
      'Internet monthly plan (Unlimited data, 60 Mbps or higher)',
    ),
  }),
  entertainment: z.object({
    fitness_club: numberNullableSchema.describe(
      'Monthly membership fee of a fitness club',
    ),
    tennis_court: numberNullableSchema.describe(
      '1 hour of tennis court rental fee',
    ),
    cinema: numberNullableSchema.describe('1 cinema ticket'),
  }),
  education: z.object({
    preschool: numberNullableSchema.describe(
      'Monthly fee per child for a private full-day preschool',
    ),
    international_primary_school: numberNullableSchema.describe(
      'Annual fee per child for an international primary school',
    ),
  }),
  clothing: z.object({
    jeans: numberNullableSchema.describe(
      '1 pair of mid-tier jeans from a chain store',
    ),
    summer_dress: numberNullableSchema.describe(
      '1 mid-tier summer dress from a chain store',
    ),
    running_shoes: numberNullableSchema.describe(
      '1 pair of mid-tier running shoes',
    ),
    business_shoes: numberNullableSchema.describe(
      `1 pair of mid-tier men's leather business shoes`,
    ),
  }),
  housing: z.object({
    rent_city_center_1_bedroom: numberNullableSchema.describe(
      'Price to rent a 1 bedroom apartment in city center',
    ),
    rent_outside_of_center_1_bedroom: numberNullableSchema.describe(
      'Price to rent a 1 bedroom apartment outside of city center',
    ),
    rent_city_center_3_bedrooms: numberNullableSchema.describe(
      'Price to rent a 3 bedroom apartment in city center',
    ),
    rent_outside_of_center_3_bedrooms: numberNullableSchema.describe(
      'Price to rent a 3 bedroom apartment outside of city center',
    ),
    buy_city_center: numberNullableSchema.describe(
      'Price per square feet or 0.09 square meters to buy an apartment in city center',
    ),
    buy_outside_of_center: numberNullableSchema.describe(
      'Price per square feet or 0.09 square meters to buy an apartment outside of city center',
    ),
  }),
  income: z.object({
    average_monthly_net_salary: numberNullableSchema.describe(
      'Average Monthly Net Salary (after tax)',
    ),
  }),
  mortgage: z.object({
    interest_rate: numberNullableSchema.describe(
      '20 years Mortgage Interest Rate in Percentages (annual rate)',
    ),
  }),
})

export type CostOfLivingData = z.infer<typeof costOfLivingDataSchema>
export type CostOfLivingDataDetailsOnly = Omit<
  CostOfLivingData,
  'place_id' | 'currency_code' | 'created_at'
>
export type CostOfLivingDataResponse = z.infer<
  typeof costOfLivingDataResponseSchema
>
