import type { CountryAlpha2Code } from '@resettle/schema'
import type { PlaceScope, PlaceSearch } from '@resettle/schema/global'
import { sql, type Kysely } from 'kysely'

import type { Database } from '../db'

/**
 * Exact search for places
 * @param db - The database
 * @param opts - The options
 * @param opts.limit - The limit
 * @param opts.orderBy - The order by
 * @param opts.orderByDirection - The order by direction
 * @param opts.where - The where
 * @param opts.where.q - The query
 * @param opts.where.country_code - The country code
 * @param opts.where.scope - The scope
 * @returns The places
 */
export const exactSearchPlaces = async (
  db: Kysely<Database>,
  opts: {
    limit: number
    orderBy: 'id'
    orderByDirection: 'asc' | 'desc'
    where: {
      q: string
      country_code?: CountryAlpha2Code
      scope?: PlaceScope
    }
  },
): Promise<PlaceSearch[]> => {
  return await db
    .selectFrom('place')
    .select([
      'id',
      'name',
      'alternate_names',
      'country_code',
      'numbeo_reference',
    ])
    .where(eb =>
      eb('name', 'like', `%${opts.where.q}%`).or(
        eb.val(`%${opts.where.q}%`),
        'like',
        eb.fn.any('alternate_names'),
      ),
    )
    .$if(opts.where.country_code !== undefined, qb =>
      qb.where('country_code', '=', opts.where.country_code!),
    )
    .$if(opts.where.scope === 'cost-of-living', qb =>
      qb.where('numbeo_reference', 'is not', null),
    )
    .orderBy(opts.orderBy, opts.orderByDirection)
    .limit(opts.limit)
    .execute()
}

/**
 * Fuzzy search for places
 * @param db - The database
 * @param opts - The options
 * @param opts.limit - The limit
 * @param opts.orderByDirection - The order by direction
 * @param opts.where - The where
 * @param opts.where.q - The query
 * @param opts.where.country_code - The country code
 * @param opts.where.scope - The scope
 * @returns The places
 */
export const fuzzySearchPlaces = async (
  db: Kysely<Database>,
  opts: {
    limit: number
    orderByDirection: 'asc' | 'desc'
    where: {
      q: string
      country_code?: CountryAlpha2Code
      scope?: PlaceScope
    }
  },
): Promise<PlaceSearch[]> => {
  return await db
    .selectFrom('place')
    .select([
      'id',
      'name',
      'alternate_names',
      'country_code',
      'numbeo_reference',
      sql<number>`greatest(similarity(${sql.ref('name')}, ${sql.lit(opts.where.q)}),
        (select max(similarity(an, ${sql.lit(opts.where.q)})) from unnest(${sql.ref('alternate_names')}) AS an)
      )`.as('score'),
    ])
    .where(eb =>
      (eb('name', '%', opts.where.q) as any).or(
        eb('alternate_names', '%', opts.where.q as any),
      ),
    )
    .$if(opts.where.country_code !== undefined, qb =>
      qb.where('country_code', '=', opts.where.country_code!),
    )
    .$if(opts.where.scope === 'cost-of-living', qb =>
      qb.where('numbeo_reference', 'is not', null),
    )
    .orderBy('score', opts.orderByDirection)
    .limit(opts.limit)
    .execute()
}
