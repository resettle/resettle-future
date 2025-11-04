import type { GlobalDatabase } from '@resettle/database/global'
import { Kysely, PostgresDialect } from 'kysely'
import pg from 'pg'

/**
 * Get global database and connection pool
 * @param env - The environment
 * @param env.POSTGRES_CONNECTION_STRING_GLOBAL - The Postgres connection string
 * @param env.HYPERDRIVE - The Hyperdrive connection string
 * @returns The global database and pool
 */
export const getGlobalDB = (env: {
  POSTGRES_CONNECTION_STRING_GLOBAL: string
  HYPERDRIVE?: {
    connectionString: string
  }
}) => {
  const connectionString = env.HYPERDRIVE
    ? env.HYPERDRIVE.connectionString
    : env.POSTGRES_CONNECTION_STRING_GLOBAL

  if (!connectionString) {
    throw new Error(
      'POSTGRES_CONNECTION_STRING_GLOBAL or HYPERDRIVE.connectionString is not set',
    )
  }

  const pool = new pg.Pool({
    connectionString,
  })

  const db = new Kysely<GlobalDatabase>({
    dialect: new PostgresDialect({ pool }),
  })

  return { db, pool }
}
