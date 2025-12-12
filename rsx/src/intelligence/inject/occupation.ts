import { processOccupation } from '@resettle/processors/intelligence-node'
import { Command } from 'commander'

import { getIntelligenceDB, getR2AWS } from '../../_common/context'

export const occupationCommand = new Command()
  .name('occupation')
  .description('Inject latest occupation data')
  .option('--directory <directory>', 'The local directory containing the files')
  .action(async (options: { directory?: string }) => {
    const r2 = getR2AWS(process.env)
    const { db, pool } = getIntelligenceDB(process.env)

    try {
      await processOccupation(
        { s3: r2, db },
        options.directory
          ? { type: 'fs', directory: options.directory }
          : { type: 's3', bucket: process.env.DATA_SNAPSHOTS_BUCKET },
      )
    } finally {
      await pool.end()
    }
  })
