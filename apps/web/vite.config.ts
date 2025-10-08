import { cloudflare } from '@cloudflare/vite-plugin'
import { reactRouter } from '@react-router/dev/vite'
import tailwindcss from '@tailwindcss/vite'
import reactRouterPrerender from '@vite-plugins/react-router-prerender'
import { defineConfig } from 'vite'
import svgr from 'vite-plugin-svgr'
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
  server: {
    host: '0.0.0.0',
    port: 5173,
  },
  plugins: [
    cloudflare({
      viteEnvironment: { name: 'ssr' },
      experimental: {
        headersAndRedirectsDevModeSupport: true,
      },
      inspectorPort: 9250,
    }),
    reactRouter(),
    reactRouterPrerender(),
    svgr(),
    tailwindcss(),
    tsconfigPaths(),
  ],
  build: {
    rollupOptions: {
      onwarn(warning, warn) {
        if (
          warning.code === 'MODULE_LEVEL_DIRECTIVE' ||
          warning.code === 'SOURCEMAP_ERROR'
        ) {
          return
        }

        warn(warning)
      },
    },
  },
})
