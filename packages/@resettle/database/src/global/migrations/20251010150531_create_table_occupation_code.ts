import { sql, type Kysely } from 'kysely'

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .createTable('occupation_code')
    .addColumn('id', 'varchar', col => col.primaryKey().notNull())
    .addColumn('classification', 'varchar', col => col.notNull())
    .addColumn('code', 'varchar', col => col.notNull())
    .addColumn('label', 'varchar', col => col.notNull())
    .addUniqueConstraint('occupation_code_classification_code_ukey', [
      'classification',
      'code',
    ])
    .ifNotExists()
    .execute()

  await db.schema
    .createIndex('occupation_code_label_skey')
    .on('occupation_code')
    .using('gin')
    .expression(sql`lower(label) gin_trgm_ops`)
    .ifNotExists()
    .execute()
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropIndex('occupation_code_label_skey').ifExists().execute()

  await db.schema.dropTable('occupation_code').ifExists().execute()
}
