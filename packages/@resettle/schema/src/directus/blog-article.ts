import { z } from 'zod'

import {
  dateSchema,
  intSchema,
  stringArraySchema,
  stringNullishSchema,
  stringSchema,
} from '../_common'

export const blogArticleSchema = z.object({
  id: intSchema,
  slug: stringSchema,
  title: stringSchema,
  tags: stringArraySchema,
  takeaways: stringNullishSchema,
  cover_image: stringSchema,
  content: stringSchema,
  status: stringSchema,
  author: stringSchema,
  created_at: dateSchema,
  updated_at: dateSchema,
})

export type BlogArticle = z.infer<typeof blogArticleSchema>
