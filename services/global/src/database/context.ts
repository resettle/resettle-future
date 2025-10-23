import { Kysely, PostgresDialect } from 'kysely'
import pg from 'pg'

import type { Database } from './db'

/**
 * Get the database and pool
 * @param env - The environment
 * @param env.POSTGRES_CONNECTION_STRING - The Postgres connection string
 * @param env.HYPERDRIVE - The Hyperdrive binding
 * @returns The database and pool
 */
export const getDB = (env: {
  POSTGRES_CONNECTION_STRING: string
  HYPERDRIVE?: { connectionString: string }
}) => {
  const connectionString = env.HYPERDRIVE
    ? env.HYPERDRIVE.connectionString
    : env.POSTGRES_CONNECTION_STRING

  if (!connectionString) {
    throw new Error('HYPERDRIVE or POSTGRES_CONNECTION_STRING must be set')
  }

  const pool = new pg.Pool({
    connectionString,
    max: 5,
  })

  const db = new Kysely<Database>({
    dialect: new PostgresDialect({ pool }),
  })

  return { db, pool }
}
