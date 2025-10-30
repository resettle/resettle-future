import ky, { type KyInstance } from 'ky'
import { z } from 'zod'

import { APIError, APISuccess, type APIErrorInit } from './responses'
import type { APISchema } from './schema'

/**
 * Type to check if a response schema is paginated (has metadata and data structure)
 * @template T - The response data schema
 */
type IsPaginatedResponse<T> =
  T extends z.ZodObject<{
    metadata: z.ZodObject<any>
    data: z.ZodArray<any>
  }>
    ? true
    : false

/**
 * Type to extract the data array element type from a paginated response schema
 * @template T - The paginated response schema
 */
type ExtractPaginatedDataType<T> =
  T extends z.ZodObject<{
    metadata: z.ZodObject<any>
    data: z.ZodArray<infer U>
  }>
    ? z.infer<U>
    : never

/**
 * Type constraint for API schemas that have paginated responses
 * @template T - The API schema type
 */
export type PaginatedAPISchema<
  T extends APISchema<any, any, any, any, any, any>,
> =
  T extends APISchema<any, any, any, any, infer ResponseData, any>
    ? IsPaginatedResponse<ResponseData> extends true
      ? T
      : never
    : never

/**
 * Type to extract the data array element type from a paginated API schema
 * @template T - The API schema type with paginated response
 */
export type ExtractPaginatedArrayType<
  T extends APISchema<any, any, any, any, any, any>,
> = ExtractPaginatedDataType<T['responseData']>

export interface APIClientOptions {
  baseURL: string
  authorization?: string
  onError?: (error: APIError) => void
}

/**
 * Type to extract request input from API schema
 * @template T - The API schema type
 * @returns The request input matching the schema requirements
 */
export type APIRequestInput<T extends APISchema<any, any, any, any, any, any>> =
  // Extract params from route if it has path parameters
  (T extends { params: infer P } ? { params: z.infer<P> } : {}) &
    // Extract query for GET/DELETE methods
    (T extends { query: infer Q } ? { query: z.infer<Q> } : {}) &
    // Extract body for POST/PUT/PATCH methods
    (T extends { body: infer B } ? { body: z.infer<B> } : {}) & {
      headers?: Record<string, string>
    }

export class APIClient {
  private readonly opts: APIClientOptions
  private readonly httpClient: KyInstance

  /**
   * Creates a new API client instance
   * @param opts - The client configuration options
   */
  constructor(opts: APIClientOptions) {
    this.opts = opts

    this.httpClient = ky.create({
      timeout: false,
      prefixUrl: opts.baseURL,
      hooks: {
        beforeRequest: [
          request => {
            if (opts.authorization) {
              request.headers.set('Authorization', opts.authorization)
            }
          },
        ],
        beforeError: [
          async httpError => {
            if (httpError.response.status >= 400) {
              let errorData: APIErrorInit | undefined

              try {
                errorData = await httpError.response.json()
              } catch {}

              if (errorData && errorData.code) {
                const error = new APIError({
                  statusCode: httpError.response.status,
                  code: errorData.code,
                  message: errorData.message,
                  data: errorData.data,
                })

                if (this.opts.onError) {
                  this.opts.onError(error)
                }

                throw error
              }
            }

            return httpError
          },
        ],
      },
    })
  }

  /**
   * Sets the authorization header for subsequent requests
   * @param authorization - The authorization token or header value
   * @returns The API client instance for chaining
   */
  setAuthorization = (authorization: string) => {
    this.opts.authorization = authorization
    return this
  }

