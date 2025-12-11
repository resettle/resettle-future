import { API_ERROR_CODES, APIError, apiSuccessResponse } from '@resettle/api'
import {
  INTELLIGENCE_API_ROUTES,
  INTELLIGENCE_API_SCHEMAS,
} from '@resettle/api/intelligence'
import { searchPlaces } from '@resettle/database/intelligence'
import type {
  CostOfLivingDataDetailsOnly,
  PlaceScope,
} from '@resettle/schema/intelligence'
import { queryValidator } from '@services/_common'
import { Hono } from 'hono'
import { describeRoute, openAPIRouteHandler, resolver } from 'hono-openapi'

import { auth } from '../middlewares/auth'

export const placeRouter = new Hono<{ Bindings: Cloudflare.Env }>()

placeRouter.get(
  INTELLIGENCE_API_SCHEMAS.place.search.route.path,
  describeRoute({
    description: 'Search places',
    responses: {
      200: {
        description: 'Places found successfully',
        content: {
          'application/json': {
            schema: resolver(
              INTELLIGENCE_API_SCHEMAS.place.search.responseData,
            ),
          },
        },
      },
    },
  }),
  queryValidator(INTELLIGENCE_API_SCHEMAS.place.search.query),
  auth({ isPlaceAPI: true }),
  async ctx => {
    const db = ctx.get('db')
    const {
      q,
      country_code,
      fuzzy,
      scope,
      limit = 100,
    } = ctx.req.valid('query')

    const results = await db.transaction().execute(async tx => {
      return await searchPlaces(tx, {
        limit,
        orderByDirection: 'desc',
        where: { q, fuzzy, country_code, scope },
      })
    })

    return apiSuccessResponse(
      INTELLIGENCE_API_SCHEMAS.place.search.responseData,
      results.map(r => ({
        place_id: r.id,
        country_code: r.country_code,
        name: r.name,
        aliases: r.aliases,
        scopes:
          r.numbeo_reference === null
            ? (['general-info'] as PlaceScope[])
            : (['general-info', 'cost-of-living'] as PlaceScope[]),
      })),
      200,
    )
  },
)

