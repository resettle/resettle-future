#!/usr/bin/env tsx

import { Command } from 'commander'
import fs from 'node:fs/promises'
import path from 'node:path'
import prettier from 'prettier'

const program = new Command()

program
  .name('dotenvx-typegen')
  .description('Generate TypeScript declarations from .env files')
  .option('-f, --file <path>', 'Path to .env file', '.env')
  .option(
    '-e, --exclude <patterns>',
    'Pipe-separated exclude patterns (e.g., "DOTENV_|VITE_")',
  )
  .option(
    '-i, --include <patterns>',
    'Pipe-separated include patterns (e.g., "PUBLIC_|API_")',
  )
  .option('-o, --output <path>', 'Output file path', 'node-env.d.ts')
  .parse()

const options = program.opts()

// Check that -i and -e are mutually exclusive
if (options.include && options.exclude) {
  console.error(
    '[dotenvx-typegen] Error: -i (include) and -e (exclude) are mutually exclusive',
  )
  process.exit(1)
}

// Parse patterns from pipe-separated string
const excludePatterns = options.exclude ? options.exclude.split('|') : []
const includePatterns = options.include ? options.include.split('|') : []

const envFileContent = await fs.readFile(
  path.resolve(process.cwd(), options.file),
  'utf8',
)

const envVars = envFileContent
  .split('\n')
  .filter(line => {
    if (line.trim().length === 0 || line.startsWith('#')) {
      return false
    }

    // If include patterns are specified, only keep lines starting with those patterns
    if (includePatterns.length > 0) {
      for (const pattern of includePatterns) {
        if (line.startsWith(pattern.trim())) {
          return true
        }
      }
      return false
    }

    // If exclude patterns are specified, remove lines starting with those patterns
    if (excludePatterns.length > 0) {
      for (const pattern of excludePatterns) {
        if (line.startsWith(pattern.trim())) {
          return false
        }
      }
    }

    return true
  })
  .map(line => {
    const [key] = line.split('=')

    if (key === 'ENV' || key === 'VITE_ENV') {
      return [key, '"development" | "staging" | "production"']
    }

    return [key, 'string']
  })

const outputPath = path.resolve(process.cwd(), options.output)

await fs.writeFile(
  outputPath,
  await prettier.format(
    `declare namespace NodeJS {
    interface ProcessEnv {
      ${envVars.map(([key, type]) => `${key}: ${type}`).join('\n')}
    }
  }`,
    {
      parser: 'typescript',
      arrowParens: 'avoid',
      semi: false,
      singleQuote: true,
      trailingComma: 'all',
    },
  ),
  'utf8',
)

console.log(
  `[dotenvx-typegen] Generated TypeScript declarations in ${outputPath}`,
)
console.log(
  `[dotenvx-typegen] Processed ${envVars.length} environment variables from ${options.file}`,
)
