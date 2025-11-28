import type { Kysely } from 'kysely'

import type { GlobalDatabase } from '../database'

export const getAllUserTagProfiles = async (db: Kysely<GlobalDatabase>) => {
  const ids = await db
    .selectFrom('user')
    .select('tag_profile_id')
    .distinct()
    .execute()

  return ids.map(i => i.tag_profile_id).filter(i => i !== null) as string[]
}

export const getAllCanonicalJobTagProfiles = async (
  db: Kysely<GlobalDatabase>,
) => {
  const ids = await db
    .selectFrom('canonical_job')
    .select('tag_profile_id')
    .distinct()
    .execute()

  return ids.map(i => i.tag_profile_id).filter(i => i !== null) as string[]
}
