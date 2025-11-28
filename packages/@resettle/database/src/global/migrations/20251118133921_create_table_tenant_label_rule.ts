import { sql, type Kysely } from 'kysely'

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .createTable('tenant_label_rule')
    .addColumn('id', 'uuid', col =>
      col
        .primaryKey()
        .notNull()
        .defaultTo(sql`gen_random_uuid()`),
    )
    .addColumn('tenant_id', 'uuid', col => col.notNull())
    .addColumn('name', 'varchar', col => col.notNull())
    .addColumn('rule', 'varchar', col => col.notNull())
    .addColumn('created_at', 'timestamptz', col =>
      col.notNull().defaultTo(sql`now()`),
    )
    .addColumn('updated_at', 'timestamptz', col =>
      col.notNull().defaultTo(sql`now()`),
    )
    .addColumn('deprecated_at', 'timestamptz')
    .addUniqueConstraint('tenant_tenant_id_name_ukey', ['tenant_id', 'name'])
    .ifNotExists()
    .execute()
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable('tenant_label_rule').ifExists().execute()
}
