import type {
  User,
  UserCreateBody,
  UserUpdateBody,
} from '@resettle/schema/global'
import { sql, type Kysely } from 'kysely'

import type { GlobalDatabase } from '../database'

export const createUsers = async (
  db: Kysely<GlobalDatabase>,
  tenantId: string,
  users: UserCreateBody[],
) => {
  return await db
    .insertInto('user')
    .values(
      users.map(u => ({
        tenant_id: tenantId,
        username: u.username,
        metadata: JSON.stringify(u.metadata),
      })),
    )
    .returningAll()
    .execute()
}

export const updateUsers = async (
  db: Kysely<GlobalDatabase>,
  tenantId: string,
  users: UserUpdateBody[],
) => {
  const updatedUsers: User[] = []
  for (const user of users) {
    const updatedUser = await db
      .updateTable('user')
      .$if(Boolean(user.username), qb => qb.set('username', user.username!))
      .$if(Boolean(user.metadata), qb =>
        qb.set('metadata', JSON.stringify(user.metadata)),
      )
      .set('updated_at', sql`now()`)
      .where('id', '=', user.user_id)
      .where('tenant_id', '=', tenantId)
      .returningAll()
      .executeTakeFirst()
    if (updatedUser) {
      updatedUsers.push(updatedUser)
    }
  }

  return updatedUsers
}

export const deleteUsers = async (
  db: Kysely<GlobalDatabase>,
  tenantId: string,
  userIds: string[],
) => {
  const deletedUsers: string[] = []
  for (const userId of userIds) {
    // NOTE: It's possible to have collision here, might want to restrict the allowed charset of an username.
    const deleted = await db
      .updateTable('user')
      .set(
        'username',
        eb =>
          sql<string>`concat(${eb.ref('username')}, ${`_deleted_${Date.now()}`})`,
      )
      .set('deleted_at', sql`now()`)
      .where('id', '=', userId)
      .where('tenant_id', '=', tenantId)
      .returningAll()
      .executeTakeFirst()
    if (deleted) {
      deletedUsers.push(deleted.id)
    }
  }

  return deletedUsers
}

export const readUser = async (
  db: Kysely<GlobalDatabase>,
  tenantId: string,
  userId: string,
) => {
  return await db
    .selectFrom('user')
    .selectAll()
    .where('id', '=', userId)
    .where('tenant_id', '=', tenantId)
    .where('deleted_at', 'is', null)
    .executeTakeFirst()
}
