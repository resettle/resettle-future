import { directusFetch } from '../libs/directus'
import type { BlogTag } from '../libs/types'

/**
 * Get the blog tags from the Directus API
 * @returns The blog tags from the Directus API
 */
export async function getBlogTags() {
  return directusFetch<{ data: BlogTag[] }>('/items/blog_tag')
}
