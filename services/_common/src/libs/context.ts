import { S3Client } from '@3rd-party-clients/s3'
import type { IntelligenceDatabase } from '@resettle/database/intelligence'
import { Kysely, PostgresDialect } from 'kysely'
import { OpenAI } from 'openai'
import pg from 'pg'
import { Stripe } from 'stripe'
import { SendMailClient } from 'zeptomail'

let openai: OpenAI
let r2: S3Client
let stripe: Stripe
let zeptoMail: SendMailClient

/**
 * Get an OpenAI instance
 * @param env - The environment
 * @param env.OPENAI_API_KEY - The OpenAI API key
 * @returns The OpenAI instance
 */
export const getOpenAI = (env: { OPENAI_API_KEY: string }) => {
  if (!env.OPENAI_API_KEY) {
    throw new Error('OPENAI_API_KEY is not set')
  }

  openai ??= new OpenAI({ apiKey: env.OPENAI_API_KEY })

  return openai
}

/**
 * Get an R2 client
 * @param env - The environment
 * @param env.CLOUDFLARE_ACCOUNT_ID - The Cloudflare account ID
 * @param env.CLOUDFLARE_R2_ACCESS_KEY_ID - The Cloudflare R2 access key ID
 * @param env.CLOUDFLARE_R2_SECRET_ACCESS_KEY - The Cloudflare R2 secret access key
 * @returns The R2 client
 */
export const getR2 = (env: {
  CLOUDFLARE_ACCOUNT_ID: string
  CLOUDFLARE_R2_ACCESS_KEY_ID: string
  CLOUDFLARE_R2_SECRET_ACCESS_KEY: string
}) => {
  if (!env.CLOUDFLARE_ACCOUNT_ID) {
    throw new Error('CLOUDFLARE_ACCOUNT_ID is not set')
  }

  if (!env.CLOUDFLARE_R2_ACCESS_KEY_ID) {
    throw new Error('CLOUDFLARE_R2_ACCESS_KEY_ID is not set')
  }

  if (!env.CLOUDFLARE_R2_SECRET_ACCESS_KEY) {
    throw new Error('CLOUDFLARE_R2_SECRET_ACCESS_KEY is not set')
  }

  r2 ??= new S3Client({
    endpoint: `https://${env.CLOUDFLARE_ACCOUNT_ID}.r2.cloudflarestorage.com`,
    accessKeyId: env.CLOUDFLARE_R2_ACCESS_KEY_ID,
    secretAccessKey: env.CLOUDFLARE_R2_SECRET_ACCESS_KEY,
  })

  return r2
}

/**
 * Get a Stripe instance
 * @param env - The environment
 * @param env.STRIPE_SECRET_KEY - The Stripe secret key
 * @returns The Stripe instance
 */
export const getStripe = (env: { STRIPE_SECRET_KEY: string }) => {
  if (!env.STRIPE_SECRET_KEY) {
    throw new Error('STRIPE_SECRET_KEY is not set')
  }

  stripe ??= new Stripe(env.STRIPE_SECRET_KEY)

  return stripe
}

/**
 * Get a ZeptoMail instance
 * @param env - The environment
 * @param env.ZEPTOMAIL_API_TOKEN - The ZeptoMail API token
 * @returns The ZeptoMail instance
 */
export const getZeptoMail = (env: { ZEPTOMAIL_API_TOKEN: string }) => {
  if (!env.ZEPTOMAIL_API_TOKEN) {
    throw new Error('ZEPTOMAIL_API_TOKEN is not set')
  }

  zeptoMail ??= new SendMailClient({
    url: 'api.zeptomail.com/',
    token: env.ZEPTOMAIL_API_TOKEN,
  })

  return zeptoMail
}

export const getIntelligenceDB = (env: {
  POSTGRES_CONNECTION_STRING_INTELLIGENCE: string
  HYPERDRIVE?: {
    connectionString: string
  }
}) => {
  const connectionString = env.HYPERDRIVE
    ? env.HYPERDRIVE.connectionString
    : env.POSTGRES_CONNECTION_STRING_INTELLIGENCE

  if (!connectionString) {
    throw new Error(
      'POSTGRES_CONNECTION_STRING_INTELLIGENCE or HYPERDRIVE.connectionString is not set',
    )
  }

  const pool = new pg.Pool({
    connectionString,
  })

  const db = new Kysely<IntelligenceDatabase>({
    dialect: new PostgresDialect({ pool }),
  })

  return { db, pool }
}