placeRouter.get(
  INTELLIGENCE_API_SCHEMAS.place.queryCostOfLiving.route.path,
  describeRoute({
    description: 'Query cost of living data for a place',
    responses: {
      200: {
        description: 'Cost of living data retrieved successfully',
        content: {
          'application/json': {
            schema: resolver(
              INTELLIGENCE_API_SCHEMAS.place.queryCostOfLiving.responseData,
            ),
          },
        },
      },
    },
  }),
  queryValidator(INTELLIGENCE_API_SCHEMAS.place.queryCostOfLiving.query),
  auth({ isPlaceAPI: true }),
  async ctx => {
    const db = ctx.get('db')
    const { place_id, currency_code = 'USD' } = ctx.req.valid('query')

    const data = await db
      .selectFrom('cost_of_living_data')
      .selectAll()
      .where('place_id', '=', place_id)
      .orderBy('created_at', 'desc')
      .limit(1)
      .execute()

    if (data.length === 0) {
      throw new APIError({
        code: API_ERROR_CODES.NOT_FOUND,
        message: 'Cost of living data not found',
        statusCode: 404,
      })
    }

    let rate: number

    if (data[0].currency_code === currency_code) {
      rate = 1
    } else {
      const fromExchangeRate = await db
        .selectFrom('exchange_rate_data')
        .selectAll()
        .where('currency_code', '=', data[0].currency_code)
        .orderBy('created_at', 'desc')
        .limit(1)
        .execute()

      const toExchangeRate = await db
        .selectFrom('exchange_rate_data')
        .selectAll()
        .where('currency_code', '=', currency_code)
        .orderBy('created_at', 'desc')
        .limit(1)
        .execute()

      if (fromExchangeRate.length === 0 || toExchangeRate.length === 0) {
        throw new APIError({
          code: API_ERROR_CODES.NOT_FOUND,
          message: 'Exchange rate not found',
          statusCode: 404,
        })
      }

      rate = fromExchangeRate[0].rate_to_usd / toExchangeRate[0].rate_to_usd
    }

    const applyRate = (
      response: CostOfLivingDataDetailsOnly,
      key: keyof CostOfLivingDataDetailsOnly,
      rate: number,
    ) => (response[key] === null ? null : response[key] * rate)

    const { created_at, ...rest } = data[0]

    return apiSuccessResponse(
      INTELLIGENCE_API_SCHEMAS.place.queryCostOfLiving.responseData,
      {
        place_id,
        currency_code,
        dining: {
          inexpensive: applyRate(rest, 'restaurants_meal_inexpensive', rate),
          mid_tier: applyRate(rest, 'restaurants_meal_2_people', rate),
          mcdonalds: applyRate(rest, 'restaurants_mc_meal', rate),
          domestic_beer: applyRate(rest, 'restaurants_domestic_beer', rate),
          imported_beer: applyRate(rest, 'restaurants_imported_beer', rate),
          cappuccino: applyRate(rest, 'restaurants_cappuccino', rate),
          soft_drink: applyRate(rest, 'restaurants_coke_pepsi', rate),
          water: applyRate(rest, 'restaurants_water', rate),
        },
        grocery: {
          milk: applyRate(rest, 'markets_milk', rate),
          bread: applyRate(rest, 'markets_loaf_of_fresh_white_bread', rate),
          rice: applyRate(rest, 'markets_rice', rate),
          eggs: applyRate(rest, 'markets_eggs', rate),
          cheese: applyRate(rest, 'markets_local_cheese', rate),
          chicken_fillets: applyRate(rest, 'markets_chicken_fillets', rate),
          beef_round: applyRate(rest, 'markets_beef_round', rate),
          apples: applyRate(rest, 'markets_apples', rate),
          bananas: applyRate(rest, 'markets_banana', rate),
          oranges: applyRate(rest, 'markets_oranges', rate),
          tomatoes: applyRate(rest, 'markets_tomato', rate),
          potatoes: applyRate(rest, 'markets_potato', rate),
          onions: applyRate(rest, 'markets_onion', rate),
          lettuce: applyRate(rest, 'markets_lettuce', rate),
          water: applyRate(rest, 'markets_water', rate),
          wine: applyRate(rest, 'markets_bottle_of_wine', rate),
          domestic_beer: applyRate(rest, 'markets_domestic_beer', rate),
          imported_beer: applyRate(rest, 'markets_imported_beer', rate),
          cigarettes: applyRate(rest, 'markets_cigarettes', rate),
        },
        transportation: {
          one_way_ticket: applyRate(
            rest,
            'transportation_one_way_ticket',
            rate,
          ),
          monthly_pass: applyRate(rest, 'transportation_monthly_pass', rate),
          taxi_start: applyRate(rest, 'transportation_taxi_start', rate),
          taxi_1_mile: applyRate(rest, 'transportation_taxi_1_km', rate),
          taxi_1_hour_waiting: applyRate(
            rest,
            'transportation_taxi_1_hour_waiting',
            rate,
          ),
          gasoline: applyRate(rest, 'transportation_gasoline', rate),
          compact_car: applyRate(rest, 'transportation_volkswagen', rate),
          mid_car: applyRate(rest, 'transportation_toyota', rate),
        },
        utilities: {
          basic: applyRate(rest, 'utilities_basic', rate),
          mobile: applyRate(rest, 'utilities_mobile', rate),
          internet: applyRate(rest, 'utilities_internet', rate),
        },
        entertainment: {
          fitness_club: applyRate(rest, 'sports_fitness_club', rate),
          tennis_court: applyRate(rest, 'sports_tennis_court', rate),
          cinema: applyRate(rest, 'sports_cinema', rate),
        },
        education: {
          preschool: applyRate(rest, 'childcare_preschool', rate),
          international_primary_school: applyRate(
            rest,
            'childcare_international_primary_school',
            rate,
          ),
        },
        clothing: {
          jeans: applyRate(rest, 'clothing_jeans', rate),
          summer_dress: applyRate(rest, 'clothing_summer_dress', rate),
          running_shoes: applyRate(rest, 'clothing_running_shoes', rate),
          business_shoes: applyRate(rest, 'clothing_business_shoes', rate),
        },
        housing: {
          rent_city_center_1_bedroom: applyRate(
            rest,
            'rent_in_city_centre_1_bedroom',
            rate,
          ),
          rent_city_center_3_bedrooms: applyRate(
            rest,
            'rent_in_city_centre_3_bedrooms',
            rate,
          ),
          rent_outside_of_center_1_bedroom: applyRate(
            rest,
            'rent_outside_of_center_1_bedroom',
            rate,
          ),
          rent_outside_of_center_3_bedrooms: applyRate(
            rest,
            'rent_outside_of_center_3_bedrooms',
            rate,
          ),
          buy_city_center: applyRate(
            rest,
            'buy_apartment_in_city_centre',
            rate,
          ),
          buy_outside_of_center: applyRate(
            rest,
            'buy_apartment_outside_of_centre',
            rate,
          ),
        },
        income: {
          average_monthly_net_salary: applyRate(
            rest,
            'salary_average_monthly_net_salary',
            rate,
          ),
        },
        mortgage: {
          interest_rate: applyRate(rest, 'salary_mortgage_interest_rate', rate),
        },
      },
      200,
    )
  },
)

placeRouter.get(
  INTELLIGENCE_API_SCHEMAS.place.queryGeneralInfo.route.path,
  describeRoute({
    description: 'Query general information for a place',
    responses: {
      200: {
        description: 'Place information retrieved successfully',
        content: {
          'application/json': {
            schema: resolver(
              INTELLIGENCE_API_SCHEMAS.place.queryGeneralInfo.responseData,
            ),
          },
        },
      },
    },
  }),
  queryValidator(INTELLIGENCE_API_SCHEMAS.place.queryGeneralInfo.query),
  auth({ isPlaceAPI: true }),
  async ctx => {
    const db = ctx.get('db')
    const { place_id } = ctx.req.valid('query')
    const data = await db
      .selectFrom('place')
      .selectAll()
      .where('id', '=', place_id)
      .executeTakeFirst()

    if (!data) {
      throw new APIError({
        code: API_ERROR_CODES.NOT_FOUND,
        message: 'Place not found',
        statusCode: 404,
      })
    }

    return apiSuccessResponse(
      INTELLIGENCE_API_SCHEMAS.place.queryGeneralInfo.responseData,
      {
        place_id: data.id,
        name: data.name,
        aliases: data.aliases,
        country_code: data.country_code,
        latitude: data.latitude,
        longitude: data.longitude,
        population: data.population,
        elevation: data.elevation,
      },
      200,
    )
  },
)

/**
 * OpenAPI
 */
placeRouter.get(
  INTELLIGENCE_API_ROUTES.place.openapi.path,
  openAPIRouteHandler(placeRouter, {
    documentation: {
      info: {
        title: 'Resettle Place API',
        version: '1.0.0',
        description: 'Resettle Place API',
      },
    },
  }),
)
