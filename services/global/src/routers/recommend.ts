import { apiSuccessResponse } from '@resettle/api'
import { GLOBAL_API_SCHEMAS } from '@resettle/api/global'
import { jsonValidator } from '@services/_common'
import { Hono } from 'hono'

import {
  getRecommendationByTags,
  getRecommendationByUser,
} from '../libs/recommend'

const DUMMY_TENANT_ID = '00000000-0000-0000-0000-000000000000'

export const recommendRouter = new Hono<{ Bindings: Cloudflare.Env }>()

recommendRouter.post(
  GLOBAL_API_SCHEMAS.recommend.recommendByUser.route.path,
  jsonValidator(GLOBAL_API_SCHEMAS.recommend.recommendByUser.body),
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

    return apiSuccessResponse(
      GLOBAL_API_SCHEMAS.recommend.recommendByUser.responseData,
      results as any,
      200,
    )
  },
)

recommendRouter.post(
  GLOBAL_API_SCHEMAS.recommend.recommendByTags.route.path,
  jsonValidator(GLOBAL_API_SCHEMAS.recommend.recommendByTags.body),
  async ctx => {
    const db = ctx.get('db')
    const { types = [], tags, limit = 100 } = ctx.req.valid('json')

    const results = await db.transaction().execute(async tx => {
      return await getRecommendationByTags(tx, tags, types, limit)
    })

    return apiSuccessResponse(
      GLOBAL_API_SCHEMAS.recommend.recommendByTags.responseData,
      results as any,
      200,
    )
  },
)
