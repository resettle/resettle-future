import type { APIRequestInput, APISchema } from '@resettle/api'
import useSWR from 'swr'
import type { z } from 'zod'

import useAPIClient from './useAPIClient'

export default function useFetch<
  T extends APISchema<any, any, any, any, any, any>,
>(
  key: string,
  apiSchema: T,
  input: APIRequestInput<T>,
  defaultData?: z.infer<T['responseData']>,
) {
  const client = useAPIClient()

  return useSWR(key, () => client.request(apiSchema, input), {
    fallbackData: defaultData,
  })
}
