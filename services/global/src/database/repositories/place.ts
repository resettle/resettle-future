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
 * @param opts.where.fuzzy - Fuzzy search or not
 * @param opts.where.country_code - The country code
 * @param opts.where.scope - The scope
 * @returns The places
 */
export const searchPlaces = async (
  db: Kysely<Database>,
  opts: {
    limit: number
    orderByDirection: 'asc' | 'desc'
    where: {
      q: string
      fuzzy?: boolean
      country_code?: CountryAlpha2Code
      scope?: PlaceScope
    }
  },
): Promise<PlaceSearch[]> => {
  const ids = await db
    .selectFrom('place_name_or_alias')
    .select('id')
    .$if(Boolean(opts.where.fuzzy), qb =>
      qb.where(
        sql<number>`${sql.ref('name')} <<-> ${sql.lit(opts.where.q)}`,
        '<',
        0.3,
      ),
    )
    .$if(!Boolean(opts.where.fuzzy), qb =>
      qb.where('name', 'ilike', `%${opts.where.q}%`),
    )
    .$if(opts.where.country_code !== undefined, qb =>
      qb.where('country_code', '=', opts.where.country_code!),
    )
    .$if(opts.where.scope === 'cost-of-living', qb =>
      qb.where('has_numbeo_reference', '=', true),
    )
    .orderBy(
      opts.where.fuzzy
        ? sql`${sql.ref('name')} <<-> ${sql.lit(opts.where.q)}`
        : sql`${sql.ref('name')} ilike ${sql.lit(`%${opts.where.q}%`)}`,
      opts.orderByDirection,
    )
    .limit(opts.limit)
    .execute()
  const distinctResults: string[] = []
  for (const id of ids) {
    if (!distinctResults.includes(id.id)) {
      distinctResults.push(id.id)
    }
  }

  if (distinctResults.length) {
    const places = await db
      .selectFrom('place')
      .select(['id', 'name', 'aliases', 'country_code', 'numbeo_reference'])
      .where('id', 'in', distinctResults)
      .execute()
    return distinctResults.map(i => places.find(p => p.id === i)!)
  }

  return []
}
