import { isbot } from 'isbot'
import { renderToReadableStream } from 'react-dom/server'
import type {
  AppLoadContext,
  EntryContext,
  HandleErrorFunction,
} from 'react-router'
import { ServerRouter } from 'react-router'

/**
 * Handles errors that occur during server-side rendering
 *
 * @param error - The error object
 * @param params - The parameters object
 * @param params.request - The request object
 */
export const handleError: HandleErrorFunction = (error, { request }) => {
  // React Router may abort some interrupted requests, don't log those
  if (request.signal.aborted) {
    return
  }

  console.error(error)
}

/**
 * Handles incoming server requests by setting up internationalization,
 * managing user sessions, and rendering the React application
 *
 * @param request - The incoming HTTP request
 * @param responseStatusCode - Initial HTTP status code (may be modified during processing)
 * @param responseHeaders - Headers to be sent with the response
 * @param routerContext - React Router context for server-side rendering
 * @param loadContext - Context object passed to loaders, enhanced with locale
 * @returns A Response object with the rendered HTML
 */
export default async function handleRequest(
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  routerContext: EntryContext,
  _loadContext: AppLoadContext,
) {
  // Track whether the initial shell has been rendered
  // Used to distinguish between shell and streaming errors
  let shellRendered = false

  // Extract user agent for bot detection
  const userAgent = request.headers.get('user-agent')

  // Render the React application to a readable stream
  // This enables progressive loading and better performance
  const body = await renderToReadableStream(
    <ServerRouter context={routerContext} url={request.url} />,
    {
      onError(error: unknown) {
        responseStatusCode = 500

        // Only log errors that occur after the initial shell is rendered
        // Shell rendering errors are handled separately in handleDocumentRequest
        if (shellRendered) {
          console.error(error)
        }
      },
    },
  )

  shellRendered = true

  // For bots and SPA mode: wait for all content to load completely
  // This ensures proper SEO indexing and static generation
  // See: https://react.dev/reference/react-dom/server/renderToPipeableStream#waiting-for-all-content-to-load-for-crawlers-and-static-generation
  if ((userAgent && isbot(userAgent)) || routerContext.isSpaMode) {
    await body.allReady
  }

  // Set X-Robots-Tag to noindex, nofollow in non-production environments
  if (import.meta.env.VITE_ENV !== 'production') {
    responseHeaders.set('X-Robots-Tag', 'noindex, nofollow')
  }

  // Return the final response with rendered content
  return new Response(body, {
    headers: responseHeaders,
    status: responseStatusCode,
  })
}
