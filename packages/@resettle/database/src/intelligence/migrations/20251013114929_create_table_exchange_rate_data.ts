import { sql, type Kysely } from 'kysely'

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .createTable('exchange_rate_data')
    .addColumn('currency_code', 'varchar', col => col.notNull())
    .addColumn('rate_to_usd', 'float8', col => col.notNull())
    .addColumn('created_at', 'timestamptz', col =>
      col.notNull().defaultTo(sql`now()`),
    )
    .addPrimaryKeyConstraint('exchange_rate_data_pkey', [
      'currency_code',
      'created_at',
    ])
    .ifNotExists()
    .execute()

  await db.schema
    .createIndex('exchange_rate_data_currency_code_created_at_desc_key')
    .on('exchange_rate_data')
    .columns(['currency_code', 'created_at desc'])
    .ifNotExists()
    .execute()
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema
    .dropIndex('exchange_rate_data_currency_code_created_at_desc_key')
    .ifExists()
    .execute()

  await db.schema.dropTable('exchange_rate_data').ifExists().execute()
}
