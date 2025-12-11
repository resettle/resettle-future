import { sql, type Kysely } from 'kysely'

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .createTable('scrape_task')
    .addColumn('id', 'uuid', col =>
      col
        .primaryKey()
        .notNull()
        .defaultTo(sql`gen_random_uuid()`),
    )
    .addColumn('source', 'varchar', col => col.notNull())
    .addColumn('status', 'varchar', col => col.notNull())
    .addColumn('type', 'varchar', col => col.notNull())
    .addColumn('configuration', 'jsonb', col => col.notNull())
    .addColumn('created_at', 'timestamptz', col =>
      col.notNull().defaultTo(sql`now()`),
    )
    .addColumn('finalized', 'timestamptz')
    .ifNotExists()
    .execute()

  await db.schema
    .createIndex('scrape_task_source_created_at_key')
    .on('scrape_task')
    .column('source')
    .column('created_at desc')
    .execute()
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema
    .dropIndex('scrape_task_source_created_at_key')
    .ifExists()
    .execute()
  await db.schema.dropTable('scrape_task').ifExists().execute()
}
