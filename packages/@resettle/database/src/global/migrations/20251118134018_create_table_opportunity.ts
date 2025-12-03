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
    .addColumn('tag_profile_id', 'uuid')
    .addColumn('type', 'varchar', col => col.notNull())
    .addColumn('updated_at', 'timestamptz', col =>
      col.notNull().defaultTo(sql`now()`),
    )
    .ifNotExists()
    .execute()

  await db.schema
    .createIndex('opportunity_tag_profile_id_key')
    .on('opportunity')
    .column('tag_profile_id')
    .execute()

  await db.schema
    .createIndex('opportunity_type_updated_at_key')
    .on('opportunity')
    .column('type')
    .column('updated_at desc')
    .execute()
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema
    .dropIndex('opportunity_type_updated_at_key')
    .ifExists()
    .execute()
  await db.schema
    .dropIndex('opportunity_tag_profile_id_key')
    .ifExists()
    .execute()
  await db.schema.dropTable('opportunity').ifExists().execute()
}
