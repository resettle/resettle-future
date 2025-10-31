import { API_ERROR_CODES, APIError } from '@resettle/api'
import { validator } from 'hono/validator'
import type { z } from 'zod'

/**
 * Get a validate function
 * @param schema - The schema
 * @returns The validate function
 */
const getValidateFn =
  <T extends z.ZodType>(schema: T) =>
  (value: unknown) => {
    const parsed = schema.safeParse(value)

    if (!parsed.success) {
      throw new APIError({
        statusCode: 400,
        code: API_ERROR_CODES.VALIDATION_ERROR,
        message: parsed.error.message,
        data: {
          type: parsed.error.type,
          issues: parsed.error.issues,
        },
      })
    }

    return parsed.data
  }

/**
 * Param validator
 * @param _requiredParams - The required params
 * @param schema - The schema
 * @returns The validator
 */
export const paramValidator = <
  const Params extends string,
  const T extends z.ZodObject<{
    [key in Params]: z.ZodType
  }>,
>(
  _requiredParams: readonly Params[],
  schema: T,
) => {
  return validator('param', getValidateFn(schema))
}

/**
 * Query validator
 * @param schema - The schema
 * @returns The validator
 */
export const queryValidator = <
  T extends z.ZodObject<Record<string, z.ZodType>>,
>(
  schema: T,
) => {
  return validator('query', getValidateFn(schema))
}

/**
 * JSON validator
 * @param schema - The schema
 * @returns The validator
 */
export const jsonValidator = <T extends z.ZodType>(schema: T) => {
  return validator('json', getValidateFn(schema))
}
