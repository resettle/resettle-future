import type { AppDatabase } from '@resettle/database/app'
import type { MiddlewareHandler } from 'hono'
import { env } from 'hono/adapter'
import type { Kysely } from 'kysely'

import { getAppDB } from '../libs/context'

declare module 'hono' {
  interface ContextVariableMap {
    db: Kysely<AppDatabase>
  }
}

/**
 * Context middleware
 * @returns The middleware
 */
export const context = (): MiddlewareHandler<{ Bindings: Cloudflare.Env }> => {
  return async (ctx, next) => {
    const { HYPERDRIVE, POSTGRES_CONNECTION_STRING_APP } = env(ctx)

    const { db, pool } = getAppDB({
      POSTGRES_CONNECTION_STRING_APP: HYPERDRIVE
        ? HYPERDRIVE.connectionString
        : POSTGRES_CONNECTION_STRING_APP,
    })

    ctx.set('db', db)

    try {
      await next()
    } finally {
      await pool.end()
    }
  }
}
