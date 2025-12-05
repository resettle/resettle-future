import { sql, type Kysely } from 'kysely'

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .createTable('raw_organization')
    .addColumn('id', 'uuid', col =>
      col
        .primaryKey()
        .notNull()
        .defaultTo(sql`gen_random_uuid()`),
    )
    .addColumn('type', 'varchar', col => col.notNull())
    .addColumn('source', 'varchar', col => col.notNull())
    .addColumn('external_id', 'varchar', col => col.notNull())
    .addColumn('name', 'varchar', col => col.notNull())
    .addColumn('domain', 'varchar')
    .addColumn('country_code', 'varchar')
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
  await db.schema.dropTable('raw_organization').ifExists().execute()
}
