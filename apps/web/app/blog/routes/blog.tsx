import { useLoaderData } from "react-router"

export async function loader() {
  const blogPosts = await fetch(`${import.meta.env.VITE_DIRECTUS_URL}/items/blog_post`, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${import.meta.env.VITE_SERVER_DIRECTUS_API_TOKEN}`,
    },
  })

  const blogTags = await fetch(`${import.meta.env.VITE_DIRECTUS_URL}/items/blog_tag`, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${import.meta.env.VITE_SERVER_DIRECTUS_API_TOKEN}`,
    },
  })

  return {
    blogPosts: await blogPosts.json<{ data: any[] }>(),
    blogTags: await blogTags.json<{ data: any[] }>(),
  }
}

export default function Blog() {
  const { blogPosts, blogTags } = useLoaderData<typeof loader>()

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Header */}
        <header className="mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Blog</h1>
          <p className="text-gray-600">Thoughts, stories, and insights</p>
        </header>

        {/* Tags */}
        {blogTags?.data?.length > 0 && (
          <div className="mb-8">
            <div className="flex flex-wrap gap-2">
              {blogTags.data.map((tag: any) => (
                <span
                  key={tag.id}
                  className="px-3 py-1 bg-white border border-gray-200 rounded-full text-sm text-gray-700 hover:border-gray-300 transition-colors cursor-pointer"
                >
                  {tag.name}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Blog Posts */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {blogPosts?.data?.map((post: any) => (
            <article
              key={post.id}
              className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow overflow-hidden border border-gray-100"
            >
              {post.image && (
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-full h-48 object-cover"
                />
              )}
              <div className="p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-2">
                  {post.title}
                </h2>
                {post.excerpt && (
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                    {post.excerpt}
                  </p>
                )}
                {post.date_created && (
                  <time className="text-xs text-gray-500">
                    {new Date(post.date_created).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </time>
                )}
              </div>
            </article>
          ))}
        </div>

        {/* Empty State */}
        {(!blogPosts?.data || blogPosts.data.length === 0) && (
          <div className="text-center py-12">
            <p className="text-gray-500">No blog posts yet. Check back soon!</p>
          </div>
        )}
      </div>
    </div>
  )
}
