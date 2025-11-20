import { sql, type Kysely } from 'kysely'

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .createTable('job_tag')
    .addColumn('canonical_job_id', 'uuid', col => col.notNull())
    .addColumn('tag_template_id', 'uuid', col => col.notNull())
    .addColumn('data', 'jsonb', col => col.notNull())
    .addColumn('created_at', 'timestamptz', col =>
      col.notNull().defaultTo(sql`now()`),
    )
    .addColumn('updated_at', 'timestamptz', col =>
      col.notNull().defaultTo(sql`now()`),
    )
    .addPrimaryKeyConstraint('job_tag_pkey', [
      'canonical_job_id',
      'tag_template_id',
    ])
    .ifNotExists()
    .execute()
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable('job_tag').ifExists().execute()
}
