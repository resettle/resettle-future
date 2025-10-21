import {
  intNullableSchema,
  intSchema,
  stringNullableSchema,
  stringSchema,
} from '@resettle/schema'
import { z } from 'zod'

const orderByDirectionSchema = z.enum(['asc', 'desc'])

/**
 * Creates a schema for offset-based pagination responses
 * @template T - The type of data being paginated
 * @param dataSchema - The schema for the data items
 * @returns A schema object with metadata and data array
 */
export const getOffsetPaginationSchema = <const T, const O>(
  dataSchema: z.ZodType<T>,
  orderBySchema: z.ZodType<O>,
) =>
  z.object({
    metadata: z.object({
      limit: intSchema,
      order_by: orderBySchema,
      order_by_direction: orderByDirectionSchema,
      total_pages: intSchema,
      page: intSchema,
      next_page: intNullableSchema,
      previous_page: intNullableSchema,
    }),
    data: z.array(dataSchema),
  })

/**
 * Creates a schema for cursor-based pagination responses
 * @template T - The type of data being paginated
 * @param dataSchema - The schema for the data items
 * @returns A schema object with metadata and data array
 */
export const getCursorPaginationSchema = <const T>(dataSchema: z.ZodType<T>) =>
  z.object({
    metadata: z.object({
      limit: intSchema,
      order_by: stringSchema,
      order_by_direction: orderByDirectionSchema,
      cursor: stringNullableSchema,
      next_cursor: stringNullableSchema,
    }),
    data: z.array(dataSchema),
  })
