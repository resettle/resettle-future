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
    .addColumn('aliases', sql`text[]`, col => col.notNull())
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
    .createView('place_name_or_alias')
    .materialized()
    .as(
      db
        .with('expanded', db =>
          db
            .selectFrom('place')
            .select([
              'id',
              'name',
              'country_code',
              sql<boolean>(`numbeo_reference is not null` as any).as(
                'has_numbeo_reference',
              ),
            ])
            .unionAll(
              db
                .selectFrom(['place', sql`unnest(aliases)`.as('alias')])
                .select([
                  'id',
                  'alias as name',
                  'country_code',
                  sql<boolean>(`numbeo_reference is not null` as any).as(
                    'has_numbeo_reference',
                  ),
                ]),
            ),
        )
        .selectFrom('expanded')
        .select(['id', 'name', 'country_code', 'has_numbeo_reference'])
        .distinct()
        .where('name', 'is not', null),
    )
    .execute()

  await db.schema
    .createIndex('place_name_or_alias_name_skey')
    .on('place_name_or_alias')
    .using('gin')
    .expression(sql`lower(name) gin_trgm_ops`)
    .ifNotExists()
    .execute()
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema
    .dropIndex('place_name_or_alias_name_skey')
    .ifExists()
    .execute()
  await db.schema
    .dropView('place_name_or_alias')
    .materialized()
    .ifExists()
    .execute()
  await db.schema.dropTable('place').ifExists().execute()
}
