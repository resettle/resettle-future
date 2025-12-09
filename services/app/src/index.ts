import { apiErrorHandler, context as commonContext } from '@services/_common'
import { Hono } from 'hono'
import { openAPIRouteHandler } from 'hono-openapi'
import { cors } from 'hono/cors'
import { logger } from 'hono/logger'

import { context } from './middlewares/context'
import { authRouter } from './routers/auth'
import { resumesRouter } from './routers/resumes'
import { usersRouter } from './routers/users'

const app = new Hono<{ Bindings: Cloudflare.Env }>()

  /**
   * Error handler
   */
  .onError(apiErrorHandler)

  /**
   * Middlewares
   */
  .use(logger())
  .use(cors())
  .use(commonContext())
  .use(context())

  /**
   * Routes
   */
  .route('/', authRouter)
  .route('/', usersRouter)
  .route('/', resumesRouter)

/**
 * OpenAPI
 */
app.get(
  '/openapi',
  openAPIRouteHandler(app, {
    documentation: {
      info: {
        title: 'Hono API',
        version: '1.0.0',
        description: 'Greeting API',
      },
      servers: [{ url: 'http://localhost:3000', description: 'Local Server' }],
    },
  }),
)

export default app
