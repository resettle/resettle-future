import type { CostOfLivingData } from '@resettle/schema/global'
import { assert, type Equals } from '@resettle/utils'
import type { Generated, Selectable } from 'kysely'
import type { CurrencyCode } from '../../../../../packages/@resettle/schema/src/_common'

export interface CostOfLivingDataTable {
  place_id: string
  currency_code: CurrencyCode
  restaurants_meal_inexpensive: number | null
  restaurants_meal_2_people: number | null
  restaurants_mc_meal: number | null
  restaurants_domestic_beer: number | null
  restaurants_imported_beer: number | null
  restaurants_cappuccino: number | null
  restaurants_coke_pepsi: number | null
  restaurants_water: number | null
  markets_milk: number | null
  markets_loaf_of_fresh_white_bread: number | null
  markets_rice: number | null
  markets_eggs: number | null
  markets_local_cheese: number | null
  markets_chicken_fillets: number | null
  markets_beef_round: number | null
  markets_apples: number | null
  markets_banana: number | null
  markets_oranges: number | null
  markets_tomato: number | null
  markets_potato: number | null
  markets_onion: number | null
  markets_lettuce: number | null
  markets_water: number | null
  markets_bottle_of_wine: number | null
  markets_domestic_beer: number | null
  markets_imported_beer: number | null
  markets_cigarettes: number | null
  transportation_one_way_ticket: number | null
  transportation_monthly_pass: number | null
  transportation_taxi_start: number | null
  transportation_taxi_1_km: number | null
  transportation_taxi_1_hour_waiting: number | null
  transportation_gasoline: number | null
  transportation_volkswagen: number | null
  transportation_toyota: number | null
  utilities_basic: number | null
  utilities_mobile: number | null
  utilities_internet: number | null
  sports_fitness_club: number | null
  sports_tennis_court: number | null
  sports_cinema: number | null
  childcare_preschool: number | null
  childcare_international_primary_school: number | null
  clothing_jeans: number | null
  clothing_summer_dress: number | null
  clothing_running_shoes: number | null
  clothing_business_shoes: number | null
  rent_in_city_centre_1_bedroom: number | null
  rent_outside_of_center_1_bedroom: number | null
  rent_in_city_centre_3_bedrooms: number | null
  rent_outside_of_center_3_bedrooms: number | null
  buy_apartment_in_city_centre: number | null
  buy_apartment_outside_of_centre: number | null
  salary_average_monthly_net_salary: number | null
  salary_mortgage_interest_rate: number | null
  created_at: Generated<Date>
}

assert<Equals<CostOfLivingData, Selectable<CostOfLivingDataTable>>>
