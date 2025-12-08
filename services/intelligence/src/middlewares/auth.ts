import { API_ERROR_CODES, APIError } from '@resettle/api'
import type { MiddlewareHandler } from 'hono'
import { env } from 'hono/adapter'

const RAPID_API_KEY_HEADER = 'X-RapidAPI-Proxy-Secret'

export interface AuthOptions {
  isPlaceAPI?: boolean
  isOccupationAPI?: boolean
}

/**
 * Auth middleware
 * @returns The middleware
 */
export const auth = (
  options: AuthOptions = {},
): MiddlewareHandler<{ Bindings: Cloudflare.Env }> => {
  return async (ctx, next) => {
    const {
      RESETTLE_INTERNAL_API_TOKEN,
      RAPID_API_PLACE_SECRET,
      RAPID_API_OCCUPATION_SECRET,
    } = env(ctx)

    if (
      ctx.req.header('Authorization') ===
      `Bearer ${RESETTLE_INTERNAL_API_TOKEN}`
    ) {
      return next()
    }

    if (options.isPlaceAPI) {
      const rapidAPISecret = ctx.req.header(RAPID_API_KEY_HEADER)

      if (rapidAPISecret !== RAPID_API_PLACE_SECRET) {
        throw new APIError({
          code: API_ERROR_CODES.UNAUTHORIZED,
          message: 'Unauthorized: Invalid token',
          statusCode: 401,
        })
      }
    }

    if (options.isOccupationAPI) {
      const rapidAPISecret = ctx.req.header(RAPID_API_KEY_HEADER)

      if (rapidAPISecret !== RAPID_API_OCCUPATION_SECRET) {
        throw new APIError({
          code: API_ERROR_CODES.UNAUTHORIZED,
          message: 'Unauthorized: Invalid token',
          statusCode: 401,
        })
      }
    }

    return next()
  }
}
