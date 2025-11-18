import { sql, type Kysely } from 'kysely'

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .createTable('canonical_organization')
    .addColumn('id', 'uuid', col =>
      col
        .primaryKey()
        .notNull()
        .defaultTo(sql`gen_random_uuid()`),
    )
    .addColumn('type', 'varchar', col => col.notNull())
    .addColumn('slug', 'varchar', col => col.notNull())
    .addColumn('name', 'varchar', col => col.notNull())
    .addColumn('domain', 'varchar')
    .addColumn('country_code', 'varchar')
    .addColumn('sources', 'jsonb', col => col.notNull())
    .addColumn('is_original', 'boolean', col => col.notNull())
    .addColumn('created_at', 'timestamptz', col =>
      col.notNull().defaultTo(sql`now()`),
    )
    .addColumn('updated_at', 'timestamptz', col =>
      col.notNull().defaultTo(sql`now()`),
    )
    .addUniqueConstraint('canonical_organization_slug_ukey', ['slug'])
    .ifNotExists()
    .execute()
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable('canonical_organization').ifExists().execute()
}
