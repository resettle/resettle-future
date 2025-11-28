import { sql, type Kysely } from 'kysely'

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .createTable('raw_score')
    .addColumn('id', 'bigserial', col => col.primaryKey().notNull())
    .addColumn('user_tag_profile_id', 'uuid', col => col.notNull())
    .addColumn('item_tag_profile_id', 'uuid', col => col.notNull())
    .addColumn('method', 'varchar', col => col.notNull())
    .addColumn('score', 'float8', col => col.notNull())
    .addColumn('created_at', 'timestamptz', col =>
      col.notNull().defaultTo(sql`now()`),
    )
    .addUniqueConstraint(
      'raw_score_user_tag_profile_id_item_tag_profile_id_method_ukey',
      ['user_tag_profile_id', 'item_tag_profile_id', 'method'],
    )
    .ifNotExists()
    .execute()
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable('raw_score').ifExists().execute()
}
