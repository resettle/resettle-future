import { directusFetch } from '../libs/directus'
import type { BlogPost } from '../libs/types'

/**
 * Get the blog posts from the Directus API
 * @returns The blog posts from the Directus API
 */
export async function getBlogPosts() {
  return directusFetch<{ data: BlogPost[] }>('/items/blog_post')
}

/**
 * Get a blog post by its ID
 * @param blogId - The ID of the blog post
 * @returns The blog post from the Directus API
 */
export async function getBlogPostById(blogId: string) {
  return directusFetch<{ data: BlogPost }>(`/items/blog_post/${blogId}`)
}
