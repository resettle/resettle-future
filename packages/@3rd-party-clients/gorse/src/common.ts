const HEADER_API_KEY = 'X-API-Key'

export type Client = {
  endpoint: string
  apiKey?: string
}

export const getHeaders = (apiKey?: string) =>
  apiKey === undefined
    ? undefined
    : {
        [HEADER_API_KEY]: apiKey,
      }
