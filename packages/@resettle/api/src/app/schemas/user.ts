import {
  emailOptionalSchema,
  stringBoolOptionalSchema,
  stringOptionalSchema,
  uuidOptionalSchema,
  uuidSchema,
} from '@resettle/schema'
import {
  userMetadataSchema,
  userProfileSchema,
  userResponseSchema,
  userRoleSchema,
  userSchema,
  type UserResponse,
} from '@resettle/schema/app'
import { safeParseDate } from '@resettle/utils'
import { z } from 'zod'

import { defineAPISchema, getOffsetPaginationSchema } from '../../_common'
import { APP_API_ROUTES } from '../routes'

const transformUserResponse = (user: UserResponse) => {
  user.profile.date_of_birth = safeParseDate(user.profile.date_of_birth)
  user.profile.education_experiences?.forEach(e => {
    e.start_date = safeParseDate(e.start_date)
    e.end_date = safeParseDate(e.end_date)
  })
  user.profile.work_experiences?.forEach(e => {
    e.start_date = safeParseDate(e.start_date)
    e.end_date = safeParseDate(e.end_date)
  })
  user.created_at = safeParseDate(user.created_at)
  user.updated_at = safeParseDate(user.updated_at)
  return user
}

export const getUsers = defineAPISchema({
  method: 'GET',
  route: APP_API_ROUTES.users,
  query: z.looseObject({
    limit: z.coerce.number().int().min(1).max(100).optional(),
    page: z.coerce.number().int().min(1).optional(),
    order_by: z.enum(['id', 'created_at', 'updated_at']).optional(),
    order_by_direction: z.enum(['asc', 'desc']).optional(),
    id: uuidOptionalSchema,
    email: emailOptionalSchema,
    username: stringOptionalSchema,
    role: userRoleSchema.optional(),
    is_deleted: stringBoolOptionalSchema,
  }),
  responseData: getOffsetPaginationSchema(
    userResponseSchema,
    z.enum(['id', 'created_at', 'updated_at']),
  ),
  transform: rawResponse => {
    return {
      ...rawResponse,
      data: rawResponse.data.map(transformUserResponse),
    }
  },
})

export const getUserById = defineAPISchema({
  method: 'GET',
  route: APP_API_ROUTES.users.id,
  params: z.object({
    userId: z.uuid(),
  }),
  query: z.looseObject({}),
  responseData: userResponseSchema,
  transform: transformUserResponse,
})

export const updateUserById = defineAPISchema({
  method: 'PATCH',
  route: APP_API_ROUTES.users.id,
  params: z.object({
    userId: z.uuid(),
  }),
  body: userSchema
    .omit({
      id: true,
      created_at: true,
      updated_at: true,
      deleted_at: true,
    })
    .partial(),
  responseData: userResponseSchema,
  transform: transformUserResponse,
})

export const updateUserUsernameById = defineAPISchema({
  method: 'PUT',
  route: APP_API_ROUTES.users.id.username,
  params: z.object({
    userId: z.uuid(),
  }),
  body: z.object({
    username: z.string().min(1),
  }),
  responseData: userResponseSchema,
})

export const updateUserProfileById = defineAPISchema({
  method: 'PATCH',
  route: APP_API_ROUTES.users.id.profile,
  params: z.object({
    userId: uuidSchema,
  }),
  body: z.object({
    profile: userProfileSchema.partial(),
  }),
  responseData: userResponseSchema,
  transform: transformUserResponse,
})

export const updateUserMetadataById = defineAPISchema({
  method: 'PATCH',
  route: APP_API_ROUTES.users.id.metadata,
  params: z.object({
    userId: uuidSchema,
  }),
  body: z.object({
    metadata: userMetadataSchema.partial(),
  }),
  responseData: userResponseSchema,
})
