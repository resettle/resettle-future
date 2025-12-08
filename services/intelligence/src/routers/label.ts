import { apiSuccessResponse } from '@resettle/api'
import { INTELLIGENCE_API_SCHEMAS } from '@resettle/api/intelligence'
import { createLabels, deleteLabels } from '@resettle/database/intelligence'
import { jsonValidator } from '@services/_common'
import { Hono } from 'hono'
import { describeRoute, resolver } from 'hono-openapi'

const DUMMY_TENANT_ID = '00000000-0000-0000-0000-000000000000'

export const labelRouter = new Hono<{ Bindings: Cloudflare.Env }>()

labelRouter.post(
  INTELLIGENCE_API_SCHEMAS.label.createLabels.route.path,
  describeRoute({
    description: 'Create labels',
    responses: {
      200: {
        description: 'Labels created successfully',
        content: {
          'application/json': {
            schema: resolver(INTELLIGENCE_API_SCHEMAS.label.createLabels.responseData),
          },
        },
      },
    },
  }),
  jsonValidator(INTELLIGENCE_API_SCHEMAS.label.createLabels.body),
  async ctx => {
    const db = ctx.get('db')
    const body = ctx.req.valid('json')

    const results = await db.transaction().execute(async tx => {
      return await createLabels(tx, DUMMY_TENANT_ID, body)
    })

    return apiSuccessResponse(
      INTELLIGENCE_API_SCHEMAS.label.createLabels.responseData,
      results,
      200,
    )
  },
)

labelRouter.post(
  INTELLIGENCE_API_SCHEMAS.label.deleteLabels.route.path,
  describeRoute({
    description: 'Delete labels',
    responses: {
      200: {
        description: 'Labels deleted successfully',
        content: {
          'application/json': {
            schema: resolver(INTELLIGENCE_API_SCHEMAS.label.deleteLabels.responseData),
          },
        },
      },
    },
  }),
  jsonValidator(INTELLIGENCE_API_SCHEMAS.label.deleteLabels.body),
  async ctx => {
    const db = ctx.get('db')
    const body = ctx.req.valid('json')

    const results = await db.transaction().execute(async tx => {
      return await deleteLabels(tx, DUMMY_TENANT_ID, body)
    })

    return apiSuccessResponse(
      INTELLIGENCE_API_SCHEMAS.label.deleteLabels.responseData,
      results.map(r => ({
        user_id: r.user_id,
        opportunity_id: r.opportunity_id,
        name: r.name,
      })),
      200,
    )
  },
)
