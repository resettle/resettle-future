import { processGeonames } from '@resettle/processors/intelligence-node'
import { Command } from 'commander'
import { resolve } from 'node:path'
import { cwd } from 'node:process'

import { getIntelligenceDB, getR2AWS } from '../../_common/context'

export const geonamesCommand = new Command()
  .name('geonames')
  .description('Inject latest geonames data')
  .option('--directory <directory>', 'The local directory containing the files')
  .action(async (options: { directory?: string }) => {
    const r2 = getR2AWS(process.env)
    const { db, pool } = getIntelligenceDB(process.env)

    try {
      await processGeonames(
        { s3: r2, db },
        options.directory
          ? { type: 'fs', directory: options.directory }
          : { type: 's3', bucket: process.env.DATA_SNAPSHOTS_BUCKET },
        resolve(cwd(), '.rsx', 'all-countries.txt'),
      )
    } finally {
      await pool.end()
    }
  })
