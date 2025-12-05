import { PostgresDialect } from 'kysely'
import { defineConfig, getKnexTimestampPrefix } from 'kysely-ctl'
import { Pool } from 'pg'
import { z } from 'zod'

const configSchema = z.object({
  POSTGRES_CONNECTION_STRING_APP: z.url(),
  POSTGRES_CONNECTION_STRING_INTELLIGENCE: z.url(),
  POSTGRES_CONNECTION_STRING_TEST: z.url(),
})

const config = configSchema.parse(process.env)

export default defineConfig({
  $env: {
    app: {
      dialect: new PostgresDialect({
        pool: new Pool({
          connectionString: config.POSTGRES_CONNECTION_STRING_APP,
        }),
      }),
      migrations: {
        migrationFolder: './src/app/migrations',
        getMigrationPrefix: getKnexTimestampPrefix,
      },
      seeds: {
        seedFolder: './src/app/seeds',
        getSeedPrefix: getKnexTimestampPrefix,
      },
    },
    intelligence: {
      dialect: new PostgresDialect({
        pool: new Pool({
          connectionString: config.POSTGRES_CONNECTION_STRING_INTELLIGENCE,
        }),
      }),
      migrations: {
        migrationFolder: './src/intelligence/migrations',
        getMigrationPrefix: getKnexTimestampPrefix,
      },
      seeds: {
        seedFolder: './src/intelligence/seeds',
        getSeedPrefix: getKnexTimestampPrefix,
      },
    },
    test: {
      dialect: new PostgresDialect({
        pool: new Pool({
          connectionString: config.POSTGRES_CONNECTION_STRING_TEST,
        }),
      }),
      migrations: {
        migrationFolder: './src/intelligence/migrations',
        getMigrationPrefix: getKnexTimestampPrefix,
      },
      seeds: {
        seedFolder: './src/intelligence/seeds',
        getSeedPrefix: getKnexTimestampPrefix,
      },
    },
  },
})
