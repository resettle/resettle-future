import { Command } from 'commander'

import { scrapeCommand } from './scrape'
import { syncCommand } from './sync'

export const numbeoCommand = new Command()
  .name('numbeo')
  .description('Numbeo related commands')
  .addCommand(scrapeCommand)
  .addCommand(syncCommand)
