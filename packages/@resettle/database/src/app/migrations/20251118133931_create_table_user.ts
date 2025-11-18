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
    .addColumn('email', 'varchar', col => col.notNull())
    .addColumn('username', 'varchar', col => col.notNull())
    .addColumn('role', 'varchar', col => col.notNull())
    .addColumn('metadata', 'jsonb', col => col.notNull())
    .addColumn('profile', 'jsonb', col => col.notNull())
    .addColumn('preferences', 'jsonb', col => col.notNull())
    .addColumn('settings', 'jsonb', col => col.notNull())
    .addColumn('created_at', 'timestamptz', col =>
      col.notNull().defaultTo(sql`now()`),
    )
    .addColumn('updated_at', 'timestamptz', col =>
      col.notNull().defaultTo(sql`now()`),
    )
    .addColumn('deleted_at', 'timestamptz')
    .addUniqueConstraint('user_email_ukey', ['email'])
    .addUniqueConstraint('user_username_ukey', ['username'])
    .ifNotExists()
    .execute()

  await db.schema
    .createIndex('user_role_key')
    .on('user')
    .column('role')
    .ifNotExists()
    .execute()
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropIndex('user_role_key').ifExists().execute()
  await db.schema.dropTable('user').ifExists().execute()
}
