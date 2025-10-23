import { APIClient } from '@resettle/api'
import { useMemo } from 'react'
import { unstable_useRoute } from 'react-router'

export default function useAPIClient() {
  const { loaderData } = unstable_useRoute('root')
  const { jwt } = loaderData || {}

  return useMemo(
    () =>
      new APIClient({
        baseURL: import.meta.env.VITE_API_URL,
        authorization: jwt ? `Bearer ${jwt}` : undefined,
      }),
    [jwt],
  )
}
