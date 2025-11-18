import type { AppDatabase } from '@resettle/database/app'
import { Kysely, PostgresDialect } from 'kysely'
import pg from 'pg'

/**
 * Get app database and connection pool
 * @param env - The environment
 * @param env.POSTGRES_CONNECTION_STRING_APP - The Postgres connection string
 * @param env.HYPERDRIVE - The Hyperdrive connection string
 * @returns The app database and pool
 */
export const getAppDB = (env: {
  POSTGRES_CONNECTION_STRING_APP: string
  HYPERDRIVE?: {
    connectionString: string
  }
}) => {
  const connectionString = env.HYPERDRIVE
    ? env.HYPERDRIVE.connectionString
    : env.POSTGRES_CONNECTION_STRING_APP

  if (!connectionString) {
    throw new Error(
      'POSTGRES_CONNECTION_STRING_APP or HYPERDRIVE.connectionString is not set',
    )
  }

  const pool = new pg.Pool({
    connectionString,
  })

  const db = new Kysely<AppDatabase>({
    dialect: new PostgresDialect({ pool }),
  })

  return { db, pool }
}
