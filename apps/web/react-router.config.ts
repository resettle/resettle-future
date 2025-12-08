import type { Config } from '@react-router/dev/config'

import { getBlogPosts } from './app/blog/handlers/blog-post'

export default {
  ssr: true,
  future: {
    v8_middleware: true,
    v8_viteEnvironmentApi: true,
    unstable_optimizeDeps: true,
  },
  async prerender() {
    const { data: blogPosts } = await getBlogPosts()

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

      /**
       * Blog Routes
       */
      'blog',
      ...blogPosts.map(blogPost => `blog/${blogPost.id}`),
    ]
  },
} satisfies Config
