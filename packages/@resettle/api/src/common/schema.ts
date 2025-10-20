import type { Route } from '@resettle/utils'
import type { z } from 'zod'

type ZodQuery = z.ZodObject
type ZodBody = z.ZodUnion<z.ZodObject[]> | z.ZodObject
type ZodResponse = z.ZodType

type ExtractPathParamArray<T extends string> =
  T extends `${string}:${infer Param}/${infer Rest}`
    ? [Param, ...ExtractPathParamArray<Rest>]
    : T extends `${string}:${infer Param}`
      ? [Param]
      : []

type BaseAPISchema<
  Method extends 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE',
  R extends Route<any, any, any>,
  ResponseData extends ZodResponse,
  Params extends
    | z.ZodObject<{
        [K in ExtractPathParamArray<R['path']>[number]]: z.ZodType
      }>
    | undefined = undefined,
> = {
  method: Method
  route: R
  responseData: ResponseData
  transform?: (response: z.infer<ResponseData>) => z.infer<ResponseData>
} & (Params extends z.ZodObject<{
  [K in ExtractPathParamArray<R['path']>[number]]: z.ZodType
}>
  ? { params: Params }
  : {})

export type APISchema<
  Method extends 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE',
  R extends Route<any, any, any>,
  Query extends ZodQuery,
  Body extends ZodBody,
  ResponseData extends ZodResponse,
  Params extends
    | z.ZodObject<{
        [K in ExtractPathParamArray<R['path']>[number]]: z.ZodType
      }>
    | undefined = undefined,
> = BaseAPISchema<Method, R, ResponseData, Params> &
  (Method extends 'GET' | 'DELETE' ? { query: Query } : {}) &
  (Method extends 'POST' | 'PUT' | 'PATCH' ? { body: Body } : {})

/**
 * Define an API schema
 * @param schema - The API schema to define
 * @returns The API schema
 */
export const defineAPISchema = <
  const Method extends 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE',
  const R extends Route<any, any, any>,
  const Query extends ZodQuery,
  const Body extends ZodBody,
  const ResponseData extends ZodResponse,
  const Params extends
    | z.ZodObject<{
        [K in ExtractPathParamArray<R['path']>[number]]: z.ZodType
      }>
    | undefined = undefined,
>(
  schema: APISchema<Method, R, Query, Body, ResponseData, Params>,
) => {
  return schema
}
