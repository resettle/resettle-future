import { z } from 'zod'

import {
  currencyCodeSchema,
  dateSchema,
  numberNullableSchema,
  uuidSchema,
} from '../../common'

export const costOfLivingDataSchema = z.object({
  entity_id: uuidSchema,
  currency: currencyCodeSchema,
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

export const costOfLivingDataResponseSchema = costOfLivingDataSchema
  .omit({
    entity_id: true,
    created_at: true,
  })
  .extend({
    id: uuidSchema,
  })

export type CostOfLivingData = z.infer<typeof costOfLivingDataSchema>
export type CostOfLivingDataResponse = z.infer<
  typeof costOfLivingDataResponseSchema
>
