import z from 'zod'

import {
  dateNullableSchema,
  dateSchema,
  intSchema,
  stringSchema,
  uuidSchema,
} from '../../_common'

export const tenantConfigurationSchema = z.object({
  user_score_validity_decay_start: intSchema.optional(),
  user_score_validity_decay_end: intSchema.optional(),
  tag_profile_score_validity_decay_start: intSchema.optional(),
  tag_profile_score_validity_decay_end: intSchema.optional(),
})

export const tenantSchema = z.object({
  id: uuidSchema,
  name: stringSchema,
  configuration: tenantConfigurationSchema,
  created_at: dateSchema,
  updated_at: dateSchema,
  deleted_at: dateNullableSchema,
})

export type TenantConfiguration = z.infer<typeof tenantConfigurationSchema>
export type Tenant = z.infer<typeof tenantSchema>
