import { context as commonContext } from '@services/_common'
import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { logger } from 'hono/logger'

import { context } from './middlewares/context'
import { authRouter } from './routers/auth'
import { resumesRouter } from './routers/resumes'
import { usersRouter } from './routers/users'

const app = new Hono<{ Bindings: Cloudflare.Env }>()

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

export default app
