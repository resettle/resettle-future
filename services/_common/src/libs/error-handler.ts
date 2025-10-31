import { API_ERROR_CODES, APIError, apiErrorResponse } from '@resettle/api'
import type { ErrorHandler } from 'hono'
import { HTTPException } from 'hono/http-exception'
import { ZodError } from 'zod'

/**
 * API error handler for Hono
 * @param err - The error
 * @param c - The context
 * @returns The response
 */
export const apiErrorHandler: ErrorHandler = (err, c) => {
  console.error(err)

  if (err instanceof HTTPException) {
    if (err.status === 401) {
      return apiErrorResponse({
        message: 'Unauthorized',
        code: API_ERROR_CODES.UNAUTHORIZED,
        statusCode: 401,
      })
    }

    return err.getResponse()
  }

  if (err instanceof ZodError) {
    return apiErrorResponse({
      message: 'Invalid request',
      code: API_ERROR_CODES.VALIDATION_ERROR,
      statusCode: 400,
      data: {
        issues: err.issues,
      },
    })
  }

  if (err instanceof APIError) {
    return err.toResponse()
  }

  return c.json({ error: 'Internal server error' }, 500)
}
