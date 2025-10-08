import type { Route } from './+types/blog.[slug]'

export default function BlogPage({ params }: Route.ComponentProps) {
  return <div>BlogPage {params.slug}</div>
}
