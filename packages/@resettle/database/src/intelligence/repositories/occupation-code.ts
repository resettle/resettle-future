import type {
  OccupationCode,
  OccupationCodeClassification,
} from '@resettle/schema/intelligence'
import type { CursorPagination } from '@resettle/utils'
import { sql, type Kysely } from 'kysely'

import { executeWithCursorPagination } from '../../_common'
import type { IntelligenceDatabase } from '../database'

/**
 * Exact search for occupation codes
 * @param db - The database
 * @param opts - The options
 * @param opts.limit - The limit
 * @param opts.orderBy - The order by
 * @param opts.orderByDirection - The order by direction
 * @param opts.where - The where
 * @param opts.where.q - The query
 * @param opts.where.classification - The classification
 * @returns The occupation codes
 */
export const exactSearchOccupationCodes = async (
  db: Kysely<IntelligenceDatabase>,
  opts: {
    limit: number
    orderBy: 'id'
    orderByDirection: 'asc' | 'desc'
    where: {
      q: string
      classification?: OccupationCodeClassification
    }
  },
): Promise<OccupationCode[]> => {
  return await db
    .selectFrom('occupation_code')
    .selectAll()
    .where('label', 'like', `%${opts.where.q}%`)
    .$if(opts.where.classification !== undefined, qb =>
      qb.where('classification', '=', opts.where.classification!),
    )
    .orderBy(opts.orderBy, opts.orderByDirection)
    .limit(opts.limit)
    .execute()
}

/**
 * Fuzzy search for occupation codes
 * @param db - The database
 * @param opts - The options
 * @param opts.limit - The limit
 * @param opts.orderByDirection - The order by direction
 * @param opts.where - The where
 * @param opts.where.q - The query
 * @param opts.where.classification - The classification
 * @returns The occupation codes
 */
export const fuzzySearchOccupationCodes = async (
  db: Kysely<IntelligenceDatabase>,
  opts: {
    limit: number
    orderByDirection: 'asc' | 'desc'
    where: {
      q: string
      classification?: OccupationCodeClassification
    }
  },
): Promise<OccupationCode[]> => {
  return await db
    .selectFrom('occupation_code')
    .select([
      'classification',
      'code',
      'id',
      'label',
      sql<number>`similarity(${sql.ref('label')}, ${sql.lit(opts.where.q)})`.as(
        'score',
      ),
    ])
    .where('label', '%' as any, opts.where.q)
    .$if(opts.where.classification !== undefined, qb =>
      qb.where('classification', '=', opts.where.classification!),
    )
    .orderBy('score', opts.orderByDirection)
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
