import { PortalProvider, ToastProvider, ToastViewport } from '@resettle/design'
import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from 'react-router'

import type { Route } from './+types/root'
import { utmMiddleware } from './analytics/middlewares/utm.server'
import { authMiddleware } from './auth/middlewares/auth.server'
import NavigationProgressBar from './common/components/NavigationProgressBar'

import './app.css'
import { authServerContext } from './auth/contexts/auth.server'

export const middleware = [utmMiddleware, authMiddleware]

export async function loader({ context }: Route.LoaderArgs) {
  const { isAuthenticated, jwt, currentUser } = context.get(authServerContext)

  return {
    isAuthenticated,
    jwt,
    currentUser,
  }
}

export const links: Route.LinksFunction = () => [
  { rel: 'preconnect', href: 'https://fonts.font.im' },
  {
    rel: 'preconnect',
    href: 'https://fonts.gstatic.font.im',
    crossOrigin: 'anonymous',
  },
  {
    rel: 'stylesheet',
    href: 'https://fonts.font.im/css2?family=Raleway:ital,wght@0,300..900;1,300..900&display=swap',
  },
  {
    rel: 'stylesheet',
    href: 'https://fonts.font.im/css2?family=Noto+Sans+SC:wght@300..900&display=swap',
  },
  {
    rel: 'stylesheet',
    href: 'https://fonts.font.im/css2?family=PT+Serif:ital,wght@0,400;0,700;1,400;1,700&display=swap',
  },
  {
    rel: 'stylesheet',
    href: 'https://fonts.font.im/css2?family=Noto+Serif+SC:wght@300..900&display=swap',
  },
  {
    rel: 'icon',
    href: '/favicon.ico',
    type: 'image/x-icon',
  },
]

export function Layout({ children }: React.PropsWithChildren) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no"
        />
        <Meta />
        <Links />
      </head>
      <body>
        <ToastProvider>
          <PortalProvider>{children}</PortalProvider>
          <ToastViewport />
        </ToastProvider>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  )
}

export default function App() {
  return (
    <>
      <NavigationProgressBar />
      <Outlet />
    </>
  )
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  let message = 'Oops!'
  let details = 'An unexpected error occurred.'
  let stack: string | undefined

  if (isRouteErrorResponse(error)) {
    if (error.status === 404) {
      return <div>404</div>
    }

    message = 'Error'
    details = error.statusText || details
  } else if (
    import.meta.env.VITE_ENV !== 'production' &&
    error &&
    error instanceof Error
  ) {
    details = error.message
    stack = error.stack
  }

  return (
    <main className="container mx-auto p-4 pt-16">
      <h1>{message}</h1>
      <p>{details}</p>
      {stack && (
        <pre className="w-full overflow-x-auto p-4">
          <code>{stack}</code>
        </pre>
      )}
    </main>
  )
}
