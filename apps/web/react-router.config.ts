import type { Config } from '@react-router/dev/config'

export default {
  ssr: true,
  future: {
    v8_middleware: true,
    unstable_viteEnvironmentApi: true,
    unstable_optimizeDeps: true,
  },
  async prerender() {
    const blogPostsResponse = await fetch(`${process.env.VITE_DIRECTUS_URL}/items/blog_post`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.VITE_SERVER_DIRECTUS_API_TOKEN}`,
      },
    })
    const blogPosts = await blogPostsResponse.json()
    const blogPostIds = blogPosts.data.map((post: any) => post.id)

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
      ...blogPostIds.map((blogId: string) => `blog/${blogId}`),
    ]
  },
} satisfies Config
