import { getDB } from '@services/_common'
import type { MiddlewareHandler } from 'hono'
import { env } from 'hono/adapter'
import type { Kysely } from 'kysely'

import type { Database } from '../database'

declare module 'hono' {
  interface ContextVariableMap {
    db: Kysely<Database>
  }
}

/**
 * Context middleware
 * @returns The middleware
 */
export const context = (): MiddlewareHandler<{ Bindings: Cloudflare.Env }> => {
  return async (ctx, next) => {
    const { HYPERDRIVE, POSTGRES_CONNECTION_STRING_GLOBAL } = env(ctx)

    const { db, pool } = getDB<Database>({
      POSTGRES_CONNECTION_STRING: HYPERDRIVE
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
