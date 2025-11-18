import { sql, type Kysely } from 'kysely'

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .createTable('opportunity_tag')
    .addColumn('canonical_opportunity_id', 'uuid', col => col.notNull())
    .addColumn('tag_template_id', 'uuid', col => col.notNull())
    .addColumn('data', 'jsonb', col => col.notNull())
    .addColumn('created_at', 'timestamptz', col =>
      col.notNull().defaultTo(sql`now()`),
    )
    .addColumn('updated_at', 'timestamptz', col =>
      col.notNull().defaultTo(sql`now()`),
    )
    .addPrimaryKeyConstraint('opportunity_tag_pkey', [
      'canonical_opportunity_id',
      'tag_template_id',
    ])
    .ifNotExists()
    .execute()
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable('opportunity_tag').ifExists().execute()
}
