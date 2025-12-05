import { apiSuccessResponse } from '@resettle/api'
import { APP_API_SCHEMAS } from '@resettle/api/app'
import { jsonValidator } from '@services/_common'
import { Hono } from 'hono'
import { describeRoute, resolver } from 'hono-openapi'
import { env } from 'hono/adapter'

import { signInWithEmail } from '../handlers/auth'
import { createAndSendOTP } from '../handlers/otp'

export const authRouter = new Hono<{ Bindings: Cloudflare.Env }>()

authRouter.post(
  APP_API_SCHEMAS.auth.signInWithEmail.route.path,
  describeRoute({
    description: 'Sign in with email',
    responses: {
      200: {
        description: 'Sign in with email successful',
        content: {
          'text/plain': {
            schema: resolver(APP_API_SCHEMAS.auth.signInWithEmail.responseData),
          },
        },
      },
    },
  }),
  jsonValidator(APP_API_SCHEMAS.auth.signInWithEmail.body),
  async ctx => {
    const db = ctx.get('db')
    const envVars = env(ctx)
    const { action_id, email, email_otp, username } = ctx.req.valid('json')

    const tokens = await signInWithEmail(
      { db, env: envVars },
      { action_id, email, email_otp, username },
    )

    return apiSuccessResponse(
      APP_API_SCHEMAS.auth.signInWithEmail.responseData,
      tokens,
      200,
    )
  },
)

authRouter.post(
  APP_API_SCHEMAS.auth.requestEmailOTP.route.path,
  jsonValidator(APP_API_SCHEMAS.auth.requestEmailOTP.body),
  async ctx => {
    const db = ctx.get('db')
    const zeptoMail = ctx.get('zeptoMail')
    const envVars = env(ctx)
    const { action_id, email, locale } = ctx.req.valid('json')

    await createAndSendOTP(
      { db, zeptoMail, env: envVars },
      { action_id, type: 'email', recipient: email, locale },
    )

    return apiSuccessResponse(
      APP_API_SCHEMAS.auth.requestEmailOTP.responseData,
      {},
      200,
    )
  },
)
