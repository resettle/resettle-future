import { sql, type Kysely } from 'kysely'

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .createTable('opportunity')
    .addColumn('id', 'uuid', col =>
      col
        .primaryKey()
        .notNull()
        .defaultTo(sql`gen_random_uuid()`),
    )
    .addColumn('type', 'varchar', col => col.notNull())
    .ifNotExists()
    .execute()
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable('opportunity').ifExists().execute()
}
