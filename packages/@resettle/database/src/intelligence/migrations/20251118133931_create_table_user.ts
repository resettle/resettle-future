import { sql, type Kysely } from 'kysely'

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .createTable('user')
    .addColumn('id', 'uuid', col =>
      col
        .primaryKey()
        .notNull()
        .defaultTo(sql`gen_random_uuid()`),
    )
    .addColumn('tenant_id', 'uuid', col => col.notNull())
    .addColumn('tag_profile_id', 'uuid')
    .addColumn('username', 'varchar', col => col.notNull())
    .addColumn('metadata', 'jsonb', col => col.notNull())
    .addColumn('created_at', 'timestamptz', col =>
      col.notNull().defaultTo(sql`now()`),
    )
    .addColumn('updated_at', 'timestamptz', col =>
      col.notNull().defaultTo(sql`now()`),
    )
    .addColumn('computed_at', 'timestamptz')
    .addColumn('deleted_at', 'timestamptz')
    .addUniqueConstraint('user_tenant_id_username_ukey', [
      'tenant_id',
      'username',
    ])
    .ifNotExists()
    .execute()
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable('user').ifExists().execute()
}
