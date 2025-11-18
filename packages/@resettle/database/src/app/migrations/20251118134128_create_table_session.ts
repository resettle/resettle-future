import { sql, type Kysely } from 'kysely'

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .createTable('session')
    .addColumn('id', 'uuid', col =>
      col
        .primaryKey()
        .notNull()
        .defaultTo(sql`gen_random_uuid()`),
    )
    .addColumn('type', 'varchar', col => col.notNull())
    .addColumn('status', 'varchar', col => col.notNull())
    .addColumn('created_at', 'timestamptz', col =>
      col.notNull().defaultTo(sql`now()`),
    )
    .addColumn('completed_at', 'timestamptz')
    .ifNotExists()
    .execute()
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable('session').ifExists().execute()
}
