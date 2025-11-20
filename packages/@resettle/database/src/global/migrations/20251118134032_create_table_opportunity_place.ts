import { sql, type Kysely } from 'kysely'

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .createTable('job_place')
    .addColumn('canonical_job_id', 'uuid', col => col.notNull())
    .addColumn('place_id', 'uuid', col => col.notNull())
    .addColumn('created_at', 'timestamptz', col =>
      col.notNull().defaultTo(sql`now()`),
    )
    .addPrimaryKeyConstraint('job_place_pkey', ['canonical_job_id', 'place_id'])
    .ifNotExists()
    .execute()
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable('job_place').ifExists().execute()
}
