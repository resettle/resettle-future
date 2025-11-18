import { sql, type Kysely } from 'kysely'

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .createTable('canonical_opportunity')
    .addColumn('id', 'uuid', col =>
      col
        .primaryKey()
        .notNull()
        .defaultTo(sql`gen_random_uuid()`),
    )
    .addColumn('type', 'varchar', col => col.notNull())
    .addColumn('canonical_organization_id', 'varchar')
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
  await db.schema.dropTable('canonical_opportunity').ifExists().execute()
}
