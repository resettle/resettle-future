import { useLoaderData } from 'react-router'

import { getBlogPosts } from '../handlers/blog-post'
import { getBlogTags } from '../handlers/blog-tag'

export async function loader() {
  const { data: blogPosts } = await getBlogPosts()
  const { data: blogTags } = await getBlogTags()

  return { blogPosts, blogTags }
}

export default function Blog() {
  const { blogPosts, blogTags } = useLoaderData<typeof loader>()

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-6xl px-4 py-12">
        {/* Header */}
        <header className="mb-12">
          <h1 className="mb-2 text-4xl font-bold text-gray-900">Blog</h1>
          <p className="text-gray-600">Thoughts, stories, and insights</p>
        </header>

        {/* Tags */}
        {blogTags.length > 0 && (
          <div className="mb-8">
            <div className="flex flex-wrap gap-2">
              {blogTags.map(tag => (
                <span
                  key={tag.id}
                  className="cursor-pointer rounded-full border border-gray-200 bg-white px-3 py-1 text-sm text-gray-700 transition-colors hover:border-gray-300"
                >
                  {tag.name}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Blog Posts */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {blogPosts.map(post => (
            <article
              key={post.id}
              className="overflow-hidden rounded-lg border border-gray-100 bg-white shadow-sm transition-shadow hover:shadow-md"
            >
              <div className="p-6">
                <h2 className="mb-2 text-xl font-semibold text-gray-900">
                  {post.title}
                </h2>
                {post.date_created && (
                  <time className="text-xs text-gray-500">
                    {new Date(post.date_created).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </time>
                )}
              </div>
            </article>
          ))}
        </div>

        {/* Empty State */}
        {(!blogPosts || blogPosts.length === 0) && (
          <div className="py-12 text-center">
            <p className="text-gray-500">No blog posts yet. Check back soon!</p>
          </div>
        )}
      </div>
    </div>
  )
}
