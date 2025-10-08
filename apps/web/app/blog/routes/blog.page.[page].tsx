import type { Route } from './+types/blog.page.[page]'

export default function BlogPage({ params }: Route.ComponentProps) {
  return <div>BlogPage {params.page}</div>
}
