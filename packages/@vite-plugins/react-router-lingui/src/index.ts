import * as babel from '@babel/core'
import {
  createCompilationErrorMessage,
  createCompiledCatalog,
  createMissingErrorMessage,
  getCatalogDependentFiles,
  getCatalogForFile,
  getCatalogs,
} from '@lingui/cli/api'
import { getConfig } from '@lingui/conf'
import { createRequire } from 'module'
import path from 'node:path'
import type { Plugin, TransformResult } from 'vite'

const require = createRequire(import.meta.url)

const sourceRegex = /\.(j|t)sx?(\?[^?]*)?$/
const tsxRegex = /\.(j|t)sx?(\?[^?]*)?$/ // all files are being interpreted as TS, so we'll treat JSX as TSX

const fileRegex = /(\.po|\?lingui)$/

export type LinguiPluginOpts = {
  cwd?: string
  configPath?: string
  skipValidation?: boolean

  /**
   * If true would fail compilation on missing translations
   **/
  failOnMissing?: boolean

  /**
   * If true would fail compilation on message compilation errors
   **/
  failOnCompileError?: boolean
}

export default function lingui({
  failOnMissing,
  failOnCompileError,
  ...linguiConfig
}: LinguiPluginOpts = {}): Plugin[] {
  const config = getConfig(linguiConfig)

  if (!config.macro || !config.macro.corePackage || !config.macro.jsxPackage) {
    throw new Error('Lingui macro config is not found')
  }

  const macroIds = new Set([
    ...config.macro.corePackage,
    ...config.macro.jsxPackage,
  ])

  return [
    {
      name: 'react-router-lingui-babel-macros',
      enforce: 'pre',
      async transform(source: string, filename: string) {
        if (filename.includes('node_modules')) {
          return undefined
        }

        if (!sourceRegex.test(filename)) {
          return undefined
        }

        const result = await babel.transformAsync(source, {
          filename,
          sourceFileName: filename.split('?')[0],
          plugins: [
            require.resolve('@babel/plugin-syntax-jsx'),
            [
              require.resolve('@babel/plugin-syntax-typescript'),
              { isTSX: tsxRegex.test(filename) },
            ],
            require.resolve('@lingui/babel-plugin-lingui-macro'),
          ],
          babelrc: false,
          configFile: false,
          sourceMaps: true,
        })

        return result as TransformResult | null
      },
    },
    {
      name: 'react-router-lingui',
      config: config => {
        // https://github.com/lingui/js-lingui/issues/1464
        config.optimizeDeps ??= {}
        config.optimizeDeps.exclude = config.optimizeDeps.exclude || []

        for (const macroId of macroIds) {
          config.optimizeDeps.exclude.push(macroId)
        }
      },
      async transform(_, id) {
        if (!fileRegex.test(id)) {
          return undefined
        }

        id = id.split('?')[0]

        const catalogRelativePath = path.relative(config.rootDir!, id)

        const fileCatalog = getCatalogForFile(
          catalogRelativePath,
          await getCatalogs(config),
        )

        if (!fileCatalog) {
          throw new Error(
            `Requested resource ${catalogRelativePath} is not matched to any of your catalogs paths specified in "lingui.config".

Resource: ${id}

Your catalogs:
${config.catalogs!.map(c => c.path).join('\n')}
Please check that catalogs.path is filled properly.\n`,
          )
        }

        const { locale, catalog } = fileCatalog

        const dependency = await getCatalogDependentFiles(catalog, locale)

        dependency.forEach(file => this.addWatchFile(file))

        const { messages, missing: missingMessages } =
          await catalog.getTranslations(locale, {
            fallbackLocales: config.fallbackLocales!,
            sourceLocale: config.sourceLocale!,
          })

        if (
          failOnMissing &&
          locale !== config.pseudoLocale &&
          missingMessages.length > 0
        ) {
          const message = createMissingErrorMessage(
            locale,
            missingMessages,
            'loader',
          )

          throw new Error(
            `${message}\nYou see this error because \`failOnMissing=true\` in Vite Plugin configuration.`,
          )
        }

        const { source: code, errors } = createCompiledCatalog(
          locale,
          messages,
          {
            namespace: 'es',
            pseudoLocale: config.pseudoLocale,
          },
        )

        if (errors.length) {
          const message = createCompilationErrorMessage(locale, errors)

          if (failOnCompileError) {
            throw new Error(
              message +
                `These errors fail build because \`failOnCompileError=true\` in Lingui Vite plugin configuration.`,
            )
          } else {
            console.warn(
              message +
                `You can fail the build on these errors by setting \`failOnCompileError=true\` in Lingui Vite Plugin configuration.`,
            )
          }
        }

        return {
          code,
          map: null, // provide source map if available
        }
      },
    },
  ]
}
