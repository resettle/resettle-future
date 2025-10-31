import { API_ERROR_CODES, APIError } from '@resettle/api'
import type { UserAuth, UserRole } from '@resettle/schema/app'
import { env } from 'hono/adapter'
import { bearerAuth } from 'hono/bearer-auth'

import { verifyJWT } from '../libs/jwt'

declare module 'hono' {
  interface ContextVariableMap {
    isInternalCall: boolean
    user: UserAuth
  }
}

export interface AuthOptions {
  allowInternalCall?: boolean
  roles?: UserRole[]
}

/**
 * Auth middleware
 * @param options - The options
 * @returns The middleware
 */
export const auth = (options: AuthOptions = {}) => {
  return bearerAuth({
    async verifyToken(token, ctx) {
      const { RESETTLE_INTERNAL_API_TOKEN, JWT_SECRET, JWT_SECRET_PREVIOUS } =
        env<typeof process.env>(ctx)

      if (options.allowInternalCall && token === RESETTLE_INTERNAL_API_TOKEN) {
        ctx.set('isInternalCall', true)
        return true
      }

      let user: UserAuth

      try {
        user = await verifyJWT<UserAuth>(token, [
          JWT_SECRET,
          JWT_SECRET_PREVIOUS,
        ])
      } catch {
        throw new APIError({
          code: API_ERROR_CODES.UNAUTHORIZED,
          message: 'Unauthorized: Invalid JWT token',
          statusCode: 401,
        })
      }

      ctx.set('user', user)

      if (options.roles) {
        if (!options.roles.includes(user.role)) {
          throw new APIError({
            code: API_ERROR_CODES.FORBIDDEN,
            message: 'Forbidden: User does not have the required role',
            statusCode: 403,
          })
        }
      }

      return true
    },
  })
}
