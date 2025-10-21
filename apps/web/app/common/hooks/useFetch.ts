import { APIClient, type APIRequestInput, type APISchema } from '@resettle/api'
import { useMemo } from 'react'
import { unstable_useRoute } from 'react-router'
import useSWR from 'swr'
import type { z } from 'zod'

export default function useFetch<
  T extends APISchema<any, any, any, any, any, any>,
>(
  key: string,
  apiSchema: T,
  input: APIRequestInput<T>,
  defaultData?: z.infer<T['responseData']>,
) {
  const { loaderData } = unstable_useRoute('root')
  const { jwt } = loaderData || {}

  const client = useMemo(
    () =>
      new APIClient({
        baseURL: import.meta.env.VITE_API_URL,
        authorization: jwt ? `Bearer ${jwt}` : undefined,
      }),
    [jwt],
  )

  return useSWR(key, () => client.request(apiSchema, input), {
    fallbackData: defaultData,
  })
}
