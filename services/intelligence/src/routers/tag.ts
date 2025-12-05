import { apiSuccessResponse } from '@resettle/api'
import { INTELLIGENCE_API_SCHEMAS } from '@resettle/api/intelligence'
import { attachTags, detachTags, searchTags } from '@resettle/database/intelligence'
import { jsonValidator, queryValidator } from '@services/_common'
import { Hono } from 'hono'

const DUMMY_TENANT_ID = '00000000-0000-0000-0000-000000000000'

export const tagRouter = new Hono<{ Bindings: Cloudflare.Env }>()

tagRouter.get(
  INTELLIGENCE_API_SCHEMAS.tag.search.route.path,
  queryValidator(INTELLIGENCE_API_SCHEMAS.tag.search.query),
  async ctx => {
    const db = ctx.get('db')
    const { q, fuzzy, namespace, limit = 100 } = ctx.req.valid('query')

    const results = await searchTags(db, {
      limit,
      orderByDirection: 'desc',
      where: { q, fuzzy, namespace },
    })

    return apiSuccessResponse(
      INTELLIGENCE_API_SCHEMAS.tag.search.responseData,
      results.map(r => ({
        id: r.id,
        slug: r.slug,
        name: r.name,
        namespace: r.namespace,
        metadata: r.metadata,
      })),
      200,
    )
  },
)

tagRouter.post(
  INTELLIGENCE_API_SCHEMAS.tag.attach.route.path,
  jsonValidator(INTELLIGENCE_API_SCHEMAS.tag.attach.body),
  async ctx => {
    const db = ctx.get('db')
    const body = ctx.req.valid('json')

    const results = await db.transaction().execute(async tx => {
      return await attachTags(tx, DUMMY_TENANT_ID, body)
    })

    return apiSuccessResponse(
      INTELLIGENCE_API_SCHEMAS.tag.attach.responseData,
      results,
      200,
    )
  },
)

tagRouter.post(
  INTELLIGENCE_API_SCHEMAS.tag.detach.route.path,
  jsonValidator(INTELLIGENCE_API_SCHEMAS.tag.detach.body),
  async ctx => {
    const db = ctx.get('db')
    const body = ctx.req.valid('json')

    const results = await db.transaction().execute(async tx => {
      return await detachTags(tx, DUMMY_TENANT_ID, body)
    })

    return apiSuccessResponse(
      INTELLIGENCE_API_SCHEMAS.tag.detach.responseData,
      results,
      200,
    )
  },
)
