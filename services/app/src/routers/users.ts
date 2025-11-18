import { API_ERROR_CODES, APIError, apiSuccessResponse } from '@resettle/api'
import { APP_API_SCHEMAS } from '@resettle/api/app'
import {
  getUserBy,
  getUserById,
  getUsersWithOffsetPagination,
  updateUserById,
  updateUserMetadataById,
  updateUserProfileById,
} from '@resettle/database/app'
import type { User, UserResponse } from '@resettle/schema/app'
import {
  jsonValidator,
  paramValidator,
  queryValidator,
} from '@services/_common'
import { Hono } from 'hono'

/**
 * Converts a user to a user response
 * @param user - The user to convert
 * @returns The user response
 */
const toUserResponse = (user: User): UserResponse => {
  return {
    id: user.id,
    username: user.username,
    profile: user.profile,
    created_at: user.created_at,
    updated_at: user.updated_at,
  }
}

export const usersRouter = new Hono<{ Bindings: Cloudflare.Env }>()

usersRouter.get(
  APP_API_SCHEMAS.user.getUsers.route.path,
  queryValidator(APP_API_SCHEMAS.user.getUsers.query),
  async ctx => {
    const db = ctx.get('db')
    const {
      limit = 10,
      page = 1,
      order_by = 'created_at',
      order_by_direction = 'desc',
      ...where
    } = ctx.req.valid('query')

    const users = await getUsersWithOffsetPagination(db, {
      limit,
      page,
      orderBy: order_by,
      orderByDirection: order_by_direction,
      where,
    })

    return apiSuccessResponse(
      APP_API_SCHEMAS.user.getUsers.responseData,
      {
        ...users,
        data: users.data.map(toUserResponse),
      },
      200,
    )
  },
)

usersRouter.get(
  APP_API_SCHEMAS.user.getUserById.route.path,
  paramValidator(['userId'] as const, APP_API_SCHEMAS.user.getUserById.params!),
  queryValidator(APP_API_SCHEMAS.user.getUserById.query),
  async ctx => {
    const db = ctx.get('db')
    const { userId } = ctx.req.valid('param')

    const user = await getUserById(db, userId)

    if (!user) {
      throw new APIError({
        statusCode: 404,
        code: API_ERROR_CODES.NOT_FOUND,
        message: 'User not found',
      })
    }

    return apiSuccessResponse(
      APP_API_SCHEMAS.user.getUserById.responseData,
      toUserResponse(user),
      200,
    )
  },
)

usersRouter.patch(
  APP_API_SCHEMAS.user.updateUserById.route.path,
  paramValidator(
    ['userId'] as const,
    APP_API_SCHEMAS.user.updateUserById.params!,
  ),
  jsonValidator(APP_API_SCHEMAS.user.updateUserById.body),
  async ctx => {
    const db = ctx.get('db')
    const { userId } = ctx.req.valid('param')
    const updates = ctx.req.valid('json')

    const user = await updateUserById(db, userId, updates)

    if (!user) {
      throw new APIError({
        statusCode: 404,
        code: API_ERROR_CODES.NOT_FOUND,
        message: 'User not found',
      })
    }

    return apiSuccessResponse(
      APP_API_SCHEMAS.user.updateUserById.responseData,
      toUserResponse(user),
      200,
    )
  },
)

usersRouter.put(
  APP_API_SCHEMAS.user.updateUserUsernameById.route.path,
  paramValidator(
    ['userId'] as const,
    APP_API_SCHEMAS.user.updateUserUsernameById.params!,
  ),
  jsonValidator(APP_API_SCHEMAS.user.updateUserUsernameById.body),
  async ctx => {
    const db = ctx.get('db')
    const { userId } = ctx.req.valid('param')
    const { username } = ctx.req.valid('json')

    const existingUser = await getUserBy(db, { username })

    if (existingUser && existingUser.id !== userId) {
      throw new APIError({
        code: API_ERROR_CODES.USER_USERNAME_ALREADY_EXISTS,
        message: 'Username is already taken',
        statusCode: 409,
      })
    }

    const user = await updateUserById(db, userId, { username })

    if (!user) {
      throw new APIError({
        statusCode: 404,
        code: API_ERROR_CODES.USER_NOT_FOUND,
        message: 'User not found',
      })
    }

    return apiSuccessResponse(
      APP_API_SCHEMAS.user.updateUserUsernameById.responseData,
      toUserResponse(user),
      200,
    )
  },
)

usersRouter.patch(
  APP_API_SCHEMAS.user.updateUserProfileById.route.path,
  paramValidator(
    ['userId'] as const,
    APP_API_SCHEMAS.user.updateUserProfileById.params!,
  ),
  jsonValidator(APP_API_SCHEMAS.user.updateUserProfileById.body),
  async ctx => {
    const db = ctx.get('db')
    const { userId } = ctx.req.valid('param')
    const { profile } = ctx.req.valid('json')

    const user = await updateUserProfileById(db, userId, profile)

    if (!user) {
      throw new APIError({
        statusCode: 404,
        code: API_ERROR_CODES.USER_NOT_FOUND,
        message: 'User not found',
      })
    }

    return apiSuccessResponse(
      APP_API_SCHEMAS.user.updateUserProfileById.responseData,
      toUserResponse(user),
      200,
    )
  },
)

usersRouter.patch(
  APP_API_SCHEMAS.user.updateUserMetadataById.route.path,
  paramValidator(
    ['userId'] as const,
    APP_API_SCHEMAS.user.updateUserMetadataById.params!,
  ),
  jsonValidator(APP_API_SCHEMAS.user.updateUserMetadataById.body),
  async ctx => {
    const db = ctx.get('db')
    const { userId } = ctx.req.valid('param')
    const { metadata } = ctx.req.valid('json')

    const user = await updateUserMetadataById(db, userId, metadata)

    if (!user) {
      throw new APIError({
        statusCode: 404,
        code: API_ERROR_CODES.USER_NOT_FOUND,
        message: 'User not found',
      })
    }

    return apiSuccessResponse(
      APP_API_SCHEMAS.user.updateUserMetadataById.responseData,
      toUserResponse(user),
      200,
    )
  },
)
