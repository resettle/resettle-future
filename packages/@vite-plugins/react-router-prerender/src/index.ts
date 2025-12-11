import fs from 'node:fs/promises'
import path from 'node:path'
import type { Plugin, ResolvedConfig } from 'vite'

const CLOUDFLARE_SHIM = `globalThis.Cloudflare??={};globalThis.Cloudflare.compatibilityFlags??={};globalThis.Cloudflare.compatibilityFlags.enable_nodejs_process_v2??=false;\n`

export default function reactRouterPrerender(): Plugin {
  let config: ResolvedConfig

  return {
    name: 'react-router-prerender',
    enforce: 'pre',
    configResolved(resolvedConfig) {
      config = resolvedConfig
    },
    writeBundle: async () => {
      // Cloudflare: Shimming globalThis.Cloudflare.compatibilityFlags.enable_nodejs_process_v2
      try {
        const assetsPath = path.resolve(config.root, 'build/server/assets')
        const files = await fs.readdir(assetsPath)
        const workerEntryFile = files.find(file =>
          file.startsWith('worker-entry-'),
        )

        if (!workerEntryFile) {
          throw new Error('Worker entry file not found')
        }

        const outputFilePath = path.resolve(assetsPath, workerEntryFile)

        await fs.access(outputFilePath)

        const outputFile = await fs.readFile(outputFilePath, 'utf-8')
        const newOutputFile = CLOUDFLARE_SHIM + outputFile

        await fs.writeFile(outputFilePath, newOutputFile)

        console.log(
          `[react-router-prerender] Cloudflare: Shimmed ${workerEntryFile}`,
        )
      } catch {}
    },
    closeBundle: async () => {
      if (config.command === 'build') {
        // SEO: Removing trailing slashes from all files in build/client subdirectories
        try {
          const buildPath = path.join(config.root, 'build/client')
          const files = await fs.readdir(buildPath, {
            withFileTypes: true,
            recursive: true,
          })

          const htmlFiles = files.filter(
            file =>
              file.isFile() &&
              file.name.endsWith('.html') &&
              file.parentPath !== buildPath,
          )

          for (const file of htmlFiles) {
            const filePath = path.resolve(file.parentPath, file.name)
            const newFilePath = path.resolve(`${file.parentPath}.html`)

            await fs.cp(filePath, newFilePath, { force: true, recursive: true })
            await fs.rm(filePath, { force: true, recursive: true })

            const parentFolder = path.resolve(file.parentPath)
            const parentFolderFiles = await fs.readdir(parentFolder)

            if (parentFolderFiles.length === 0) {
              await fs.rm(parentFolder, { force: true, recursive: true })
            }

            console.log(
              `[react-router-prerender] SEO: Processed ${path.basename(file.parentPath)}.html`,
            )
          }
        } catch {}
      }
    },
  }
}
