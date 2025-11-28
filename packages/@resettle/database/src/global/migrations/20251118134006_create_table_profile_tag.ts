import { sql, type Kysely } from 'kysely'

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .createTable('profile_tag')
    .addColumn('tag_profile_id', 'uuid', col => col.notNull())
    .addColumn('tag_template_id', 'uuid', col => col.notNull())
    .addColumn('data', 'jsonb', col => col.notNull())
    .addColumn('created_at', 'timestamptz', col =>
      col.notNull().defaultTo(sql`now()`),
    )
    .addColumn('updated_at', 'timestamptz', col =>
      col.notNull().defaultTo(sql`now()`),
    )
    .addPrimaryKeyConstraint('profile_tag_pkey', [
      'tag_profile_id',
      'tag_template_id',
    ])
    .ifNotExists()
    .execute()
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable('profile_tag').ifExists().execute()
}
