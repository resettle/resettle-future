import { Command } from 'commander'

import { jobCommand } from './job'

export const scrapeCommand = new Command()
  .name('scrape')
  .description('Opportunity scraping commands')
  .addCommand(jobCommand)
