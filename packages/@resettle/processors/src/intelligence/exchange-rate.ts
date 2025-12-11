import type { S3Client } from '@3rd-party-clients/s3'
import type { IntelligenceDatabase } from '@resettle/database/intelligence'
import type { CurrencyCode } from '@resettle/schema'
import { sql, type Kysely } from 'kysely'

import {
  downloadExchangeRates,
  getCurrentDay,
  listFilesInS3,
  loadFromS3,
  refDirToRefS3,
  saveToS3,
  type ExchangeRates,
  type S3RefDir,
} from '../_common'

export const processExchangeRates = async (
  ctx: {
    s3: S3Client
    db: Kysely<IntelligenceDatabase>
  },
  ref: S3RefDir,
  apiKey: string,
) => {
  const file = `exchange-rate/${getCurrentDay()}.json`
  const files = await listFilesInS3(ctx.s3, ref, { prefix: `exchange-rate/` })
  const computedRef = refDirToRefS3(ref, file)

  let content: ExchangeRates

  if (!files.includes(file)) {
    content = await downloadExchangeRates(apiKey)
    await saveToS3(ctx.s3, computedRef, JSON.stringify(content, null, 2), {})
  } else {
    const result = await loadFromS3(ctx.s3, computedRef, { stream: false })

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
