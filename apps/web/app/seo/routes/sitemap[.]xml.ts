import { generateSitemap } from '../libs/sitemap.server'

export async function loader({ request }: { request: Request }) {
  const url = new URL(request.url)
  const baseUrl = `${url.protocol}//${url.host}`

  const sitemap = await generateSitemap(baseUrl)

  return new Response(sitemap, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=3600',
    },
  })
}
