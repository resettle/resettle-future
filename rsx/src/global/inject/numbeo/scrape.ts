import {
  downloadCitySlugs,
  downloadCountrySlugs,
  downloadData,
} from '@resettle/processors'
import { Command } from 'commander'
import { z } from 'zod'

import { getR2 } from '../../../_common/context'

const PAGE_SIZE = 100

export const scrapeCommand = new Command()
  .name('scrape')
  .description(
    'Scrape latest numbeo data, with possible specified page(s) to scrape',
  )
  .option('--start-page <start>', 'Start page, 0 is the first page')
  .option('--end-page <end>', 'End page')
  .option(
    '--directory <directory>',
    'The local directory that stores the files',
  )
  .action(
    async (options: {
      startPage?: string
      endPage?: string
      directory?: string
    }) => {
      const r2 = getR2(process.env)
      const countries = await downloadCountrySlugs(
        { s3: r2 },
        options.directory
          ? { type: 'fs', directory: options.directory }
          : { type: 's3', bucket: process.env.DATA_SNAPSHOTS_BUCKET },
      )
      const cities = await downloadCitySlugs(
        { s3: r2 },
        options.directory
          ? { type: 'fs', directory: options.directory }
          : { type: 's3', bucket: process.env.DATA_SNAPSHOTS_BUCKET },
        5000,
      )
      const amount = Object.values(cities)
        .map(collection => collection.length)
        .reduce((p, c) => p + c, 0)
      const maxPage = Math.ceil(amount / PAGE_SIZE) - 1
      const validator = z.int().min(0).max(maxPage)
      let startPage = options.startPage ?? '0'
      let endPage = options.endPage ?? maxPage.toString()
      const startParsed = validator.safeParse(startPage)
      if (!startParsed.success) {
        console.log(`Invalid start page, must be between 0 and ${maxPage}`)
        return
      }
      const endParsed = validator.safeParse(endPage)
      if (!endParsed.success) {
        console.log(`Invalid end page, must be between 0 and ${maxPage}`)
        return
      }

      await downloadData(
        { s3: r2 },
        options.directory
          ? { type: 'fs', directory: options.directory }
          : { type: 's3', bucket: process.env.DATA_SNAPSHOTS_BUCKET },
        countries,
        cities,
        startParsed.data,
        endParsed.data,
        5000,
      )
    },
  )
