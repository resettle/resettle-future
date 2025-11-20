import { sql, type Kysely } from 'kysely'

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .createTable('tag_template')
    .addColumn('id', 'uuid', col =>
      col
        .primaryKey()
        .notNull()
        .defaultTo(sql`gen_random_uuid()`),
    )
    .addColumn('slug', 'varchar', col => col.notNull())
    .addColumn('name', 'varchar', col => col.notNull())
    .addColumn('namespace', 'varchar', col => col.notNull())
    .addColumn('embedding', sql`vector(1536)`, col => col.notNull())
    .addColumn('metadata', 'jsonb', col => col.notNull())
    .addColumn('created_at', 'timestamptz', col =>
      col.notNull().defaultTo(sql`now()`),
    )
    .addColumn('deprecated_at', 'timestamptz')
    .addUniqueConstraint('tag_template_slug_ukey', ['slug'])
    .addUniqueConstraint('tag_template_name_namespace_ukey', [
      'name',
      'namespace',
    ])
    .ifNotExists()
    .execute()
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable('tag_template').ifExists().execute()
}
