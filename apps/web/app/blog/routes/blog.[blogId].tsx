import { useLoaderData } from 'react-router'

import type { Route } from './+types/blog.[blogId]'

export async function loader({ params }: Route.ComponentProps) {
  const blogPost = await fetch(`${import.meta.env.VITE_DIRECTUS_URL}/items/blog_post/${params.blogId}`, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${import.meta.env.VITE_SERVER_DIRECTUS_API_TOKEN}`,
    },
  })

  return { blogPost: await blogPost.json<{ data: any }>() }
}

export default function BlogPage({ params }: Route.ComponentProps) {
  const { blogPost } = useLoaderData<typeof loader>()
  return <div>BlogPage {params.blogId} {JSON.stringify(blogPost)}</div>
}
