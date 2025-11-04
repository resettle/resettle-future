import { Command } from 'commander'

import { injectCommand } from './inject'

export const globalCommand = new Command()
  .name('global')
  .description('Resettle Global CLI tool')
  .addCommand(injectCommand)
