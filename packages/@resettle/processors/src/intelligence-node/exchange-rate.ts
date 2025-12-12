import type { S3Client } from '@aws-sdk/client-s3'
import type { IntelligenceDatabase } from '@resettle/database/intelligence'
import type { CurrencyCode } from '@resettle/schema'
import { sql, type Kysely } from 'kysely'

import {
  downloadExchangeRates,
  getCurrentDay,
  type ExchangeRates,
  type RefDir,
} from '../_common'
import { listFiles, loadFile, refDirToRef, saveFile } from '../node'

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
    content = await downloadExchangeRates(apiKey)
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
