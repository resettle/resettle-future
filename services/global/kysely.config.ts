import { PostgresDialect } from 'kysely'
import { defineConfig, getKnexTimestampPrefix } from 'kysely-ctl'
import { Pool } from 'pg'
import { z } from 'zod'

const configSchema = z.object({
  POSTGRES_CONNECTION_STRING_GLOBAL: z.url(),
})

const config = configSchema.parse(process.env)

export default defineConfig({
  dialect: new PostgresDialect({
    pool: new Pool({
      connectionString: config.POSTGRES_CONNECTION_STRING_GLOBAL,
    }),
  }),
  migrations: {
    migrationFolder: './src/database/migrations',
    getMigrationPrefix: getKnexTimestampPrefix,
  },
  seeds: {
    seedFolder: './src/database/seeds',
    getSeedPrefix: getKnexTimestampPrefix,
  },
})
