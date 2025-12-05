import type { IntelligenceDatabase } from '@resettle/database/intelligence'
import type { MiddlewareHandler } from 'hono'
import { env } from 'hono/adapter'
import type { Kysely } from 'kysely'

import { getIntelligenceDB } from '../libs/context'

declare module 'hono' {
  interface ContextVariableMap {
    db: Kysely<IntelligenceDatabase>
  }
}

/**
 * Context middleware
 * @returns The middleware
 */
export const context = (): MiddlewareHandler<{ Bindings: Cloudflare.Env }> => {
  return async (ctx, next) => {
    const { HYPERDRIVE, POSTGRES_CONNECTION_STRING_INTELLIGENCE } = env(ctx)

    const { db, pool } = getIntelligenceDB({
      POSTGRES_CONNECTION_STRING_INTELLIGENCE: HYPERDRIVE
        ? HYPERDRIVE.connectionString
        : POSTGRES_CONNECTION_STRING_INTELLIGENCE,
    })

    ctx.set('db', db)

    try {
      await next()
    } finally {
      await pool.end()
    }
  }
}
