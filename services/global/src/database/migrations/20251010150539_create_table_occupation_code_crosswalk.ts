import { type Kysely } from 'kysely'

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .createTable('occupation_code_crosswalk')
    .addColumn('source_id', 'varchar', col => col.notNull())
    .addColumn('target_id', 'varchar', col => col.notNull())
    .addPrimaryKeyConstraint('occupation_code_crosswalk_pkey', [
      'source_id',
      'target_id',
    ])
    .ifNotExists()
    .execute()
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable('occupation_code_crosswalk').ifExists().execute()
}
