import { API_ERROR_CODES, APIError } from '@resettle/api'
import { createUser, getUserBy, type AppDatabase } from '@resettle/database/app'
import type { UserAuth } from '@resettle/schema/app'
import { signJWT } from '@services/_common'
import type { Kysely } from 'kysely'

import { NON_PRODUCTION_WHITELISTED_EMAILS } from '../libs/constants'
import { verifyOTP } from './otp'

/**
 * Generates a random username for a user
 * @param email - User's email
 * @returns Random username
 */
export const generateUsername = (email: string) => {
  const name = email.split('@')[0].replace(/\./g, '') // Remove dots from email
  const randomDigits = Math.floor(Math.random() * 900) + 100 // Generates 3-digit number (100-999)

  return `${name}${randomDigits}`
}

/**
 * Generates JWT access tokens for a user
 * @param ctx - Context containing JWT secrets
 * @param params - User JWT payload containing email, id, and role
 * @returns Object containing user id and access token
 */
export const generateTokens = async (
  ctx: {
    env: {
      JWT_SECRET: string
      JWT_SECRET_PREVIOUS: string
      JWT_EXPIRES_IN: string
    }
  },
  params: UserAuth,
) => {
  const { env } = ctx

  const access_token = await signJWT(params, env.JWT_SECRET, {
    expiresIn: env.JWT_EXPIRES_IN as `${number}`,
  })

  return { uid: params.id, access_token }
}

/**
 * Signs in a user with email and OTP verification
 * @param ctx - Context containing database, contacts API, and environment variables
 * @param params - Parameters containing email, email OTP, and optional preferred locale
 * @returns Generated tokens for the authenticated user
 */
export const signInWithEmail = async (
  ctx: {
    db: Kysely<AppDatabase>
    env: {
      ENV: string
      JWT_SECRET: string
      JWT_SECRET_PREVIOUS: string
      JWT_EXPIRES_IN: string
    }
  },
  params: {
    action_id: string
    email: string
    email_otp: string
    username?: string
  },
) => {
  const { db, env } = ctx

  const {
    action_id,
    email,
    email_otp,
    username = generateUsername(email),
  } = params

  if (
    ctx.env.ENV !== 'production' &&
    !NON_PRODUCTION_WHITELISTED_EMAILS.includes(email)
  ) {
    throw new APIError({
      statusCode: 401,
      code: API_ERROR_CODES.USER_EMAIL_NOT_IN_WHITELIST,
      message: 'Please use non-production whitelisted emails',
    })
  }

  await verifyOTP(
    { db, env },
    {
      action_id,
      type: 'email',
      recipient: email,
      code: email_otp,
    },
  )

  let user = await getUserBy(db, { email })

  if (!user) {
    user = await createUser(db, {
      email,
      username,
      role: ctx.env.ENV === 'production' ? 'user' : 'admin',
    })
  }

  return await generateTokens(ctx, {
    id: user.id,
    email: user.email,
    username: user.username,
    role: user.role,
  })
}
