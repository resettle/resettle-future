import type {
  User,
  UserMetadata,
  UserProfile,
  UserRole,
} from '@resettle/schema/app'
import {
  safeParseDate,
  type CursorPagination,
  type OffsetPagination,
} from '@resettle/utils'
import { sql, type Kysely } from 'kysely'

import {
  executeWithCursorPagination,
  executeWithOffsetPagination,
} from '../../_common'
import type { AppDatabase } from '../database'

interface GetUsersWhereConditions {
  id?: string
  email?: string
  username?: string
  role?: UserRole
  is_deleted?: boolean
}

type GetUsersOrderBy = 'id' | 'created_at' | 'updated_at'
type GetUsersOrderByDirection = 'asc' | 'desc'
type GetUsersCursor = 'id' | 'created_at' | 'updated_at'

/**
 * Parses a user object
 * @param user - The user object to parse
 * @returns The parsed user object
 */
const parse = (user: User): User => {
  user.profile.date_of_birth = safeParseDate(user.profile.date_of_birth)

  user.profile.work_experiences = user.profile.work_experiences?.map(item => {
    item.start_date = safeParseDate(item.start_date)
    item.end_date = safeParseDate(item.end_date)
    return item
  })

  user.profile.education_experiences = user.profile.education_experiences?.map(
    item => {
      item.start_date = safeParseDate(item.start_date)
      item.end_date = safeParseDate(item.end_date)
      return item
    },
  )

  return user
}

/**
 * Builds a query for retrieving users with optional filtering
 * @param db - The Kysely database instance
 * @param where - Optional conditions to filter users
 * @returns A configured query builder for users
 */
const buildGetUsersQuery = (
  db: Kysely<AppDatabase>,
  {
    where = {},
    orderBy = 'id',
    orderByDirection = 'asc',
  }: {
    where?: GetUsersWhereConditions
    orderBy?: GetUsersOrderBy
    orderByDirection?: GetUsersOrderByDirection
  },
) => {
  let qb = db.selectFrom('user').selectAll()

  if (where.id !== undefined) {
    qb = qb.where('id', '=', where.id)
  }

  if (where.email !== undefined) {
    qb = qb.where('email', '=', where.email)
  }

  if (where.username !== undefined) {
    qb = qb.where('username', '=', where.username)
  }

  if (where.role !== undefined) {
    qb = qb.where('role', '=', where.role)
  }

  if (where.is_deleted) {
    qb = qb.where('deleted_at', 'is not', null)
  } else {
    qb = qb.where('deleted_at', 'is', null)
  }

  return qb.orderBy(orderBy, orderByDirection)
}

/**
 * Retrieves users with offset-based pagination
 * @param db - The Kysely database instance
 * @param opts - Pagination and filtering options
 * @param opts.limit - Number of items per page
 * @param opts.orderBy - Field to order by
 * @param opts.orderByDirection - Direction to order by ('asc' or 'desc')
 * @param opts.page - Page number to retrieve
 * @param opts.where - Optional conditions to filter users
 * @returns Paginated users with metadata
 */
export const getUsersWithOffsetPagination = async (
  db: Kysely<AppDatabase>,
  opts: {
    limit: number
    orderBy: GetUsersOrderBy
    orderByDirection: GetUsersOrderByDirection
    page: number
    where?: GetUsersWhereConditions
  },
): Promise<OffsetPagination<User, GetUsersOrderBy>> => {
  const { data, metadata } = await executeWithOffsetPagination(
    buildGetUsersQuery(db, {
      where: opts.where,
      orderBy: opts.orderBy,
      orderByDirection: opts.orderByDirection,
    }),
    opts,
  )

  return {
    data: data.map(d => parse(d)),
    metadata,
  }
}

/**
 * Retrieves users with cursor-based pagination
 * @param db - The Kysely database instance
 * @param opts - Pagination and filtering options
 * @param opts.limit - Number of items per page
 * @param opts.orderBy - Field to order by
 * @param opts.orderByDirection - Direction to order by ('asc' or 'desc')
 * @param opts.cursor - Cursor field to use for pagination
 * @param opts.where - Optional conditions to filter users
 * @returns Cursor-paginated users with metadata
 */
export const getUsersWithCursorPagination = async (
  db: Kysely<AppDatabase>,
  opts: {
    limit: number
    orderBy: GetUsersOrderBy
    orderByDirection: GetUsersOrderByDirection
    cursor: GetUsersCursor | null
    where?: GetUsersWhereConditions
  },
): Promise<CursorPagination<User, GetUsersOrderBy>> => {
  const { data, metadata } = await executeWithCursorPagination(
    buildGetUsersQuery(db, {
      where: opts.where,
      orderBy: opts.orderBy,
      orderByDirection: opts.orderByDirection,
    }),
    opts,
  )

  return {
    data: data.map(d => parse(d)),
    metadata,
  }
}

/**
 * Retrieves all users with optional filtering
 * @param db - The Kysely database instance
 * @param opts - Optional conditions to filter users
 * @param opts.where - Optional conditions to filter users
 * @returns All users
 */
export const getUsers = async (
  db: Kysely<AppDatabase>,
  opts: {
    where?: GetUsersWhereConditions
    orderBy?: GetUsersOrderBy
    orderByDirection?: GetUsersOrderByDirection
  },
): Promise<User[]> => {
  const results = await buildGetUsersQuery(db, {
    where: opts.where,
    orderBy: opts.orderBy,
    orderByDirection: opts.orderByDirection,
  })
    .selectAll()
    .execute()

  return results.map(r => parse(r))
}

