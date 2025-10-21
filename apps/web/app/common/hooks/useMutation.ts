import { APIClient, type APIRequestInput, type APISchema } from '@resettle/api'
import { useMemo } from 'react'
import { unstable_useRoute } from 'react-router'
import useSWRMutation from 'swr/mutation'

export default function useMutation<
  T extends APISchema<any, any, any, any, any, any>,
>(key: string, apiSchema: T) {
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

  return useSWRMutation(
    key,
    (_key: string, { arg }: { arg: APIRequestInput<T> }) =>
      client.request(apiSchema, arg),
  )
}
