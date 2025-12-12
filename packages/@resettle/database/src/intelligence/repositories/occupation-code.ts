import type {
  OccupationCode,
  OccupationCodeClassification,
} from '@resettle/schema/intelligence'
import type { CursorPagination } from '@resettle/utils'
import { sql, type Kysely } from 'kysely'

import { executeWithCursorPagination } from '../../_common'
import type { IntelligenceDatabase } from '../database'

export const searchOccupationCodes = async (
  db: Kysely<IntelligenceDatabase>,
  opts: {
    limit: number
    orderByDirection: 'asc' | 'desc'
    where: {
      q: string
      fuzzy?: boolean
      classification?: OccupationCodeClassification
    }
  },
) => {
  return await db
    .selectFrom('occupation_code')
    .selectAll()
    .$if(Boolean(opts.where.fuzzy), qb =>
      qb.where(
        sql<number>`lower(label) <<-> lower(${sql.lit(opts.where.q)})`,
        '<',
        0.3,
      ),
    )
    .$if(!Boolean(opts.where.fuzzy), qb =>
      qb.where(
        sql`lower(label)`,
        'like',
        sql<string>`lower(${sql.lit(`%${opts.where.q}%`)})`,
      ),
    )
    .$if(opts.where.classification !== undefined, qb =>
      qb.where('classification', '=', opts.where.classification!),
    )
    .$if(Boolean(opts.where.fuzzy), qb =>
      qb.orderBy(
        sql<number>`lower(label) <<-> lower(${sql.lit(opts.where.q)})`,
        opts.orderByDirection,
      ),
    )
    .$if(!Boolean(opts.where.fuzzy), qb =>
      qb.orderBy(
        sql<number>`lower(label) like lower(${sql.lit(`%${opts.where.q}%`)})`,
        opts.orderByDirection,
      ),
    )
    .limit(opts.limit)
    .execute()
}

/**
 * List occupation codes
 * @param db - The database
 * @param opts - The options
 * @param opts.limit - The limit
 * @param opts.cursor - The cursor
 * @param opts.orderBy - The order by
 * @param opts.orderByDirection - The order by direction
 * @param opts.where - The where
 * @param opts.where.classification - The classification
 * @param opts.where.code - The code
 * @returns The occupation codes
 */
export const listOccupationCodes = async (
  db: Kysely<IntelligenceDatabase>,
  opts: {
    limit: number
    cursor: string | null
    orderBy: 'id'
    orderByDirection: 'asc' | 'desc'
    where: {
      classification: OccupationCodeClassification
      code?: string
    }
  },
): Promise<CursorPagination<OccupationCode, 'id'>> => {
  return await executeWithCursorPagination(
    db
      .selectFrom('occupation_code')
      .selectAll()
      .where('classification', '=', opts.where.classification)
      .$if(opts.where.code !== undefined, qb =>
        qb.where('code', '=', opts.where.code!),
      ),
    opts,
  )
}
