import { search, select } from '@inquirer/prompts'
import type { ScrapeTaskType } from '@resettle/schema/intelligence'
import scrapers from '@resettle/scrapers'
import { Command } from 'commander'

import { getIntelligenceDB } from '../../_common/context'

export const jobCommand = new Command()
  .name('job')
  .description('Scrape job opportunities')
  .option('--source <source>', 'The source to scrape')
  .option(
    '--type <type>',
    'The type of the scrape, can be either brief or full',
  )
  .action(async (options: { source?: string; type?: ScrapeTaskType }) => {
    const candidates = Object.keys(scrapers) as string[]
    const { pool } = getIntelligenceDB(process.env)
    let source = options.source
    let type = options.type

    if (!source) {
      source = await search({
        message: 'Select a source to scrape',
        source: async input => {
          if (!input) return []

          return candidates
            .filter(c => c.startsWith(input.toLowerCase()))
            .map(c => ({ name: c, value: c }))
        },
      })
    }

    if (!type) {
      type = await select({
        message: 'Select a type of scrape',
        choices: ['brief', 'full'],
      })
    }

    if (!candidates.includes(source)) {
      console.log(`Source ${source} not exist`)
      return
    }

    if (type !== 'brief' && type !== 'full') {
      console.log(`Type ${type} not exist`)
      return
    }

    try {
    } finally {
      await pool.end()
    }
  })
