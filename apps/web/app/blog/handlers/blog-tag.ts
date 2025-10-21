import type { BlogTag } from '@resettle/schema/directus'

import { directusClient } from '../libs/directus'

/**
 * Get the blog tags from the Directus API
 * @returns The blog tags from the Directus API
 */
export async function getBlogTags() {
  return directusClient.request<{ data: BlogTag[] }>('/items/blog_tag')
}
