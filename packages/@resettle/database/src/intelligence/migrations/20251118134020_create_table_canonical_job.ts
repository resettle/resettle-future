import { sql, type Kysely } from 'kysely'

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .createTable('canonical_job')
    .addColumn('id', 'uuid', col => col.primaryKey().notNull())
    .addColumn('type', 'varchar', col => col.notNull())
    .addColumn('canonical_organization_id', 'uuid')
    .addColumn('title', 'varchar', col => col.notNull())
    .addColumn('description', 'varchar', col => col.notNull())
    .addColumn('url', 'varchar')
    .addColumn('posted_at', 'timestamptz')
    .addColumn('sources', 'jsonb', col => col.notNull())
    .addColumn('is_original', 'boolean', col => col.notNull())
    .addColumn('processed_at', 'timestamptz')
    .addColumn('created_at', 'timestamptz', col =>
      col.notNull().defaultTo(sql`now()`),
    )
    .addColumn('updated_at', 'timestamptz', col =>
      col.notNull().defaultTo(sql`now()`),
    )
    .ifNotExists()
    .execute()
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable('canonical_job').ifExists().execute()
}
