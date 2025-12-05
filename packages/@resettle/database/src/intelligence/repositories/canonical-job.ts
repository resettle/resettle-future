import type { CanonicalJobBody } from '@resettle/schema/intelligence'
import type { Kysely } from 'kysely'

import type { IntelligenceDatabase } from '../database'

export type CanonicalJobCursor = { date: Date; id?: string }

export const createCanonicalJob = async (
  db: Kysely<IntelligenceDatabase>,
  job: CanonicalJobBody,
) => {
  const opportunity = await db
    .insertInto('opportunity')
    .values({ type: 'job' })
    .returningAll()
    .executeTakeFirstOrThrow()
  const { sources, ...rest } = job

  return await db
    .insertInto('canonical_job')
    .values({
      id: opportunity.id,
      ...rest,
      sources: JSON.stringify(sources),
    })
    .returningAll()
    .execute()
}
