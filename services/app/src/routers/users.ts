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
  auth,
  jsonValidator,
  paramValidator,
  queryValidator,
} from '@services/_common'
import { Hono } from 'hono'
import { describeRoute, resolver } from 'hono-openapi'

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
  describeRoute({
    description: 'Get users with pagination (admin/mod only)',
    responses: {
      200: {
        description: 'Users retrieved successfully',
        content: {
          'application/json': {
            schema: resolver(APP_API_SCHEMAS.user.getUsers.responseData),
          },
        },
      },
    },
  }),
  queryValidator(APP_API_SCHEMAS.user.getUsers.query),
  auth({
    roles: ['admin', 'mod'],
  }),
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
  describeRoute({
    description: 'Get user by ID',
    responses: {
      200: {
        description: 'User retrieved successfully',
        content: {
          'application/json': {
            schema: resolver(APP_API_SCHEMAS.user.getUserById.responseData),
          },
        },
      },
    },
  }),
  paramValidator(
    APP_API_SCHEMAS.user.getUserById.route.params,
    APP_API_SCHEMAS.user.getUserById.params,
  ),
  queryValidator(APP_API_SCHEMAS.user.getUserById.query),
  auth(),
  async ctx => {
    const currentUser = ctx.get('user')
    const db = ctx.get('db')

    const { userId } = ctx.req.valid('param')

    if (
      currentUser.role !== 'admin' &&
      currentUser.role !== 'mod' &&
      currentUser.id !== userId
    ) {
      throw new APIError({
        statusCode: 403,
        code: API_ERROR_CODES.FORBIDDEN,
        message: 'Forbidden: You are not allowed to access this user',
      })
    }

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
  describeRoute({
    description: 'Update user by ID',
    responses: {
      200: {
        description: 'User updated successfully',
        content: {
          'application/json': {
            schema: resolver(APP_API_SCHEMAS.user.updateUserById.responseData),
          },
        },
      },
    },
  }),
  paramValidator(
    APP_API_SCHEMAS.user.updateUserById.route.params,
    APP_API_SCHEMAS.user.updateUserById.params,
  ),
  jsonValidator(APP_API_SCHEMAS.user.updateUserById.body),
  auth(),
  async ctx => {
    const currentUser = ctx.get('user')
    const db = ctx.get('db')

    const { userId } = ctx.req.valid('param')
    const updates = ctx.req.valid('json')

    if (
      currentUser.role !== 'admin' &&
      currentUser.role !== 'mod' &&
      currentUser.id !== userId
    ) {
      throw new APIError({
        statusCode: 403,
        code: API_ERROR_CODES.FORBIDDEN,
        message: 'Forbidden: You are not allowed to update this user',
      })
    }

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
  describeRoute({
    description: 'Update user username by ID',
    responses: {
      200: {
        description: 'Username updated successfully',
        content: {
          'application/json': {
            schema: resolver(APP_API_SCHEMAS.user.updateUserUsernameById.responseData),
          },
        },
      },
    },
  }),
  paramValidator(
    APP_API_SCHEMAS.user.updateUserUsernameById.route.params,
    APP_API_SCHEMAS.user.updateUserUsernameById.params,
  ),
  jsonValidator(APP_API_SCHEMAS.user.updateUserUsernameById.body),
  auth(),
  async ctx => {
    const currentUser = ctx.get('user')
    const db = ctx.get('db')

    const { userId } = ctx.req.valid('param')
    const { username } = ctx.req.valid('json')

    if (
      currentUser.role !== 'admin' &&
      currentUser.role !== 'mod' &&
      currentUser.id !== userId
    ) {
      throw new APIError({
        statusCode: 403,
        code: API_ERROR_CODES.FORBIDDEN,
        message: 'Forbidden: You are not allowed to update this user',
      })
    }

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
  describeRoute({
    description: 'Update user profile by ID',
    responses: {
      200: {
        description: 'User profile updated successfully',
        content: {
          'application/json': {
            schema: resolver(APP_API_SCHEMAS.user.updateUserProfileById.responseData),
          },
        },
      },
    },
  }),
  paramValidator(
    APP_API_SCHEMAS.user.updateUserProfileById.route.params,
    APP_API_SCHEMAS.user.updateUserProfileById.params,
  ),
  jsonValidator(APP_API_SCHEMAS.user.updateUserProfileById.body),
  auth(),
  async ctx => {
    const currentUser = ctx.get('user')
    const db = ctx.get('db')

    const { userId } = ctx.req.valid('param')
    const { profile } = ctx.req.valid('json')

    if (
      currentUser.role !== 'admin' &&
      currentUser.role !== 'mod' &&
      currentUser.id !== userId
    ) {
      throw new APIError({
        statusCode: 403,
        code: API_ERROR_CODES.FORBIDDEN,
        message: 'Forbidden: You are not allowed to update this user',
      })
    }

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
  describeRoute({
    description: 'Update user metadata by ID',
    responses: {
      200: {
        description: 'User metadata updated successfully',
        content: {
          'application/json': {
            schema: resolver(APP_API_SCHEMAS.user.updateUserMetadataById.responseData),
          },
        },
      },
    },
  }),
  paramValidator(
    APP_API_SCHEMAS.user.updateUserMetadataById.route.params,
    APP_API_SCHEMAS.user.updateUserMetadataById.params,
  ),
  jsonValidator(APP_API_SCHEMAS.user.updateUserMetadataById.body),
  auth(),
  async ctx => {
    const currentUser = ctx.get('user')
    const db = ctx.get('db')

    const { userId } = ctx.req.valid('param')
    const { metadata } = ctx.req.valid('json')

    if (
      currentUser.role !== 'admin' &&
      currentUser.role !== 'mod' &&
      currentUser.id !== userId
    ) {
      throw new APIError({
        statusCode: 403,
        code: API_ERROR_CODES.FORBIDDEN,
        message: 'Forbidden: You are not allowed to update this user',
      })
    }

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
