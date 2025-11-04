import { S3Client } from '@3rd-party-clients/s3'
import type { GlobalDatabase } from '@resettle/database/global'
import { Kysely, PostgresDialect } from 'kysely'
import pg from 'pg'

export const BATCH_SIZE = 500

/**
 * Get global database and connection pool
 * @param env - The environment
 * @param env.POSTGRES_CONNECTION_STRING_GLOBAL - The Postgres connection string
 * @returns The global database and pool
 */
export const getGlobalDB = (env: {
  POSTGRES_CONNECTION_STRING_GLOBAL: string
}) => {
  if (!env.POSTGRES_CONNECTION_STRING_GLOBAL) {
    throw new Error('POSTGRES_CONNECTION_STRING_GLOBAL is not set')
  }

  const pool = new pg.Pool({
    connectionString: env.POSTGRES_CONNECTION_STRING_GLOBAL,
  })

  const db = new Kysely<GlobalDatabase>({
    dialect: new PostgresDialect({ pool }),
  })

  return { db, pool }
}

/**
 * Get an R2 client
 * @param env - The environment
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

  return new S3Client({
    endpoint: `https://${env.CLOUDFLARE_ACCOUNT_ID}.r2.cloudflarestorage.com`,
    accessKeyId: env.CLOUDFLARE_R2_ACCESS_KEY_ID,
    secretAccessKey: env.CLOUDFLARE_R2_SECRET_ACCESS_KEY,
  })
}
