import type { APIRequestInput, APISchema } from '@resettle/api'
import useSWRMutation from 'swr/mutation'

import useAPIClient from './useAPIClient'

export default function useMutation<
  T extends APISchema<any, any, any, any, any, any>,
>(key: string, apiSchema: T) {
  const client = useAPIClient()

  return useSWRMutation(
    key,
    (_key: string, { arg }: { arg: APIRequestInput<T> }) =>
      client.request(apiSchema, arg),
  )
}
