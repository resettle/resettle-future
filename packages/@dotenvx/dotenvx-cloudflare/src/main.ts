#!/usr/bin/env tsx

import { Command } from 'commander'
import { spawn } from 'node:child_process'
import path from 'node:path'

interface RunOptions {
  file: string
  exclude?: string
  include?: string
}

const OUTPUT_FILE = '.dev.vars'

const program = new Command()

program
  .name('dotenvx-cloudflare')
  .description(
    'Wrapper around dotenvx for Cloudflare Workers that filters environment variables',
  )
  .version('1.0.0')

program
  .command('run')
  .description('Run a command with environment variables from .env file')
  .option('-f, --file <path>', 'Path to .env file', '.env')
  .option(
    '-e, --exclude <patterns>',
    'Pipe-separated exclude patterns (e.g., "DOTENV_|VITE_")',
  )
  .option(
    '-i, --include <patterns>',
    'Pipe-separated include patterns (e.g., "PUBLIC_|API_")',
  )
  .arguments('[command...]')
  .allowUnknownOption()
  .action(async (commandArgs: string[], options: RunOptions) => {
    const envFilePath = path.resolve(process.cwd(), options.file)
    const outputPath = path.resolve(process.cwd(), OUTPUT_FILE)

    // Check that -i and -e are mutually exclusive
    if (options.include && options.exclude) {
      console.error(
        '[dotenvx-cloudflare] Error: -i (include) and -e (exclude) are mutually exclusive',
      )
      process.exit(1)
    }

    // Build the grep command based on include or exclude
    let grepCommand: string
    if (options.include) {
      // Include: only keep lines starting with the patterns
      const includePattern = `^(${options.include.split('|').join('|')})`
      grepCommand = `grep -E '${includePattern}'`
    } else if (options.exclude) {
      // Exclude: remove lines starting with the patterns
      const excludePattern = `^(${options.exclude.split('|').join('|')})`
      grepCommand = `grep -v -E '${excludePattern}'`
    } else {
      // No filtering
      grepCommand = 'cat'
    }

    // Get the command to run (everything after the options)
    const commandToRun = commandArgs.length > 0 ? commandArgs.join(' ') : ''

    try {
      // Step 1: Decrypt and filter environment variables
      await new Promise<void>((resolve, reject) => {
        const decryptProcess = spawn(
          'sh',
          [
            '-c',
            `dotenvx decrypt -f ${envFilePath} --stdout | ${grepCommand} > ${outputPath}`,
          ],
          { stdio: ['inherit', 'pipe', 'pipe'] },
        )

        let stderr = ''
        decryptProcess.stderr?.on('data', (data: Buffer) => {
          stderr += data.toString()
        })

        decryptProcess.on('close', (code: number | null) => {
          if (code !== 0) {
            console.error('[dotenvx-cloudflare] Error:', stderr)
            reject(new Error(`Process exited with code ${code}`))
          } else {
            resolve()
          }
        })

        decryptProcess.on('error', (err: Error) => {
          reject(err)
        })
      })

      // Step 2: Run the command with dotenvx if a command was provided
      if (commandToRun) {
        await new Promise<void>((resolve, reject) => {
          const runProcess = spawn(
            'sh',
            [
              '-c',
              `dotenvx run -f ${envFilePath} --overload -- ${commandToRun}`,
            ],
            { stdio: 'inherit' },
          )

          runProcess.on('close', (code: number | null) => {
            if (code !== 0) {
              reject(new Error(`Command exited with code ${code}`))
            } else {
              resolve()
            }
          })

          runProcess.on('error', (err: Error) => {
            reject(err)
          })
        })
      } else {
        console.log(
          `[dotenvx-cloudflare] No command specified, only generated ${OUTPUT_FILE}`,
        )
      }
    } catch (error) {
      console.error('[dotenvx-cloudflare] Error:', error)
      process.exit(1)
    }
  })

program.parse()
