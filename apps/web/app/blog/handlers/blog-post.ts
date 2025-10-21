import type { BlogPost } from '@resettle/schema/directus'

import { directusClient } from '../libs/directus'

/**
 * Get the blog posts from the Directus API
 * @returns The blog posts from the Directus API
 */
export async function getBlogPosts() {
  return directusClient.request<{ data: BlogPost[] }>('/items/blog_post')
}

/**
 * Get a blog post by its ID
 * @param blogId - The ID of the blog post
 * @returns The blog post from the Directus API
 */
export async function getBlogPostById(blogId: string) {
  return directusClient.request<{ data: BlogPost }>(
    `/items/blog_post/${blogId}`,
  )
}
