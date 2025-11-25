import type { Resume, ResumeFileType } from '@resettle/schema/app'
import type { CursorPagination, OffsetPagination } from '@resettle/utils'
import { sql, type Kysely } from 'kysely'

import {
  executeWithCursorPagination,
  executeWithOffsetPagination,
} from '../../_common'
import type { AppDatabase } from '../database'

interface GetResumesWhereConditions {
  id?: string
  user_id?: string
  file_type?: ResumeFileType
  is_deleted?: boolean
}

type GetResumesOrderBy = 'id' | 'created_at' | 'updated_at'
type GetResumesOrderByDirection = 'asc' | 'desc'
type GetResumesCursor = 'id' | 'created_at' | 'updated_at'

/**
 * Builds a query for retrieving resumes with optional filtering
 * @param db - The Kysely database instance
 * @param where - Optional conditions to filter resumes
 * @returns A configured query builder for resumes
 */
const buildGetResumesQuery = (
  db: Kysely<AppDatabase>,
  {
    where = {},
    orderBy = 'id',
    orderByDirection = 'asc',
  }: {
    where?: GetResumesWhereConditions
    orderBy?: GetResumesOrderBy
    orderByDirection?: GetResumesOrderByDirection
  },
) => {
  let qb = db.selectFrom('resume').selectAll()

  if (where.id !== undefined) {
    qb = qb.where('id', '=', where.id)
  }

  if (where.user_id !== undefined) {
    qb = qb.where('user_id', '=', where.user_id)
  }

  if (where.file_type !== undefined) {
    qb = qb.where('file_type', '=', where.file_type)
  }

  if (where.is_deleted) {
    qb = qb.where('deleted_at', 'is not', null)
  } else {
    qb = qb.where('deleted_at', 'is', null)
  }

  return qb.orderBy(orderBy, orderByDirection)
}

/**
 * Retrieves resumes with offset-based pagination
 * @param db - The Kysely database instance
 * @param opts - Pagination and filtering options
 * @param opts.limit - Number of items per page
 * @param opts.orderBy - Field to order by
 * @param opts.orderByDirection - Direction to order by ('asc' or 'desc')
 * @param opts.page - Page number to retrieve
 * @param opts.where - Optional conditions to filter resumes
 * @returns Paginated resumes with metadata
 */
export const getResumesWithOffsetPagination = async (
  db: Kysely<AppDatabase>,
  opts: {
    limit: number
    orderBy: GetResumesOrderBy
    orderByDirection: GetResumesOrderByDirection
    page: number
    where?: GetResumesWhereConditions
  },
): Promise<OffsetPagination<Resume, GetResumesOrderBy>> => {
  const { data, metadata } = await executeWithOffsetPagination(
    buildGetResumesQuery(db, {
      where: opts.where,
      orderBy: opts.orderBy,
      orderByDirection: opts.orderByDirection,
    }),
    opts,
  )

  return {
    data,
    metadata,
  }
}

/**
 * Retrieves resumes with cursor-based pagination
 * @param db - The Kysely database instance
 * @param opts - Pagination and filtering options
 * @param opts.limit - Number of items per page
 * @param opts.orderBy - Field to order by
 * @param opts.orderByDirection - Direction to order by ('asc' or 'desc')
 * @param opts.cursor - Cursor field to use for pagination
 * @param opts.where - Optional conditions to filter resumes
 * @returns Cursor-paginated resumes with metadata
 */
export const getResumesWithCursorPagination = async (
  db: Kysely<AppDatabase>,
  opts: {
    limit: number
    orderBy: GetResumesOrderBy
    orderByDirection: GetResumesOrderByDirection
    cursor: GetResumesCursor | null
    where?: GetResumesWhereConditions
  },
): Promise<CursorPagination<Resume, GetResumesOrderBy>> => {
  const { data, metadata } = await executeWithCursorPagination(
    buildGetResumesQuery(db, {
      where: opts.where,
      orderBy: opts.orderBy,
      orderByDirection: opts.orderByDirection,
    }),
    opts,
  )

  return {
    data,
    metadata,
  }
}

