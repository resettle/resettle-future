import { z } from 'zod'

import { dateSchema, stringSchema } from '../common'

export const blogPostSchema = z.object({
  id: stringSchema,
  title: stringSchema,
  content: stringSchema,
  date_created: dateSchema,
  date_updated: dateSchema,
})

export type BlogPost = z.infer<typeof blogPostSchema>
