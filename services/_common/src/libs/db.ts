import {
  cursorPaginated,
  offsetPaginated,
  safeParseInt,
  type CursorPagination,
  type OffsetPagination,
} from '@resettle/utils'
import type { ReferenceExpression, SelectQueryBuilder } from 'kysely'

/**
 * Executes a query with offset-based pagination
 * @template O - The output type of the query
 * @template OE - The key of the output type to order by
 * @template DB - The database type
 * @template TB - The table name type
 * @param qb - The Kysely query builder
 * @param opts - Pagination options
 * @param opts.limit - Number of items per page
 * @param opts.page - Current page number (1-based)
 * @param opts.orderBy - Field to order by
 * @param opts.orderByDirection - Direction to order by ('asc' or 'desc')
 * @returns A paginated result with metadata and data
 */
export const executeWithOffsetPagination = async <
  O,
  OE extends keyof O,
  DB,
  TB extends keyof DB,
>(
  qb: SelectQueryBuilder<DB, TB, O>,
  opts: {
    limit: number
    page: number
    orderBy: OE
    orderByDirection: 'asc' | 'desc'
  },
): Promise<OffsetPagination<O, OE>> => {
  const rows = (await qb
    .clearOrderBy()
    .clearLimit()
    .clearOffset()
    .select(eb => eb.fn.countAll<number>().over().as('total_results'))
    .orderBy(opts.orderBy as ReferenceExpression<DB, TB>, opts.orderByDirection)
    .limit(opts.limit)
    .offset((opts.page - 1) * opts.limit)
    .execute()) as (O & { total_results: number })[]

  return offsetPaginated(rows, {
    limit: opts.limit,
    orderBy: opts.orderBy,
    orderByDirection: opts.orderByDirection,
    totalResults: rows.length > 0 ? safeParseInt(rows[0].total_results) : 0,
    page: opts.page,
  })
}

/**
 * Executes a query with cursor-based pagination
 * @template O - The output type of the query
 * @template OE - The key of the output type to order by
 * @template DB - The database type
 * @template TB - The table name type
 * @param qb - The Kysely query builder
 * @param opts - Pagination options
 * @param opts.limit - Number of items per page
 * @param opts.orderBy - Field to order by
 * @param opts.orderByDirection - Direction to order by ('asc' or 'desc')
 * @param opts.cursor - The cursor value to start from, or null for first page
 * @returns A paginated result with metadata and data
 */
export const executeWithCursorPagination = async <
  O,
  OE extends keyof O,
  DB,
  TB extends keyof DB,
>(
  qb: SelectQueryBuilder<DB, TB, O>,
  opts: {
    limit: number
    orderBy: OE
    orderByDirection: 'asc' | 'desc'
    cursor: O[OE] | null
  },
): Promise<CursorPagination<O, OE>> => {
  const rows = (await qb
    .clearOrderBy()
    .clearLimit()
    .clearOffset()
    .$if(opts.cursor !== null, eb =>
      eb.where(
        opts.orderBy as ReferenceExpression<DB, TB>,
        opts.orderByDirection === 'asc' ? '>' : '<',
        opts.cursor,
      ),
    )
    .orderBy(opts.orderBy as ReferenceExpression<DB, TB>, opts.orderByDirection)
    .limit(opts.limit)
    .execute()) as (O & { total_results: number })[]

  return cursorPaginated(rows, {
    limit: opts.limit,
    orderBy: opts.orderBy,
    orderByDirection: opts.orderByDirection,
    cursor: opts.cursor,
  })
}
