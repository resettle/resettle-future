import { Command } from 'commander'

import { injectCommand } from './inject'

export const intelligenceCommand = new Command()
  .name('intelligence')
  .description('Resettle Intelligence CLI tool')
  .addCommand(injectCommand)
