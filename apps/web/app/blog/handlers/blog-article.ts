import { blogArticleSchema, type BlogArticle } from '@resettle/schema/directus'

import { directusClient } from '../libs/directus'

// Fields to fetch from the API
const BLOG_ARTICLE_FIELDS = [
  'id',
  'slug',
  'title',
  'tags',
  'takeaways',
  'cover_image',
  'content',
  'status',
  'author',
  'created_at',
  'updated_at',
].join(',')

/**
 * Get the blog articles from the Directus API
 * @returns The blog articles from the Directus API
 */
export async function getBlogArticles({
  filter = {},
  fields = BLOG_ARTICLE_FIELDS,
}: {
  filter?: Record<string, unknown>
  fields?: string
}): Promise<BlogArticle[]> {
  const queryParams = new URLSearchParams()

  if (Object.keys(filter).length > 0) {
    queryParams.append('filter', JSON.stringify(filter))
  }

  queryParams.append('fields', fields)
  queryParams.append('sort', '-created_at') // Sort by newest first

  const res = await directusClient.request<{ data: BlogArticle[] }>(
    `/items/blog_article?${queryParams.toString()}`,
  )

  return res.data.map(article => blogArticleSchema.parse(article))
}

/**
 * Get a blog article by its ID
 * @param blogId - The ID of the blog article
 * @returns The blog article from the Directus API
 */
export async function getBlogArticleById(
  blogId: number,
  fields = BLOG_ARTICLE_FIELDS,
) {
  const res = await directusClient.request<{ data: BlogArticle }>(
    `/items/blog_article/${blogId}?fields=${fields}`,
  )

  return blogArticleSchema.parse(res.data)
}
