import { sql, type Kysely } from 'kysely'

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .createTable('short_link')
    .addColumn('token', 'varchar', col => col.primaryKey().notNull())
    .addColumn('user_id', 'uuid', col => col.notNull())
    .addColumn('canonical_opportunity_id', 'uuid', col => col.notNull())
    .addColumn('session_id', 'uuid', col => col.notNull())
    .addColumn('created_at', 'timestamptz', col =>
      col.notNull().defaultTo(sql`now()`),
    )
    .ifNotExists()
    .execute()
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable('short_link').ifExists().execute()
}
