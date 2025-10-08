import type { UserAuth } from '@resettle/schema'
import { createContext } from 'react-router'

export type AuthServerContextValue = {
  isAuthenticated: boolean
  jwt: string | null
  currentUser: UserAuth | null
}

export const authServerContext = createContext<AuthServerContextValue>({
  isAuthenticated: false,
  jwt: null,
  currentUser: null,
})
