import { GLOBAL_API_SCHEMAS } from '@resettle/api/global'
import type {
  OccupationCode,
  OccupationCodeClassification,
} from '@resettle/schema/global'
import { queryValidator } from '@services/_common'
import { Hono } from 'hono'
import {
  API_ERROR_CODES,
  APIError,
  apiSuccessResponse,
} from '../../../../packages/@resettle/api/src/_common'

import {
  exactSearchOccupationCodes,
  fuzzySearchOccupationCodes,
  listOccupationCodes,
} from '../database/repositories'
import { getCrosswalkPairs } from '../libs/occupation'

export const occupationRouter = new Hono<{ Bindings: Cloudflare.Env }>()

occupationRouter.get(
  GLOBAL_API_SCHEMAS.occupation.crosswalk.route.path,
  queryValidator(GLOBAL_API_SCHEMAS.occupation.crosswalk.query),
  async ctx => {
    const db = ctx.get('db')
    const { from, to } = ctx.req.valid('query')

    const found = await db
      .selectFrom('occupation_code')
      .selectAll()
      .$if(typeof from === 'string', qb => qb.where('id', '=', from as string))
      .$if(typeof from !== 'string', qb =>
        qb
          .where(
            'classification',
            '=',
            (
              from as {
                classification: OccupationCodeClassification
                code: string
              }
            ).classification,
          )
          .where(
            'code',
            '=',
            (
              from as {
                classification: OccupationCodeClassification
                code: string
              }
            ).code,
          ),
      )
      .executeTakeFirst()

    if (!found) {
      throw new APIError({
        code: API_ERROR_CODES.NOT_FOUND,
        message: 'Occupation code not found',
        statusCode: 404,
      })
    }

    const path = getCrosswalkPairs(found.classification, to)

    let results: {
      id: string
      classification: OccupationCodeClassification
      code: string
      label: string
    }[] = [found]

    for (const pair of path) {
      results = await db
        .selectFrom('occupation_code_crosswalk')
        .innerJoin(
          'occupation_code as source',
          'source.id',
          'occupation_code_crosswalk.source_id',
        )
        .innerJoin(
          'occupation_code as target',
          'target.id',
          'occupation_code_crosswalk.target_id',
        )
        .selectAll('target')
        .where('source.classification', '=', pair[0])
        .where('target.classification', '=', pair[1])
        .where(
          'source.code',
          'in',
          results.map(r => r.code),
        )
        .execute()
    }
    return apiSuccessResponse(
      GLOBAL_API_SCHEMAS.occupation.crosswalk.responseData,
      results,
      200,
    )
  },
)

occupationRouter.get(
  GLOBAL_API_SCHEMAS.occupation.query.route.path,
  queryValidator(GLOBAL_API_SCHEMAS.occupation.query.query),
  async ctx => {
    const db = ctx.get('db')
    const {
      classification,
      code,
      cursor = null,
      limit = 100,
    } = ctx.req.valid('query')

    const results = await listOccupationCodes(db, {
      limit,
      cursor,
      orderByDirection: 'desc',
      orderBy: 'id',
      where: { classification, code },
    })

    return apiSuccessResponse(
      GLOBAL_API_SCHEMAS.occupation.query.responseData,
      results,
      200,
    )
  },
)

occupationRouter.get(
  GLOBAL_API_SCHEMAS.occupation.search.route.path,
  queryValidator(GLOBAL_API_SCHEMAS.occupation.search.query),
  async ctx => {
    const db = ctx.get('db')
    const { q, classification, fuzzy, limit = 100 } = ctx.req.valid('query')

    let results: OccupationCode[]

    if (!fuzzy) {
      results = await exactSearchOccupationCodes(db, {
        limit,
        orderByDirection: 'desc',
        orderBy: 'id',
        where: { q, classification },
      })
    } else {
      results = await fuzzySearchOccupationCodes(db, {
        limit,
        orderByDirection: 'desc',
        where: { q, classification },
      })
    }

    return apiSuccessResponse(
      GLOBAL_API_SCHEMAS.occupation.search.responseData,
      results,
      200,
    )
  },
)
