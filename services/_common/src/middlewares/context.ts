import type { S3Client } from '@3rd-party-clients/s3'
import type { Database } from '@resettle/database'
import type { Database as Database2 } from '@resettle/database2'
import type { MiddlewareHandler } from 'hono'
import { env } from 'hono/adapter'
import type { Kysely } from 'kysely'
import type OpenAI from 'openai'
import type { Stripe } from 'stripe'
import type { SendMailClient } from 'zeptomail'

import {
  getDB,
  getDB2,
  getOpenAI,
  getR2,
  getStripe,
  getZeptoMail,
} from '../libs/context'

declare module 'hono' {
  interface ContextVariableMap {
    contextInitialized: boolean
    db: Kysely<Database>
    db2: Kysely<Database2>
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

    const { db, pool } = getDB(envVars)
    const db2 = getDB2(envVars)
    const openai = getOpenAI(envVars)
    const r2 = getR2(envVars)
    const stripe = getStripe(envVars)
    const zeptoMail = getZeptoMail(envVars)

    ctx.set('db', db)
    ctx.set('db2', db2.db)
    ctx.set('openai', openai)
    ctx.set('r2', r2)
    ctx.set('stripe', stripe)
    ctx.set('zeptoMail', zeptoMail)

    try {
      await next()
    } finally {
      await pool.end()
    }
  }
}
