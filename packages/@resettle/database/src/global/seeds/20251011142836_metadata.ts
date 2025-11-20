import { Kysely } from 'kysely'

import type { GlobalDatabase } from '../database'

export async function seed(db: Kysely<GlobalDatabase>): Promise<void> {
  const rows = await db.selectFrom('metadata').selectAll().execute()

  if (!rows.length) {
    await db
      .insertInto('metadata')
      .values({
        geonames_updated_at: new Date(0),
        numbeo_updated_at: new Date(0),
        lightcast_updated_at: new Date(0),
      })
      .execute()
  }
}
