import { Command } from 'commander'

import { injectCommand } from './inject'
import { scrapeCommand } from './scrape'

export const intelligenceCommand = new Command()
  .name('intelligence')
  .description('Resettle Intelligence CLI tool')
  .addCommand(injectCommand)
  .addCommand(scrapeCommand)
