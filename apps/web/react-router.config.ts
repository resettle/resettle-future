import type { Config } from '@react-router/dev/config'

export default {
  ssr: true,
  future: {
    v8_middleware: true,
    unstable_viteEnvironmentApi: true,
    unstable_optimizeDeps: true,
  },
  async prerender() {
    return [
      /**
       * SEO Routes
       */
      'robots.txt',
      'sitemap.xml',

      /**
       * Legal Routes
       */
      'terms',
      'privacy',
    ]
  },
} satisfies Config
