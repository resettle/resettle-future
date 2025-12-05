import { context as commonContext } from '@services/_common'
import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { logger } from 'hono/logger'

import { context } from './middlewares/context'
import { labelRouter } from './routers/label'
import { occupationRouter } from './routers/occupation'
import { placeRouter } from './routers/place'
import { tagRouter } from './routers/tag'
import { tenantRouter } from './routers/tenant'
import { userRouter } from './routers/user'

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
  .route('/', labelRouter)
  .route('/', occupationRouter)
  .route('/', placeRouter)
  .route('/', tagRouter)
  .route('/', tenantRouter)
  .route('/', userRouter)

export default app
