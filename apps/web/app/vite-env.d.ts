interface ImportMeta {
  readonly env: ImportMetaEnv & {
    [K in keyof NodeJS.ProcessEnv as K extends `VITE_${string}`
      ? K
      : never]: NodeJS.ProcessEnv[K]
  }
}
