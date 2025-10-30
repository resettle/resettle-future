import { z } from 'zod'

import { stringNullishSchema, stringSchema } from '../_common'

export const blogTagSchema = z.object({
  id: stringSchema,
  name: stringSchema,
  description: stringNullishSchema,
})

export type BlogTag = z.infer<typeof blogTagSchema>
