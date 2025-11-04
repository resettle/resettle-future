import { processExchangeRates } from '@resettle/processors'
import { Command } from 'commander'

import { getGlobalDB, getR2 } from '../../_common/context'

export const exchangeRateCommand = new Command()
  .name('exchange-rate')
  .description('Inject latest exchange rate data')
  .option('--directory <directory>', 'The local directory containing the files')
  .action(async (options: { directory?: string }) => {
    const r2 = getR2(process.env)
    const { db, pool } = getGlobalDB(process.env)

    try {
      await processExchangeRates(
        { s3: r2, db },
        options.directory
          ? { type: 'fs', directory: options.directory }
          : { type: 's3', bucket: process.env.DATA_SNAPSHOTS_BUCKET },
        process.env.EXCHANGE_RATES_API_KEY,
      )
    } finally {
      await pool.end()
    }
  })