/**
 * Retrieves a user by their ID
 * @param db - The Kysely database instance
 * @param id - The unique identifier of the user
 * @returns The user record or null if not found
 */
export const getUserById = async (
  db: Kysely<AppDatabase>,
  id: string,
): Promise<User | null> => {
  const result = await buildGetUsersQuery(db, {
    where: { id },
  }).executeTakeFirst()

  return result ? parse(result) : null
}

/**
 * Retrieves a user by specific conditions
 * @param db - The Kysely database instance
 * @param where - The conditions to filter the user
 * @returns The user record or null if not found
 */
export const getUserBy = async (
  db: Kysely<AppDatabase>,
  where: GetUsersWhereConditions,
): Promise<User | null> => {
  const result = await buildGetUsersQuery(db, {
    where,
  }).executeTakeFirst()

  return result ? parse(result) : null
}

/**
 * Creates a new user record in the database
 * @param db - The Kysely database instance
 * @param values - The user values to insert
 * @param values.email - The email address of the user
 * @param values.username - The username of the user
 * @param values.role - The role assigned to the user
 * @param values.metadata - Optional user metadata
 * @param values.profile - Optional user profile information
 * @returns The created user record
 * @throws If the operation fails
 */
export const createUser = async (
  db: Kysely<AppDatabase>,
  values: {
    email: string
    username: string
    role: UserRole
    metadata?: UserMetadata | null
    profile?: UserProfile | null
  },
): Promise<User> => {
  const result = await db
    .insertInto('user')
    .values({
      ...values,
      metadata: JSON.stringify(values.metadata || {}),
      profile: JSON.stringify(values.profile || {}),
    })
    .returningAll()
    .executeTakeFirstOrThrow()

  return parse(result)
}

/**
 * Updates an existing user record by their ID
 * @param db - The Kysely database instance
 * @param id - The unique identifier of the user
 * @param values - The values to update
 * @param values.email - Optional new email address
 * @param values.username - Optional new username
 * @param values.role - Optional new role
 * @param values.metadata - Optional new metadata
 * @param values.profile - Optional new profile information
 * @returns The updated user record or null if not found
 */
export const updateUserById = async (
  db: Kysely<AppDatabase>,
  id: string,
  values: {
    email?: string
    username?: string
    role?: UserRole
    metadata?: UserMetadata | null
    profile?: UserProfile | null
  },
): Promise<User | null> => {
  const result = await db
    .updateTable('user')
    .set({
      ...values,
      metadata: values.metadata ? JSON.stringify(values.metadata) : undefined,
      profile: values.profile ? JSON.stringify(values.profile) : undefined,
      updated_at: sql`now()`,
    })
    .where('id', '=', id)
    .returningAll()
    .executeTakeFirst()

  return result ? parse(result) : null
}

/**
 * Updates a user's profile by merging partial profile data
 * @param db - The Kysely database instance
 * @param id - The unique identifier of the user
 * @param partialProfile - Partial profile data to merge with existing profile
 * @returns The updated user record or undefined if not found
 */
export const updateUserProfileById = async (
  db: Kysely<AppDatabase>,
  id: string,
  partialProfile: Partial<UserProfile>,
): Promise<User | null> => {
  const result = await db
    .updateTable('user')
    .set({
      profile: sql`CASE
        WHEN profile IS NULL THEN ${JSON.stringify(partialProfile)}::jsonb
        ELSE profile::jsonb || ${JSON.stringify(partialProfile)}::jsonb
      END`,
      updated_at: sql`now()`,
    })
    .where('id', '=', id)
    .returningAll()
    .executeTakeFirst()

  return result ? parse(result) : null
}

/**
 * Updates a user's metadata by merging partial metadata
 * @param db - The Kysely database instance
 * @param id - The unique identifier of the user
 * @param partialMetadata - Partial metadata to merge with existing metadata
 * @returns The updated user record or null if not found
 */
export const updateUserMetadataById = async (
  db: Kysely<AppDatabase>,
  id: string,
  partialMetadata: Partial<UserMetadata>,
): Promise<User | null> => {
  const result = await db
    .updateTable('user')
    .set({
      metadata: sql`CASE
        WHEN metadata IS NULL THEN ${JSON.stringify(partialMetadata)}::jsonb
        ELSE metadata::jsonb || ${JSON.stringify(partialMetadata)}::jsonb
      END`,
      updated_at: sql`now()`,
    })
    .where('id', '=', id)
    .returningAll()
    .executeTakeFirst()

  return result ? parse(result) : null
}

/**
 * Soft deletes a user by their ID by appending a timestamp to their email and setting deleted_at
 * @param db - The Kysely database instance
 * @param id - The unique identifier of the user to delete
 * @returns The deleted user record or null if not found
 */
export const deleteUserById = async (
  db: Kysely<AppDatabase>,
  id: string,
): Promise<User | null> => {
  const now = new Date()
  const suffix = `-deleted-${now.getTime().toString()}`

  const result = await db
    .updateTable('user')
    .set(eb => ({
      email: sql<string>`concat(${eb.ref('email')}, ${suffix})`,
      deleted_at: now,
    }))
    .where('id', '=', id)
    .returningAll()
    .executeTakeFirst()

  return result ? parse(result) : null
}
