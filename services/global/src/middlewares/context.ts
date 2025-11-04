import type { GlobalDatabase } from '@resettle/database/global'
import type { MiddlewareHandler } from 'hono'
import { env } from 'hono/adapter'
import type { Kysely } from 'kysely'

import { getGlobalDB } from '../libs/context'

declare module 'hono' {
  interface ContextVariableMap {
    db: Kysely<GlobalDatabase>
  }
}

/**
 * Context middleware
 * @returns The middleware
 */
export const context = (): MiddlewareHandler<{ Bindings: Cloudflare.Env }> => {
  return async (ctx, next) => {
    const { HYPERDRIVE, POSTGRES_CONNECTION_STRING_GLOBAL } = env(ctx)

    const { db, pool } = getGlobalDB({
      POSTGRES_CONNECTION_STRING_GLOBAL: HYPERDRIVE
        ? HYPERDRIVE.connectionString
        : POSTGRES_CONNECTION_STRING_GLOBAL,
    })

    ctx.set('db', db)

    try {
      await next()
    } finally {
      await pool.end()
    }
  }
}
