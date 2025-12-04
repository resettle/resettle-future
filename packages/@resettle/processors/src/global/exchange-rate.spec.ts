import { S3Client } from '@3rd-party-clients/s3'
import type { GlobalDatabase } from '@resettle/database/global'
import {
  FileMigrationProvider,
  Kysely,
  Migrator,
  PostgresDialect,
} from 'kysely'
import assert from 'node:assert'
import { promises as fs } from 'node:fs'
import { mkdir, rm } from 'node:fs/promises'
import * as path from 'node:path'
import { cwd } from 'node:process'
import { after, afterEach, before, beforeEach, describe, it } from 'node:test'
import { Pool } from 'pg'
import { MockAgent, setGlobalDispatcher } from 'undici'

import { processExchangeRates, type ExchangeRates } from './exchange-rate'

const exchangeRates = {
  success: true,
  date: '2025-10-10',
  timestamp: new Date('2025-10-10').getTime(),
  base: 'USD',
  rates: {
    USD: 1,
    CNY: 0.2,
    EUR: 0.1,
    GBP: 0.08,
  },
} satisfies ExchangeRates

const exchangeRates2 = {
  success: true,
  date: '2025-10-11',
  timestamp: new Date('2025-10-11').getTime(),
  base: 'USD',
  rates: {
    USD: 1,
    CNY: 0.1,
    EUR: 0.1,
    GBP: 0.08,
  },
} satisfies ExchangeRates

const SCHEMA_NAME = 'exchange_rate'
const DIR_NAME = '.exchange_rate'

describe('exchange-rate', () => {
  let db: Kysely<GlobalDatabase>
  let agent: MockAgent

  before(async () => {
    db = new Kysely<GlobalDatabase>({
      dialect: new PostgresDialect({
        pool: new Pool({
          connectionString: process.env.POSTGRES_CONNECTION_STRING_TEST,
        }),
      }),
    })
    await db.schema.dropSchema(SCHEMA_NAME).ifExists().cascade().execute()
    await db.schema.createSchema(SCHEMA_NAME).ifNotExists().execute()
    db = db.withSchema(SCHEMA_NAME)
    const migrator = new Migrator({
      db,
      provider: new FileMigrationProvider({
        fs,
        path,
        migrationFolder: path.join(cwd(), '../database/src/global/migrations'),
      }),
      migrationTableSchema: SCHEMA_NAME,
    })
    const { error } = await migrator.migrateToLatest()

    if (error) {
      console.error('failed to migrate')
      console.error(error)
      process.exit(1)
    }
  })

  after(async () => {
    await db.schema.dropSchema(SCHEMA_NAME).ifExists().cascade().execute()
    await db.destroy()
  })

  beforeEach(async () => {
    await mkdir(DIR_NAME)
    agent = new MockAgent()
    setGlobalDispatcher(agent)
  })

  afterEach(async () => {
    await rm(DIR_NAME, { recursive: true })
  })

  it('processes without previous runs', async () => {
    agent
      .get('https://api.apilayer.com')
      .intercept({
        path: '/exchangerates_data/latest',
        query: {
          base: 'USD',
        },
        method: 'GET',
      })
      .reply(200, exchangeRates)
    await processExchangeRates(
      {
        s3: new S3Client({
          endpoint: '',
          accessKeyId: '',
          secretAccessKey: '',
        }),
        db,
      },
      { type: 'fs', directory: DIR_NAME },
      '',
    )
    const exchangeRatesData = await db
      .selectFrom('exchange_rate_data')
      .selectAll()
      .execute()
    assert.equal(exchangeRatesData.length, 4)
  })

  it('processes with history', async () => {
    agent
      .get('https://api.apilayer.com')
      .intercept({
        path: '/exchangerates_data/latest',
        query: {
          base: 'USD',
        },
        method: 'GET',
      })
      .reply(200, exchangeRates)
    await processExchangeRates(
      {
        s3: new S3Client({
          endpoint: '',
          accessKeyId: '',
          secretAccessKey: '',
        }),
        db,
      },
      { type: 'fs', directory: DIR_NAME },
      '',
    )

    agent
      .get('https://api.apilayer.com')
      .intercept({
        path: '/exchangerates_data/latest',
        query: {
          base: 'USD',
        },
        method: 'GET',
      })
      .reply(200, exchangeRates2)
    await processExchangeRates(
      {
        s3: new S3Client({
          endpoint: '',
          accessKeyId: '',
          secretAccessKey: '',
        }),
        db,
      },
      { type: 'fs', directory: DIR_NAME },
      '',
    )

    const exchangeRatesData = await db
      .selectFrom('exchange_rate_data')
      .selectAll()
      .execute()
    assert.equal(exchangeRatesData.length, 8)
    const filtered = exchangeRatesData.filter(
      d => d.created_at.getTime() === new Date(exchangeRates2.date).getTime(),
    )
    assert.equal(
      filtered.find(d => d.currency_code === 'CNY')!.rate_to_usd,
      0.1,
    )
    assert.equal(
      filtered.find(d => d.currency_code === 'EUR')!.rate_to_usd,
      0.1,
    )
  })
})
