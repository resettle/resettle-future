import { sql, type Kysely } from 'kysely'

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .createTable('signal')
    .addColumn('id', 'bigserial', col => col.primaryKey().notNull())
    .addColumn('type', 'varchar', col => col.notNull())
    .addColumn('user_id', 'uuid', col => col.notNull())
    .addColumn('canonical_opportunity_id', 'uuid', col => col.notNull())
    .addColumn('data', 'jsonb')
    .addColumn('created_at', 'timestamptz', col =>
      col.notNull().defaultTo(sql`now()`),
    )
    .ifNotExists()
    .execute()

  await db.schema
    .createIndex('signal_user_id_created_at_key')
    .on('signal')
    .columns(['user_id', 'created_at desc'])
    .ifNotExists()
    .execute()

  await db.schema
    .createIndex('signal_canonical_opportunity_id_created_at_key')
    .on('signal')
    .columns(['canonical_opportunity_id', 'created_at desc'])
    .ifNotExists()
    .execute()
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema
    .dropIndex('signal_canonical_opportunity_id_created_at_key')
    .ifExists()
    .execute()
  await db.schema
    .dropIndex('signal_user_id_created_at_key')
    .ifExists()
    .execute()
  await db.schema.dropTable('signal').ifExists().execute()
}
