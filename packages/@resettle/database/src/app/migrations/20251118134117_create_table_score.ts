import { sql, type Kysely } from 'kysely'

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .createTable('score')
    .addColumn('user_id', 'uuid', col => col.notNull())
    .addColumn('canonical_opportunity_id', 'uuid', col => col.notNull())
    .addColumn('score', 'float8', col => col.notNull())
    .addColumn('processed_at', 'timestamptz', col =>
      col.notNull().defaultTo(sql`now()`),
    )
    .addPrimaryKeyConstraint('score_pkey', [
      'user_id',
      'canonical_opportunity_id',
    ])
    .ifNotExists()
    .execute()
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable('score').ifExists().execute()
}
