import type { MiddlewareFunction } from 'react-router'

import { getCookieSessionStorage } from '~/common/libs/cookie-session-storage.server'
import { utmServerContext } from '../contexts/utm.server'

export const utmMiddleware: MiddlewareFunction<Response> = async (
  { request, context },
  next,
) => {
  const { searchParams } = new URL(request.url)

  const sessionStorage = await getCookieSessionStorage()
  const session = await sessionStorage.getSession(request.headers.get('Cookie'))

  const currentUTMParams = session.get('utmParams')

  const requestUTMParams = {
    source: searchParams.get('utm_source') || undefined,
    medium: searchParams.get('utm_medium') || undefined,
    campaign: searchParams.get('utm_campaign') || undefined,
    term: searchParams.get('utm_term') || undefined,
    content: searchParams.get('utm_content') || undefined,
  } satisfies UTMParams

  const newUTMParams = {
    ...currentUTMParams,
    ...Object.fromEntries(
      Object.entries(requestUTMParams).filter(([_, value]) => value),
    ),
  }

  const hasUTMParamsChanged =
    currentUTMParams?.source !== newUTMParams.source ||
    currentUTMParams?.medium !== newUTMParams.medium ||
    currentUTMParams?.campaign !== newUTMParams.campaign ||
    currentUTMParams?.term !== newUTMParams.term ||
    currentUTMParams?.content !== newUTMParams.content

  context.set(utmServerContext, newUTMParams)

  const response = await next()

  if (hasUTMParamsChanged) {
    session.set('utmParams', newUTMParams)
    response.headers.append(
      'Set-Cookie',
      await sessionStorage.commitSession(session),
    )
  }

  return response
}
