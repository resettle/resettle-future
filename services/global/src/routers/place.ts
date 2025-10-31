import { API_ERROR_CODES, APIError, apiSuccessResponse } from '@resettle/api'
import { GLOBAL_API_SCHEMAS } from '@resettle/api/global'
import type {
  CostOfLivingDataResponse,
  PlaceScope,
} from '@resettle/schema/global'
import { queryValidator } from '@services/_common'
import { Hono } from 'hono'

import { searchPlaces } from '../database/repositories'

export const placeRouter = new Hono<{ Bindings: Cloudflare.Env }>()

placeRouter.get(
  GLOBAL_API_SCHEMAS.place.search.route.path,
  queryValidator(GLOBAL_API_SCHEMAS.place.search.query),
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
      GLOBAL_API_SCHEMAS.place.search.responseData,
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
  GLOBAL_API_SCHEMAS.place.queryCostOfLiving.route.path,
  queryValidator(GLOBAL_API_SCHEMAS.place.queryCostOfLiving.query),
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

    return apiSuccessResponse(
      GLOBAL_API_SCHEMAS.place.queryCostOfLiving.responseData,
      data.map(d => {
        const { created_at, currency_code, place_id, ...rest } = d

        return {
          ...(Object.fromEntries(
            Object.entries(rest).map(([key, value]) => [
              key,
              value === null ? null : value * rate,
            ]),
          ) as unknown as Omit<CostOfLivingDataResponse, 'currency_code'>),
          currency_code,
        }
      })[0],
      200,
    )
  },
)

placeRouter.get(
  GLOBAL_API_SCHEMAS.place.queryGeneralInfo.route.path,
  queryValidator(GLOBAL_API_SCHEMAS.place.queryGeneralInfo.query),
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
      GLOBAL_API_SCHEMAS.place.queryGeneralInfo.responseData,
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
