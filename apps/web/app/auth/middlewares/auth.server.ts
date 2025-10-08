import type { UserAuth } from '@resettle/schema'
import { jwtDecode } from 'jwt-decode'
import type { MiddlewareFunction } from 'react-router'

import { getCookieSessionStorage } from '~/common/libs/cookie-session-storage.server'
import { authServerContext } from '../contexts/auth.server'

export const authMiddleware: MiddlewareFunction<Response> = async (
  { request, context },
  _next,
) => {
  const sessionStorage = await getCookieSessionStorage()
  const session = await sessionStorage.getSession(request.headers.get('Cookie'))
  const jwt = session.get('jwt')

  if (!jwt) {
    context.set(authServerContext, {
      isAuthenticated: false,
      jwt: null,
      currentUser: null,
    })
    return
  }

  const currentUser = jwtDecode<UserAuth>(jwt)

  context.set(authServerContext, {
    isAuthenticated: true,
    jwt,
    currentUser,
  })
}
