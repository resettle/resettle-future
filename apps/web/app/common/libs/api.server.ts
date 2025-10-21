import { APIClient } from '@resettle/api'
import type { RouterContextProvider } from 'react-router'

import { authServerContext } from '~/auth/contexts/auth.server'

export const getAPIClient = async ({
  context,
}: {
  context: RouterContextProvider
}) => {
  const { jwt } = context.get(authServerContext)

  return new APIClient({
    baseURL: import.meta.env.VITE_API_URL,
    authorization: jwt ? `Bearer ${jwt}` : undefined,
  })
}
