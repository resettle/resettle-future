import { sql, type Kysely } from 'kysely'

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .createTable('modified_score')
    .addColumn('id', 'bigserial', col => col.primaryKey().notNull())
    .addColumn('user_id', 'uuid', col => col.notNull())
    .addColumn('opportunity_id', 'uuid', col => col.notNull())
    .addColumn('score', 'float8', col => col.notNull())
    .addColumn('created_at', 'timestamptz', col =>
      col.notNull().defaultTo(sql`now()`),
    )
    .addColumn('updated_at', 'timestamptz', col =>
      col.notNull().defaultTo(sql`now()`),
    )
    .addUniqueConstraint('modified_score_user_id_opportunity_id_ukey', [
      'user_id',
      'opportunity_id',
    ])
    .ifNotExists()
    .execute()
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable('modified_score').ifExists().execute()
}
