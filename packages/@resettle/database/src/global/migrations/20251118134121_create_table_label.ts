import { sql, type Kysely } from 'kysely'

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .createTable('label')
    .addColumn('user_id', 'uuid', col => col.notNull())
    .addColumn('item_id', 'uuid', col => col.notNull())
    .addColumn('value', 'float8', col => col.notNull())
    .addColumn('created_at', 'timestamptz', col =>
      col.notNull().defaultTo(sql`now()`),
    )
    .addColumn('updated_at', 'timestamptz', col =>
      col.notNull().defaultTo(sql`now()`),
    )
    .addPrimaryKeyConstraint('label_pkey', ['user_id', 'item_id'])
    .ifNotExists()
    .execute()
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable('label').ifExists().execute()
}
