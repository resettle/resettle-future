import { getBlogArticles } from '~/blog/handlers/blog-article'
import { PAGE_ROUTES } from '~/common/routes'

interface SitemapUrl {
  loc: string
  lastmod?: string
  priority?: number
  changefreq?: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never'
}

/**
 * Generate sitemap entries for blog articles
 */
export async function generateBlogSitemap(baseUrl: string): Promise<SitemapUrl[]> {
  const blogArticles = await getBlogArticles({
    filter: { status: 'published' },
  })

  return blogArticles.map(article => ({
    loc: `${baseUrl}${PAGE_ROUTES.blog.slug.buildSlashedPath({ slug: article.slug })}`,
    lastmod: article.updated_at.toISOString(),
    priority: 0.7,
    changefreq: 'weekly' as const,
  }))
}

/**
 * Generate the complete sitemap XML
 */
export async function generateSitemap(baseUrl: string): Promise<string> {
  const urls: SitemapUrl[] = []

  // Add static pages
  urls.push(
    {
      loc: `${baseUrl}${PAGE_ROUTES.index.slashedPath}`,
      priority: 1.0,
      changefreq: 'daily',
    },
    {
      loc: `${baseUrl}${PAGE_ROUTES.blog.slashedPath}`,
      priority: 0.8,
      changefreq: 'daily',
    },
  )

  // Add blog articles
  const blogUrls = await generateBlogSitemap(baseUrl)
  urls.push(...blogUrls)

  // Generate XML
  const urlEntries = urls
    .map(
      url => `
  <url>
    <loc>${url.loc}</loc>
    ${url.lastmod ? `<lastmod>${url.lastmod}</lastmod>` : ''}
    ${url.priority !== undefined ? `<priority>${url.priority}</priority>` : ''}
    ${url.changefreq ? `<changefreq>${url.changefreq}</changefreq>` : ''}
  </url>`,
    )
    .join('')

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urlEntries}
</urlset>`
}

