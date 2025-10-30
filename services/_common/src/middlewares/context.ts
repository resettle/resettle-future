import type { S3Client } from '@3rd-party-clients/s3'
import type { MiddlewareHandler } from 'hono'
import { env } from 'hono/adapter'
import type OpenAI from 'openai'
import type { Stripe } from 'stripe'
import type { SendMailClient } from 'zeptomail'

import { getOpenAI, getR2, getStripe, getZeptoMail } from '../libs/context'

declare module 'hono' {
  interface DatabaseSchema {}

  interface ContextVariableMap {
    openai: OpenAI
    r2: S3Client
    stripe: Stripe
    zeptoMail: SendMailClient
  }
}

/**
 * Context middleware
 * @returns The middleware
 */
export const context = (): MiddlewareHandler => {
  return async (ctx, next) => {
    const envVars = env<typeof process.env>(ctx)

    const openai = getOpenAI(envVars)
    const r2 = getR2(envVars)
    const stripe = getStripe(envVars)
    const zeptoMail = getZeptoMail(envVars)

    ctx.set('openai', openai)
    ctx.set('r2', r2)
    ctx.set('stripe', stripe)
    ctx.set('zeptoMail', zeptoMail)

    await next()
  }
}
