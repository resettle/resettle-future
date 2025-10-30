import { sql, type Kysely } from 'kysely'

export async function up(db: Kysely<any>): Promise<void> {
  await sql`CREATE EXTENSION IF NOT EXISTS vector`.execute(db)
  await sql`CREATE EXTENSION IF NOT EXISTS pg_trgm`.execute(db)
  await sql`CREATE EXTENSION IF NOT EXISTS btree_gin`.execute(db)
  await db.schema
    .createTable('metadata')
    .addColumn('geonames_updated_at', 'timestamptz', col =>
      col.notNull().defaultTo(sql`TIMESTAMP WITH TIME ZONE 'epoch'`),
    )
    .addColumn('numbeo_updated_at', 'timestamptz', col =>
      col.notNull().defaultTo(sql`TIMESTAMP WITH TIME ZONE 'epoch'`),
    )
    .ifNotExists()
    .execute()
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable('metadata').ifExists().execute()
}
