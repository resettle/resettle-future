import { context as commonContext } from '@services/_common'
import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { logger } from 'hono/logger'

import { context } from './middlewares/context'
import { occupationRouter } from './routers/occupation'
import { placeRouter } from './routers/place'

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
  .route('/', occupationRouter)
  .route('/', placeRouter)

export default app
