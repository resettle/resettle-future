import { API_ERROR_CODES, APIError, apiSuccessResponse } from '@resettle/api'
import { INTELLIGENCE_API_SCHEMAS } from '@resettle/api/intelligence'
import {
  createUsers,
  deleteUsers,
  readUser,
  updateUsers,
} from '@resettle/database/intelligence'
import { jsonValidator, queryValidator } from '@services/_common'
import { Hono } from 'hono'

const DUMMY_TENANT_ID = '00000000-0000-0000-0000-000000000000'

// TODO: Replace dummy tenant id with middleware.
export const userRouter = new Hono<{ Bindings: Cloudflare.Env }>()

userRouter.post(
  INTELLIGENCE_API_SCHEMAS.user.createUsers.route.path,
  jsonValidator(INTELLIGENCE_API_SCHEMAS.user.createUsers.body),
  async ctx => {
    const db = ctx.get('db')
    const results = await createUsers(
      db,
      DUMMY_TENANT_ID,
      ctx.req.valid('json'),
    )

    return apiSuccessResponse(
      INTELLIGENCE_API_SCHEMAS.user.createUsers.responseData,
      results.map(r => ({
        id: r.id,
        username: r.username,
        metadata: r.metadata,
        created_at: r.created_at,
        updated_at: r.updated_at,
      })),
      200,
    )
  },
)

userRouter.patch(
  INTELLIGENCE_API_SCHEMAS.user.updateUsers.route.path,
  jsonValidator(INTELLIGENCE_API_SCHEMAS.user.updateUsers.body),
  async ctx => {
    const db = ctx.get('db')
    const results = await db.transaction().execute(async tx => {
      return await updateUsers(tx, DUMMY_TENANT_ID, ctx.req.valid('json'))
    })

    return apiSuccessResponse(
      INTELLIGENCE_API_SCHEMAS.user.updateUsers.responseData,
      results.map(r => ({
        id: r.id,
        username: r.username,
        metadata: r.metadata,
        created_at: r.created_at,
        updated_at: r.updated_at,
      })),
      200,
    )
  },
)

userRouter.post(
  INTELLIGENCE_API_SCHEMAS.user.deleteUsers.route.path,
  jsonValidator(INTELLIGENCE_API_SCHEMAS.user.deleteUsers.body),
  async ctx => {
    const db = ctx.get('db')
    const results = await db.transaction().execute(async tx => {
      return await deleteUsers(
        tx,
        DUMMY_TENANT_ID,
        ctx.req.valid('json').map(u => u.user_id),
      )
    })

    return apiSuccessResponse(
      INTELLIGENCE_API_SCHEMAS.user.deleteUsers.responseData,
      results,
      200,
    )
  },
)

userRouter.get(
  INTELLIGENCE_API_SCHEMAS.user.readUser.route.path,
  queryValidator(INTELLIGENCE_API_SCHEMAS.user.readUser.query),
  async ctx => {
    const db = ctx.get('db')
    const { user_id } = ctx.req.valid('query')

    const result = await readUser(db, DUMMY_TENANT_ID, user_id)

    if (!result) {
      throw new APIError({
        code: API_ERROR_CODES.NOT_FOUND,
        message: 'User not found',
        statusCode: 404,
      })
    }

    return apiSuccessResponse(
      INTELLIGENCE_API_SCHEMAS.user.readUser.responseData,
      {
        id: result.id,
        username: result.username,
        metadata: result.metadata,
        created_at: result.created_at,
        updated_at: result.updated_at,
      },
      200,
    )
  },
)
