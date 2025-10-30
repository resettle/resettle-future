import type { Context, Next } from 'hono'
import { env } from 'hono/adapter'
import {
  API_ERROR_CODES,
  APIError,
} from '../../../../packages/@resettle/api/src/_common'

const HEADER_NAME = 'x-turnstile-token'

interface TurnstileVerificationResponse {
  success: boolean
  'error-codes'?: string[]
  challenge_ts?: string
  hostname?: string
  action?: string
  cdata?: string
}

/**
 * Turnstile middleware
 * @returns The middleware
 */
export const turnstile = () => {
  return async (ctx: Context, next: Next) => {
    const token = ctx.req.header(HEADER_NAME)

    if (!token) {
      throw new APIError({
        code: API_ERROR_CODES.VALIDATION_ERROR,
        message: 'Turnstile token is required',
        statusCode: 400,
      })
    }

    const { TURNSTILE_SECRET_KEY } = env<typeof process.env>(ctx)

    if (!TURNSTILE_SECRET_KEY) {
      throw new APIError({
        code: API_ERROR_CODES.VALIDATION_ERROR,
        message: 'Turnstile secret key is not configured',
        statusCode: 500,
      })
    }

    let response: Response

    try {
      response = await fetch(
        'https://challenges.cloudflare.com/turnstile/v0/siteverify',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            secret: TURNSTILE_SECRET_KEY,
            response: token,
          }),
        },
      )
    } catch (error) {
      throw new APIError({
        code: API_ERROR_CODES.VALIDATION_ERROR,
        message: 'Failed to verify Turnstile token',
        statusCode: 500,
        data: {
          error: error instanceof Error ? error.message : 'Unknown error',
        },
      })
    }

    if (!response.ok) {
      throw new APIError({
        code: API_ERROR_CODES.VALIDATION_ERROR,
        message: 'Failed to verify Turnstile token',
        statusCode: 500,
      })
    }

    const result = (await response.json()) as TurnstileVerificationResponse

    if (!result.success) {
      const errorCodes = result['error-codes'] || []

      throw new APIError({
        code: API_ERROR_CODES.VALIDATION_ERROR,
        message: 'Invalid Turnstile token',
        statusCode: 400,
        data: {
          errorCodes,
        },
      })
    }

    return next()
  }
}
