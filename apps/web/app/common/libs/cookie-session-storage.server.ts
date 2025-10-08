import { createCookieSessionStorage } from 'react-router'

const ENABLE_SECURE_COOKIE = import.meta.env.VITE_ENV !== 'development'
const COOKIE_SECRET = import.meta.env.VITE_SERVER_COOKIE_SECRET

export interface SessionValue {
  jwt?: string
}

/**
 * Get a cookie session storage
 * @returns A cookie session storage
 */
export const getCookieSessionStorage = () =>
  createCookieSessionStorage<SessionValue>({
    cookie: {
      name: '__session',
      httpOnly: true,
      sameSite: 'lax',
      secure: ENABLE_SECURE_COOKIE,
      secrets: [COOKIE_SECRET],
      maxAge: 60 * 60 * 24 * 400, // 400 days (max on Chrome)
    },
  })