  /**
   * Makes an API request based on the provided schema and input
   * @template T - The API schema type
   * @param apiSchema - The schema defining the API endpoint
   * @param input - The request input matching the schema requirements
   * @returns A promise resolving to the typed response data
   * @throws {APIError} When the API returns an error response
   */
  request = async <const T extends APISchema<any, any, any, any, any, any>>(
    apiSchema: T,
    input: APIRequestInput<T>,
  ): Promise<z.infer<T['responseData']>> => {
    const transform = apiSchema.transform ?? (v => v)

    const untypedInput = input as {
      params?: Record<string, any>
      query?: Record<string, any>
      body?: unknown
      headers?: Record<string, string>
    }

    const filterSearchParams = (obj: Record<string, any> | undefined) => {
      if (!obj) {
        return undefined
      }

      const filtered: Record<string, any> = {}

      for (const [key, value] of Object.entries(obj)) {
        if (
          value !== undefined &&
          !(Array.isArray(value) && value.length === 0)
        ) {
          filtered[key] = value
        }
      }

      return Object.keys(filtered).length > 0 ? filtered : undefined
    }

    const getResponse = async () => {
      const path = apiSchema.route.buildPath
        ? apiSchema.route.buildPath(untypedInput.params ?? {})
        : apiSchema.route.path

      const headers = untypedInput.headers ?? {}
      const searchParams = filterSearchParams(untypedInput.query)

      switch (apiSchema.method) {
        case 'GET':
          return this.httpClient.get(path, { headers, searchParams })
        case 'POST':
          return this.httpClient.post(path, {
            headers,
            searchParams,
            json: untypedInput.body,
          })
        case 'PUT':
          return this.httpClient.put(path, {
            headers,
            searchParams,
            json: untypedInput.body,
          })
        case 'PATCH':
          return this.httpClient.patch(path, {
            headers,
            searchParams,
            json: untypedInput.body,
          })
        case 'DELETE':
          return this.httpClient.delete(path, { headers, searchParams })
        default:
          throw new Error(`Unsupported api schema: ${apiSchema}`)
      }
    }

    const response = await getResponse()
    const responsePayload = await response.json<APISuccess>()

    return transform(responsePayload.data)
  }

  /**
   * Makes an API request and automatically fetches all pages if the response is paginated,
   * merging all data arrays into a single array
   * @template T - The API schema type (must have a paginated response)
   * @param apiSchema - The schema defining the API endpoint (must return paginated data)
   * @param input - The request input matching the schema requirements
   * @returns A promise resolving to an array of all items across all pages
   * @throws {APIError} When the API returns an error response
   */
  requestAll = async <const T extends APISchema<any, any, any, any, any, any>>(
    apiSchema: PaginatedAPISchema<T>,
    input: APIRequestInput<T>,
  ): Promise<ExtractPaginatedDataType<T['responseData']>[]> => {
    const transform = apiSchema.transform ?? (v => v)

    const untypedInput = input as {
      params?: Record<string, any>
      query?: Record<string, any>
      body?: unknown
      headers?: Record<string, string>
    }

    const allData: ExtractPaginatedDataType<T['responseData']>[] = []

    let currentQuery = { ...untypedInput.query }

    while (true) {
      // Make request with current pagination parameters
      const requestInput = {
        ...untypedInput,
        query: currentQuery,
      }

      const response = await this.request(
        apiSchema,
        requestInput as unknown as APIRequestInput<T>,
      )

      // Since we constrain apiSchema to be paginated, response will always have this structure

      const paginatedResponse = transform(response) as {
        data: ExtractPaginatedDataType<T['responseData']>[]
        metadata: {
          next_page?: number | null
          next_cursor?: string | null
        }
      }

      // Add current page data to accumulator
      allData.push(...paginatedResponse.data)

      // Check for offset-based pagination (next_page)
      if (
        'next_page' in paginatedResponse.metadata &&
        paginatedResponse.metadata.next_page !== null
      ) {
        currentQuery = {
          ...currentQuery,
          page: paginatedResponse.metadata.next_page,
        }
        continue
      }

      // Check for cursor-based pagination (next_cursor)
      if (
        'next_cursor' in paginatedResponse.metadata &&
        paginatedResponse.metadata.next_cursor !== null
      ) {
        currentQuery = {
          ...currentQuery,
          cursor: paginatedResponse.metadata.next_cursor,
        }
        continue
      }

      // No more pages, break the loop
      break
    }

    return allData
  }
}
