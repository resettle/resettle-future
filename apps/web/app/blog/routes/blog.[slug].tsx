import Markdown from 'react-markdown'
import { data, Link, useLoaderData } from 'react-router'

import { PAGE_ROUTES } from '~/common/routes'
import { getBlogArticles } from '../handlers/blog-article'
import type { Route } from './+types/blog.[slug]'

export async function loader({ params }: Route.ComponentProps) {
  const blogArticles = await getBlogArticles({
    filter: { slug: params.slug },
  })

  if (blogArticles.length === 0) {
    throw data(
      {
        status: 404,
        data: {
          message: 'Blog article not found',
        },
      },
      404,
    )
  }

  return { blogArticle: blogArticles[0] }
}

export function meta({ data }: Route.MetaArgs) {
  if (!data || !data.blogArticle) {
    return [{ title: 'Blog Article Not Found | Resettle' }]
  }

  const { blogArticle } = data
  const title = `${blogArticle.title} | Resettle`

  // Use takeaways if available, otherwise truncate content
  let description = blogArticle.takeaways || ''
  if (!description && blogArticle.content) {
    description = blogArticle.content.substring(0, 160).trim()
    if (blogArticle.content.length > 160) {
      description += '...'
    }
  }

  const keywords = blogArticle.tags.join(', ')

  return [
    { title },
    { name: 'description', content: description },
    { name: 'keywords', content: keywords },
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

export default function BlogPage({ params }: Route.ComponentProps) {
  const { blogArticle } = useLoaderData<typeof loader>()

  return (
    <div className="min-h-screen bg-white">
      {/* Breadcrumb Navigation */}
      <div className="border-b border-gray-100 bg-white">
        <div className="container mx-auto px-4 py-3 sm:py-4">
          <Link
            to={PAGE_ROUTES.blog.slashedPath}
            className="inline-flex items-center text-xs text-gray-500 transition-colors hover:text-gray-900 sm:text-sm"
          >
            <svg
              className="mr-1.5 h-3.5 w-3.5 sm:mr-2 sm:h-4 sm:w-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            Back to Blog
          </Link>
        </div>
      </div>

      {/* Hero Section */}
      <article className="container mx-auto max-w-4xl px-4 py-8 sm:py-12 lg:py-16">
        {/* Title */}
        <h1 className="mb-4 text-3xl leading-tight font-bold text-gray-900 sm:mb-6 sm:text-4xl sm:leading-tight lg:text-5xl lg:leading-tight">
          {blogArticle.title}
        </h1>

        {/* Meta Information */}
        <div className="mb-6 flex flex-wrap items-center gap-3 text-sm text-gray-600 sm:mb-8 sm:gap-4 sm:text-base">
          {blogArticle.created_at && (
            <time dateTime={blogArticle.created_at.toISOString()}>
              {formatDate(blogArticle.created_at.toISOString())}
            </time>
          )}
          {blogArticle.content && (
            <>
              <span className="text-gray-300">·</span>
              <span>{calculateReadingTime(blogArticle.content)} min read</span>
            </>
          )}
        </div>

        {/* Tags */}
        {blogArticle.tags && blogArticle.tags.length > 0 && (
          <div className="mb-6 flex flex-wrap gap-2 sm:mb-8 sm:gap-3">
            {blogArticle.tags.map((tag, index) => (
              <span
                key={index}
                className="text-xs font-medium tracking-wider text-gray-500 uppercase"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Cover Image */}
        {blogArticle.cover_image && (
          <div className="mb-8 aspect-4/3 overflow-hidden rounded-lg sm:mb-10 sm:aspect-video sm:rounded-xl lg:mb-12">
            <img
              src={`${import.meta.env.VITE_ASSETS_URL}/directus/${blogArticle.cover_image}.jpg`}
              alt={blogArticle.title}
              className="h-full w-full object-cover"
            />
          </div>
        )}

        {/* Takeaways Section */}
        {blogArticle.takeaways && (
          <div className="mb-8 rounded-lg border-l-4 border-gray-900 bg-gray-50 px-4 py-4 sm:mb-10 sm:px-6 sm:py-5 lg:mb-12">
            <h2 className="mb-2 text-xs font-semibold tracking-wider text-gray-900 uppercase sm:text-sm">
              Key Takeaways
            </h2>
            <p className="text-sm leading-relaxed text-gray-700 sm:text-base">
              {blogArticle.takeaways}
            </p>
          </div>
        )}

        {/* Article Content */}
        <div className="prose prose-gray sm:prose-lg mx-auto max-w-none">
          <Markdown
            components={{
              h1: ({ node, ...props }) => (
                <h1
                  className="mt-8 mb-4 text-2xl font-bold text-gray-900 sm:mt-12 sm:mb-6 sm:text-3xl"
                  {...props}
                />
              ),
              h2: ({ node, ...props }) => (
                <h2
                  className="mt-8 mb-3 text-xl font-bold text-gray-900 sm:mt-10 sm:mb-4 sm:text-2xl"
                  {...props}
                />
              ),
              h3: ({ node, ...props }) => (
                <h3
                  className="mt-6 mb-2 text-lg font-semibold text-gray-900 sm:mt-8 sm:mb-3 sm:text-xl"
                  {...props}
                />
              ),
              h4: ({ node, ...props }) => (
                <h4
                  className="mt-4 mb-2 text-base font-semibold text-gray-900 sm:mt-6 sm:mb-3 sm:text-lg"
                  {...props}
                />
              ),
              p: ({ node, ...props }) => (
                <p
                  className="mb-4 leading-relaxed text-gray-700 sm:mb-6"
                  {...props}
                />
              ),
              ul: ({ node, ...props }) => (
                <ul
                  className="mb-4 ml-5 list-disc space-y-1.5 text-gray-700 sm:mb-6 sm:ml-6 sm:space-y-2"
                  {...props}
                />
              ),
              ol: ({ node, ...props }) => (
                <ol
                  className="mb-4 ml-5 list-decimal space-y-1.5 text-gray-700 sm:mb-6 sm:ml-6 sm:space-y-2"
                  {...props}
                />
              ),
              li: ({ node, ...props }) => (
                <li className="leading-relaxed" {...props} />
              ),
              blockquote: ({ node, ...props }) => (
                <blockquote
                  className="my-4 border-l-4 border-gray-300 pl-4 text-gray-600 italic sm:my-6 sm:pl-6"
                  {...props}
                />
              ),
              code: ({ node, inline, ...props }: any) =>
                inline ? (
                  <code
                    className="rounded bg-gray-100 px-1.5 py-0.5 text-xs text-gray-800 sm:text-sm"
                    {...props}
                  />
                ) : (
                  <code
                    className="block overflow-x-auto rounded-lg bg-gray-900 p-3 text-xs text-gray-100 sm:p-4 sm:text-sm"
                    {...props}
                  />
                ),
              pre: ({ node, ...props }) => (
                <pre
                  className="my-4 overflow-hidden rounded-lg sm:my-6"
                  {...props}
                />
              ),
              a: ({ node, ...props }) => (
                <a
                  className="font-medium text-gray-900 underline decoration-gray-300 transition-colors hover:decoration-gray-900"
                  {...props}
                />
              ),
              img: ({ node, ...props }) => (
                <img className="my-6 rounded-lg sm:my-8" {...props} />
              ),
              hr: ({ node, ...props }) => (
                <hr className="my-8 border-gray-200 sm:my-12" {...props} />
              ),
            }}
          >
            {blogArticle.content}
          </Markdown>
        </div>
      </article>

      {/* Bottom Navigation */}
      <div className="border-t border-gray-100 bg-gray-50">
        <div className="container mx-auto max-w-4xl px-4 py-6 sm:py-8">
          <Link
            to={PAGE_ROUTES.blog.slashedPath}
            className="inline-flex items-center text-xs font-medium text-gray-900 transition-colors hover:text-gray-600 sm:text-sm"
          >
            <svg
              className="mr-1.5 h-3.5 w-3.5 sm:mr-2 sm:h-4 sm:w-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            Back to all articles
          </Link>
        </div>
      </div>
    </div>
  )
}
