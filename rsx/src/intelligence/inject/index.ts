import { Command } from 'commander'

import { exchangeRateCommand } from './exchange-rate'
import { geonamesCommand } from './geonames'
import { numbeoCommand } from './numbeo'
import { occupationCommand } from './occupation'

export const injectCommand = new Command()
  .name('inject')
  .description('Data injection CLI tool')
  .addCommand(exchangeRateCommand)
  .addCommand(geonamesCommand)
  .addCommand(numbeoCommand)
  .addCommand(occupationCommand)
