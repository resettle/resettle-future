import { sql, type Kysely } from 'kysely'

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .createTable('raw_opportunity')
    .addColumn('id', 'uuid', col =>
      col
        .primaryKey()
        .notNull()
        .defaultTo(sql`gen_random_uuid()`),
    )
    .addColumn('type', 'varchar', col => col.notNull())
    .addColumn('raw_organization_id', 'uuid')
    .addColumn('source', 'varchar', col => col.notNull())
    .addColumn('external_id', 'varchar', col => col.notNull())
    .addColumn('title', 'varchar', col => col.notNull())
    .addColumn('description', 'varchar', col => col.notNull())
    .addColumn('url', 'varchar')
    .addColumn('location', 'varchar', col => col.notNull())
    .addColumn('posted_at', 'timestamptz')
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
  await db.schema.dropTable('raw_opportunity').ifExists().execute()
}