/**
 * Retrieves all resumes with optional filtering
 * @param db - The Kysely database instance
 * @param opts - Optional conditions to filter resumes
 * @param opts.where - Optional conditions to filter resumes
 * @returns All resumes
 */
export const getResumes = async (
  db: Kysely<AppDatabase>,
  opts: {
    where?: GetResumesWhereConditions
    orderBy?: GetResumesOrderBy
    orderByDirection?: GetResumesOrderByDirection
  },
): Promise<Resume[]> => {
  const results = await buildGetResumesQuery(db, {
    where: opts.where,
    orderBy: opts.orderBy,
    orderByDirection: opts.orderByDirection,
  })
    .selectAll()
    .execute()

  return results
}

/**
 * Retrieves a resume by its ID
 * @param db - The Kysely database instance
 * @param id - The unique identifier of the resume
 * @returns The resume record or null if not found
 */
export const getResumeById = async (
  db: Kysely<AppDatabase>,
  id: string,
): Promise<Resume | null> => {
  const result = await buildGetResumesQuery(db, {
    where: { id },
  }).executeTakeFirst()

  return result || null
}

/**
 * Retrieves a resume by specific conditions
 * @param db - The Kysely database instance
 * @param where - The conditions to filter the resume
 * @returns The resume record or null if not found
 */
export const getResumeBy = async (
  db: Kysely<AppDatabase>,
  where: GetResumesWhereConditions,
): Promise<Resume | null> => {
  const result = await buildGetResumesQuery(db, {
    where,
  }).executeTakeFirst()

  return result || null
}

/**
 * Creates a new resume record in the database
 * @param db - The Kysely database instance
 * @param values - The resume values to insert
 * @param values.user_id - The ID of the user who owns the resume
 * @param values.file_type - The type of the resume file
 * @param values.file_url - The URL where the resume file is stored
 * @param values.parsed_result - Optional parsed result from resume processing
 * @returns The created resume record
 * @throws If the operation fails
 */
export const createResume = async (
  db: Kysely<AppDatabase>,
  values: {
    user_id: string
    file_type: ResumeFileType
    file_url: string
    parsed_result?: Record<string, unknown> | null
  },
): Promise<Resume> => {
  const result = await db
    .insertInto('resume')
    .values({
      ...values,
      parsed_result: values.parsed_result
        ? JSON.stringify(values.parsed_result)
        : null,
    })
    .returningAll()
    .executeTakeFirstOrThrow()

  return result
}

/**
 * Updates an existing resume record by its ID
 * @param db - The Kysely database instance
 * @param id - The unique identifier of the resume
 * @param values - The values to update
 * @param values.file_type - Optional new file type
 * @param values.file_url - Optional new file URL
 * @param values.parsed_result - Optional new parsed result
 * @returns The updated resume record or null if not found
 */
export const updateResumeById = async (
  db: Kysely<AppDatabase>,
  id: string,
  values: {
    file_type?: ResumeFileType
    file_url?: string
    parsed_result?: Record<string, unknown> | null
  },
): Promise<Resume | null> => {
  const result = await db
    .updateTable('resume')
    .set({
      ...values,
      parsed_result:
        values.parsed_result !== undefined
          ? JSON.stringify(values.parsed_result)
          : undefined,
      updated_at: sql`now()`,
    })
    .where('id', '=', id)
    .returningAll()
    .executeTakeFirst()

  return result || null
}

/**
 * Soft deletes a resume by its ID by setting deleted_at timestamp
 * @param db - The Kysely database instance
 * @param id - The unique identifier of the resume to delete
 * @returns The deleted resume record or null if not found
 */
export const deleteResumeById = async (
  db: Kysely<AppDatabase>,
  id: string,
): Promise<Resume | null> => {
  const now = new Date()

  const result = await db
    .updateTable('resume')
    .set({
      deleted_at: now,
    })
    .where('id', '=', id)
    .returningAll()
    .executeTakeFirst()

  return result || null
}
