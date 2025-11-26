import { apiSuccessResponse } from '@resettle/api'
import { GLOBAL_API_SCHEMAS } from '@resettle/api/global'
import { assignTags, searchTags } from '@resettle/database/global'
import { jsonValidator, queryValidator } from '@services/_common'
import { Hono } from 'hono'

const DUMMY_TENANT_ID = '00000000-0000-0000-0000-000000000000'

export const tagRouter = new Hono<{ Bindings: Cloudflare.Env }>()

tagRouter.get(
  GLOBAL_API_SCHEMAS.tag.search.route.path,
  queryValidator(GLOBAL_API_SCHEMAS.tag.search.query),
  async ctx => {
    const db = ctx.get('db')
    const { q, fuzzy, namespace, limit = 100 } = ctx.req.valid('query')

    const results = await searchTags(db, {
      limit,
      orderByDirection: 'desc',
      where: { q, fuzzy, namespace },
    })

    return apiSuccessResponse(
      GLOBAL_API_SCHEMAS.tag.search.responseData,
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
  GLOBAL_API_SCHEMAS.tag.assign.route.path,
  jsonValidator(GLOBAL_API_SCHEMAS.tag.assign.body),
  async ctx => {
    const db = ctx.get('db')
    const body = ctx.req.valid('json')

    const results = await db.transaction().execute(async tx => {
      return await assignTags(tx, DUMMY_TENANT_ID, body)
    })

    return apiSuccessResponse(
      GLOBAL_API_SCHEMAS.tag.assign.responseData,
      results.map(r => ({
        user_id: r.user_id,
        tag_id: r.tag_template_id,
        created_at: r.created_at,
        updated_at: r.updated_at,
      })),
      200,
    )
  },
)
