import Markdown from 'react-markdown'
import { useLoaderData } from 'react-router'

import { getBlogPostById } from '../handlers/blog-post'
import type { Route } from './+types/blog.[blogId]'

export async function loader({ params }: Route.ComponentProps) {
  const { data: blogPost } = await getBlogPostById(params.blogId)

  return { blogPost }
}

export default function BlogPage({ params }: Route.ComponentProps) {
  const { blogPost } = useLoaderData<typeof loader>()
  return (
    <div>
      <h1>{blogPost.title}</h1>
      <Markdown>{blogPost.content}</Markdown>
    </div>
  )
}
