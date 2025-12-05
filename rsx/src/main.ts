#!/usr/bin/env tsx

import { Command } from 'commander'

import { intelligenceCommand } from './intelligence'

try {
  await new Command()
    .name('rsx')
    .description(`Resettle CLI [${process.env.ENV}]`)
    .version('1.0.0')
    .addCommand(intelligenceCommand)
    .parseAsync(process.argv)
} catch (error) {
  console.error(error)
  process.exit(1)
}
