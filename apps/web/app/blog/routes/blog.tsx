import { Link, useLoaderData } from 'react-router'

import { PAGE_ROUTES } from '~/common/routes'
import { getBlogArticles } from '../handlers/blog-article'
import type { Route } from './+types/blog'

export async function loader() {
  const blogArticles = await getBlogArticles({})

  return { blogArticles }
}

export function meta({}: Route.MetaArgs) {
  return [
    { title: 'Blog | Resettle' },
    {
      name: 'description',
      content:
        'Explore insights, stories, and helpful resources about immigration, visas, and relocating to new countries.',
    },
    {
      name: 'keywords',
      content:
        'immigration blog, visa information, relocation tips, moving abroad, immigration stories',
    },
  ]
}

function formatDate(dateString: string) {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

function calculateReadingTime(content: string) {
  const wordsPerMinute = 200
  const wordCount = content.trim().split(/\s+/).length
  const minutes = Math.ceil(wordCount / wordsPerMinute)
  return minutes
}

export default function Blog() {
  const { blogArticles } = useLoaderData<typeof loader>()

  return (
    <main className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-12 sm:py-16">
        {/* Header */}
        <header className="mb-12 text-center sm:mb-16 lg:mb-20">
          <h1 className="mb-3 text-4xl font-light tracking-tight text-gray-900 sm:mb-4 sm:text-5xl lg:text-6xl">
            Blog
          </h1>
          <p className="mx-auto max-w-2xl text-base text-gray-600 sm:text-lg">
            Thoughts, stories, and insights
          </p>
        </header>

        {/* Blog Posts */}
        <div className="grid gap-8 sm:gap-10 md:grid-cols-2 lg:gap-12">
          {blogArticles.map(article => (
            <Link
              key={article.id}
              to={PAGE_ROUTES.blog.slug.buildSlashedPath({
                slug: article.slug,
              })}
              className="group"
            >
              <article className="flex h-full flex-col">
                {/* Cover Image */}
                {article.cover_image && (
                  <div className="mb-4 aspect-4/3 overflow-hidden rounded-lg sm:mb-6 sm:aspect-video">
                    <img
                      src={`${import.meta.env.VITE_ASSETS_URL}/directus/${article.cover_image}.jpg`}
                      alt={article.title}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                )}

                {/* Content */}
                <div className="flex flex-1 flex-col">
                  {/* Title */}
                  <h2 className="mb-2 text-xl leading-tight font-semibold text-gray-900 transition-colors group-hover:text-gray-600 sm:mb-3 sm:text-2xl lg:text-3xl">
                    {article.title}
                  </h2>

                  {/* Takeaways/Excerpt */}
                  {article.takeaways && (
                    <p className="mb-3 line-clamp-3 flex-1 text-sm leading-relaxed text-gray-600 sm:mb-4 sm:text-base">
                      {article.takeaways}
                    </p>
                  )}

                  {/* Tags */}
                  {article.tags && article.tags.length > 0 && (
                    <div className="mb-3 flex flex-wrap gap-2 sm:mb-4">
                      {article.tags.slice(0, 3).map((tag, index) => (
                        <span
                          key={index}
                          className="text-xs font-medium tracking-wider text-gray-500 uppercase"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Meta Information */}
                  <div className="mt-auto flex flex-wrap items-center gap-3 border-t border-gray-100 pt-3 text-xs text-gray-500 sm:gap-4 sm:pt-4 sm:text-sm">
                    {article.created_at && (
                      <time dateTime={article.created_at.toISOString()}>
                        {formatDate(article.created_at.toISOString())}
                      </time>
                    )}
                    {article.content && (
                      <>
                        <span className="text-gray-300">·</span>
                        <span>
                          {calculateReadingTime(article.content)} min read
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </article>
            </Link>
          ))}
        </div>

        {/* Empty State */}
        {(!blogArticles || blogArticles.length === 0) && (
          <div className="py-12 text-center sm:py-16 lg:py-20">
            <p className="text-base text-gray-400 sm:text-lg">
              No blog articles yet. Check back soon!
            </p>
          </div>
        )}
      </div>
    </main>
  )
}
