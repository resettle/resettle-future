import { processGeonames } from '@resettle/processors'
import { Command } from 'commander'
import { resolve } from 'node:path'
import { cwd } from 'node:process'

import { getGlobalDB, getR2 } from '../../_common/context'

export const geonamesCommand = new Command()
  .name('geonames')
  .description('Inject latest geonames data')
  .option('--directory <directory>', 'The local directory containing the files')
  .action(async (options: { directory?: string }) => {
    const r2 = getR2(process.env)
    const { db, pool } = getGlobalDB(process.env)

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
