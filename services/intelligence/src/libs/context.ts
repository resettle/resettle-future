import type { IntelligenceDatabase } from '@resettle/database/intelligence'
import { Kysely, PostgresDialect } from 'kysely'
import pg from 'pg'

/**
 * Get intelligence database and connection pool
 * @param env - The environment
 * @param env.POSTGRES_CONNECTION_STRING_INTELLIGENCE - The Postgres connection string
 * @param env.HYPERDRIVE - The Hyperdrive connection string
 * @returns The intelligence database and pool
 */
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
