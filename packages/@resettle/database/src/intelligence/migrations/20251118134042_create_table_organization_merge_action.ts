import { sql, type Kysely } from 'kysely'

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .createTable('organization_merge_action')
    .addColumn('id', 'bigserial', col => col.primaryKey().notNull())
    .addColumn('raw_id', 'uuid', col => col.notNull())
    .addColumn('canonical_id', 'uuid', col => col.notNull())
    .addColumn('type', 'varchar', col => col.notNull())
    .addColumn('actor_id', 'uuid')
    .addColumn('data', 'jsonb')
    .addColumn('created_at', 'timestamptz', col =>
      col.notNull().defaultTo(sql`now()`),
    )
    .ifNotExists()
    .execute()
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable('organization_merge_action').ifExists().execute()
}
