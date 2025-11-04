#!/usr/bin/env tsx

import { Command } from 'commander'

import { globalCommand } from './global'

try {
  await new Command()
    .name('rsx')
    .description(`Resettle CLI [${process.env.ENV}]`)
    .version('1.0.0')
    .addCommand(globalCommand)
    .parseAsync(process.argv)
} catch (error) {
  console.error(error)
  process.exit(1)
}
