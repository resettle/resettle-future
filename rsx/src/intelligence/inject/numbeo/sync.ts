import { processNumbeo } from '@resettle/processors/intelligence-node'
import { Command } from 'commander'

import { getIntelligenceDB, getR2AWS } from '../../../_common/context'

export const syncCommand = new Command()
  .name('sync')
  .description('Sync mapped numbeo data')
  .option('--directory <directory>', 'The local directory containing the files')
  .option(
    '--month <month>',
    'The month to sync, will be the current month by default',
  )
  .action(async (options: { directory?: string; month?: string }) => {
    const r2 = getR2AWS(process.env)
    const { db, pool } = getIntelligenceDB(process.env)

    try {
      await processNumbeo(
        { s3: r2, db },
        options.directory
          ? { type: 'fs', directory: options.directory }
          : { type: 's3', bucket: process.env.DATA_SNAPSHOTS_BUCKET },
        options.month,
      )
    } finally {
      await pool.end()
    }
  })
