import { API_ERROR_CODES, APIError, apiSuccessResponse } from '@resettle/api'
import { INTELLIGENCE_API_SCHEMAS } from '@resettle/api/intelligence'
import { jsonValidator } from '@services/_common'
import { Hono } from 'hono'
import { describeRoute, resolver } from 'hono-openapi'

import {
  getRecommendationByTags,
  getRecommendationByUser,
} from '../libs/recommend'

const DUMMY_TENANT_ID = '00000000-0000-0000-0000-000000000000'

export const recommendRouter = new Hono<{ Bindings: Cloudflare.Env }>()

recommendRouter.post(
  INTELLIGENCE_API_SCHEMAS.recommend.recommendByUser.route.path,
  describeRoute({
    description: 'Get recommendations by user',
    responses: {
      200: {
        description: 'Recommendations retrieved successfully',
        content: {
          'application/json': {
            schema: resolver(INTELLIGENCE_API_SCHEMAS.recommend.recommendByUser.responseData),
          },
        },
      },
    },
  }),
  jsonValidator(INTELLIGENCE_API_SCHEMAS.recommend.recommendByUser.body),
  async ctx => {
    const db = ctx.get('db')
    const { types = [], user_id, limit = 100 } = ctx.req.valid('json')

    const results = await db.transaction().execute(async tx => {
      return await getRecommendationByUser(
        tx,
        DUMMY_TENANT_ID,
        user_id,
        types,
        limit,
      )
    })

    if (!results) {
      throw new APIError({
        statusCode: 404,
        code: API_ERROR_CODES.NOT_FOUND,
        message: 'User not found',
      })
    }

    return apiSuccessResponse(
      INTELLIGENCE_API_SCHEMAS.recommend.recommendByUser.responseData,
      results as any,
      200,
    )
  },
)

recommendRouter.post(
  INTELLIGENCE_API_SCHEMAS.recommend.recommendByTags.route.path,
  describeRoute({
    description: 'Get recommendations by tags',
    responses: {
      200: {
        description: 'Recommendations retrieved successfully',
        content: {
          'application/json': {
            schema: resolver(INTELLIGENCE_API_SCHEMAS.recommend.recommendByTags.responseData),
          },
        },
      },
    },
  }),
  jsonValidator(INTELLIGENCE_API_SCHEMAS.recommend.recommendByTags.body),
  async ctx => {
    const db = ctx.get('db')
    const { types = [], tags, limit = 100 } = ctx.req.valid('json')

    const results = await db.transaction().execute(async tx => {
      return await getRecommendationByTags(
        tx,
        DUMMY_TENANT_ID,
        tags,
        types,
        limit,
      )
    })

    return apiSuccessResponse(
      INTELLIGENCE_API_SCHEMAS.recommend.recommendByTags.responseData,
      results,
      200,
    )
  },
)
