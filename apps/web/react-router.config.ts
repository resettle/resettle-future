import type { Config } from '@react-router/dev/config'

import { getBlogArticles } from './app/blog/handlers/blog-article'

export default {
  ssr: true,
  future: {
    v8_middleware: true,
    v8_viteEnvironmentApi: true,
    unstable_optimizeDeps: true,
  },
  async prerender() {
    const blogArticles = await getBlogArticles({})
    const blogArticlePaths = blogArticles.map(
      article => `/blog/${article.slug}`,
    )

    return [
      /**
       * SEO Routes
       */
      '/robots.txt',
      '/sitemap.xml',

      /**
       * Legal Routes
       */
      '/terms',
      '/privacy',

      /**
       * Landing Page Routes
       */
      '/',
      '/dev',
      '/blog',
      ...blogArticlePaths,
    ]
  },
} satisfies Config
