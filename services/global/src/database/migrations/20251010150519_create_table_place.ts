import { sql, type Kysely } from 'kysely'

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .createTable('place')
    .addColumn('id', 'uuid', col =>
      col
        .primaryKey()
        .notNull()
        .defaultTo(sql`gen_random_uuid()`),
    )
    .addColumn('external_id', 'integer', col => col.notNull())
    .addColumn('name', 'varchar', col => col.notNull())
    .addColumn('alternate_names', sql`text[]`, col => col.notNull())
    .addColumn('latitude', 'float8', col => col.notNull())
    .addColumn('longitude', 'float8', col => col.notNull())
    .addColumn('feature_code', 'varchar', col => col.notNull())
    .addColumn('country_code', 'varchar', col => col.notNull())
    .addColumn('admin1_code', 'varchar', col => col.notNull())
    .addColumn('admin2_code', 'varchar', col => col.notNull())
    .addColumn('admin3_code', 'varchar', col => col.notNull())
    .addColumn('admin4_code', 'varchar', col => col.notNull())
    .addColumn('population', 'int8', col => col.notNull())
    .addColumn('elevation', 'integer', col => col.notNull())
    .addColumn('numbeo_reference', 'jsonb')
    .addUniqueConstraint('place_external_id_ukey', ['external_id'])
    .ifNotExists()
    .execute()

  await db.schema
    .createIndex('place_name_skey')
    .on('place')
    .column('name')
    .using('gin')
    .ifNotExists()
    .execute()
  await db.schema
    .createIndex('place_alternate_names_skey')
    .on('place')
    .column('alternate_names')
    .using('gin')
    .ifNotExists()
    .execute()
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropIndex('place_alternate_names_skey').ifExists().execute()
  await db.schema.dropIndex('place_name_skey').ifExists().execute()
  await db.schema.dropTable('place').ifExists().execute()
}
