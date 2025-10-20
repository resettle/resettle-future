import type { z } from 'zod'

/**
 * Utility type to ensure exact type matching - prevents extra properties
 */
type Exact<T, U> = T extends U ? (U extends T ? T : never) : never

export interface APIErrorInit {
  message: string
  code: number
  statusCode: number
  data?: Record<string, unknown>
}

export class APIError extends Error {
  public code: number
  public statusCode: number
  public data: Record<string, unknown>

  constructor({ message, code, statusCode, data }: APIErrorInit) {
    super(message)

    this.code = code
    this.statusCode = statusCode
    this.data = data || {}
  }

  /**
   * Converts the API error to a JSON object
   * @returns A JSON object with the error details
   */
  toJSON() {
    return {
      code: this.code,
      message: this.message,
      data: this.data,
    }
  }

  /**
   * Converts the API error to a Response object
   * @returns A Response object with the error details as JSON and appropriate status code
   */
  toResponse() {
    return Response.json(this.toJSON(), { status: this.statusCode })
  }
}

export class APISuccess {
  constructor(
    public data: unknown,
    public statusCode: number = 200,
  ) {}

  /**
   * Converts the API success to a Response object
   * @returns A Response object with the success details as JSON and appropriate status code
   */
  toResponse() {
    return Response.json(
      {
        code: 0,
        message: 'Success',
        data: this.data,
      },
      { status: this.statusCode },
    )
  }
}

/**
 * Creates a Response object from an API error
 * @param error - The API error to convert
 * @returns A Response object with the error details as JSON and appropriate status code
 */
export const apiErrorResponse = (error: APIErrorInit) => {
  return new APIError(error).toResponse()
}

/**
 * Creates a Response object from a success object
 * @param data - The data to include in the response (must exactly match type T with no extra properties)
 * @param statusCode - The HTTP status code for the response
 * @returns A Response object with the success details as JSON and appropriate status code
 */
export const apiSuccessResponse = <T, U>(
  _schema: z.ZodType<T>,
  data: Exact<NoInfer<T>, U>,
  statusCode: number = 200,
) => {
  return new APISuccess(data, statusCode).toResponse()
}
