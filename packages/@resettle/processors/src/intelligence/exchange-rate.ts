import type { S3Client } from '@3rd-party-clients/s3'
import type { IntelligenceDatabase } from '@resettle/database/intelligence'
import type { CurrencyCode } from '@resettle/schema'
import { sql, type Kysely } from 'kysely'

import {
  getCurrentDay,
  listFiles,
  loadFile,
  refDirToRef,
  saveFile,
  type RefDir,
} from '../utils'

export type ExchangeRates = {
  success: boolean
  timestamp: number
  base: CurrencyCode
  date: string
  rates: Partial<Record<CurrencyCode, number>>
}

/**
 * Download exchange rates
 * @param apiKey - The API key
 * @returns The content
 */
const download = async (apiKey: string) => {
  const response = await fetch(
    'https://api.apilayer.com/exchangerates_data/latest?base=USD',
    {
      headers: {
        apikey: apiKey,
      },
    },
  )

  const content = await response.json()

  return content as ExchangeRates
}

/**
 * Process exchange rates
 * @param ctx - The context
 * @param ctx.s3 - The S3 client
 * @param ctx.db - The intelligence database
 * @param ref - The reference directory
 * @param apiKey - The API key
 */
export const processExchangeRates = async (
  ctx: {
    s3: S3Client
    db: Kysely<IntelligenceDatabase>
  },
  ref: RefDir,
  apiKey: string,
) => {
  const file = `exchange-rate/${getCurrentDay()}.json`
  const files = await listFiles(ctx, ref, { prefix: `exchange-rate/` })
  const computedRef = refDirToRef(ref, file)

  let content: ExchangeRates

  if (!files.includes(file)) {
    content = await download(apiKey)
    await saveFile(ctx, computedRef, JSON.stringify(content, null, 2), {})
  } else {
    const result = await loadFile(ctx, computedRef, { stream: false })

    if (!result.success) {
      throw new Error(`Something went wrong while reading ${file}`)
    }

    content = JSON.parse(result.data.toString('utf-8'))
  }

  console.log('Syncing data into database...')

  await ctx.db
    .insertInto('exchange_rate_data')
    .values(
      Object.entries(content.rates).map(([key, value]) => ({
        currency_code: key as CurrencyCode,
        rate_to_usd: value,
        created_at: new Date(content.date),
      })),
    )
    .onConflict(oc =>
      oc.columns(['currency_code', 'created_at']).doUpdateSet(eb => ({
        rate_to_usd: eb.ref('excluded.rate_to_usd'),
        created_at: eb.ref('excluded.created_at') ?? sql`now()`,
      })),
    )
    .execute()
}
