import { sql, type Kysely } from 'kysely'

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .createTable('user_tag')
    .addColumn('user_id', 'uuid', col => col.notNull())
    .addColumn('tag_template_id', 'uuid', col => col.notNull())
    .addColumn('data', 'jsonb', col => col.notNull())
    .addColumn('created_at', 'timestamptz', col =>
      col.notNull().defaultTo(sql`now()`),
    )
    .addColumn('updated_at', 'timestamptz', col =>
      col.notNull().defaultTo(sql`now()`),
    )
    .addPrimaryKeyConstraint('user_tag_pkey', ['user_id', 'tag_template_id'])
    .ifNotExists()
    .execute()
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable('user_tag').ifExists().execute()
}
