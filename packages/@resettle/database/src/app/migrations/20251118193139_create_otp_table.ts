import { sql, type Kysely } from 'kysely'

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .createTable('otp')
    .addColumn('id', 'uuid', col =>
      col
        .primaryKey()
        .notNull()
        .defaultTo(sql`gen_random_uuid()`),
    )
    .addColumn('action_id', 'uuid', col => col.notNull())
    .addColumn('type', 'varchar', col => col.notNull())
    .addColumn('recipient', 'varchar', col => col.notNull())
    .addColumn('code', 'varchar', col => col.notNull())
    .addColumn('created_at', 'timestamptz', col =>
      col.notNull().defaultTo(sql`now()`),
    )
    .addColumn('expires_at', 'timestamptz', col => col.notNull())
    .addColumn('last_sent_at', 'timestamptz', col => col.notNull())
    .ifNotExists()
    .execute()
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable('otp').ifExists().execute()
}
