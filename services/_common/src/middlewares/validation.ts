import { validator } from 'hono-openapi'
import type { z } from 'zod'

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
  return validator('param', schema)
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
  return validator('query', schema)
}

/**
 * JSON validator
 * @param schema - The schema
 * @returns The validator
 */
export const jsonValidator = <T extends z.ZodType>(schema: T) => {
  return validator('json', schema)
}
