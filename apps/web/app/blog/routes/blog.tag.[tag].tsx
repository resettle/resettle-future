import type { Route } from './+types/blog.tag.[tag]'

export default function BlogTagPage({ params }: Route.ComponentProps) {
  return <div>BlogTagPage {params.tag}</div>
}
