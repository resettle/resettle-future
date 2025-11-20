import z from 'zod'

import {
  dateNullableSchema,
  dateSchema,
  stringSchema,
  uuidSchema,
} from '../../_common'

export const tenantSchema = z.object({
  id: uuidSchema,
  name: stringSchema,
  created_at: dateSchema,
  updated_at: dateSchema,
  deleted_at: dateNullableSchema,
})

export type Tenant = z.infer<typeof tenantSchema>
