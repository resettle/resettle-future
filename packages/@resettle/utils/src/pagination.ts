export type OffsetPagination<T, OB extends keyof T = keyof T> = {
  metadata: {
    limit: number
    order_by: OB
    order_by_direction: 'asc' | 'desc'
    total_pages: number
    page: number
    next_page: number | null
    previous_page: number | null
  }
  data: T[]
}

export type CursorPagination<T, OB extends keyof T = keyof T> = {
  metadata: {
    limit: number
    order_by: OB
    order_by_direction: 'asc' | 'desc'
    cursor: T[OB] | null
    next_cursor: T[OB] | null
  }
  data: T[]
}

/**
 * Creates an offset-based pagination structure for a collection of items
 *
 * @param data - The array of items to paginate
 * @param params - Pagination parameters
 * @param params.limit - Number of items per page
 * @param params.orderBy - Field to order by
 * @param params.orderByDirection - Direction to order ('asc' or 'desc')
 * @param params.totalResults - Total number of items across all pages
 * @param params.page - Current page number
 * @returns A structured pagination object with metadata and data
 *
 * @example
 * ```ts
 * const users = [...] // Array of user objects
 * const paginatedUsers = offsetPaginated(users, {
 *   limit: 10,
 *   orderBy: 'createdAt',
 *   orderByDirection: 'desc',
 *   totalResults: 100,
 *   page: 1
 * })
 * ```
 */
export const offsetPaginated = <T, OB extends keyof T = keyof T>(
  data: T[],
  params: {
    limit: number
    orderBy: OB
    orderByDirection: 'asc' | 'desc'
    totalResults: number
    page: number
  },
): OffsetPagination<T, OB> => {
  const totalPages = Math.ceil(params.totalResults / params.limit)
  const nextPage = params.page < totalPages ? params.page + 1 : null
  const previousPage = params.page > 1 ? params.page - 1 : null

  return {
    metadata: {
      limit: params.limit,
      order_by: params.orderBy,
      order_by_direction: params.orderByDirection,
      total_pages: totalPages,
      page: params.page,
      next_page: nextPage,
      previous_page: previousPage,
    },
    data,
  }
}

/**
 * Creates a cursor-based pagination structure for a collection of items
 *
 * @param data - The array of items to paginate
 * @param params - Pagination parameters
 * @param params.limit - Number of items per page
 * @param params.orderBy - Field to use as the cursor
 * @param params.orderByDirection - Direction to order ('asc' or 'desc')
 * @param params.cursor - Current cursor value (null for first page)
 * @returns A structured pagination object with metadata and data
 *
 * @example
 * ```ts
 * const users = [...] // Array of user objects
 * const paginatedUsers = cursorPaginated(users, {
 *   limit: 10,
 *   orderBy: 'id',
 *   orderByDirection: 'asc',
 *   cursor: null // First page
 * })
 * ```
 */
export const cursorPaginated = <T, OB extends keyof T = keyof T>(
  data: T[],
  params: {
    limit: number
    orderBy: OB
    orderByDirection: 'asc' | 'desc'
    cursor: T[OB] | null
  },
): CursorPagination<T, OB> => {
  const nextCursor =
    data.length > 0 ? data[data.length - 1][params.orderBy] : null

  return {
    metadata: {
      limit: params.limit,
      order_by: params.orderBy,
      order_by_direction: params.orderByDirection,
      cursor: params.cursor,
      next_cursor: nextCursor,
    },
    data,
  }
}
