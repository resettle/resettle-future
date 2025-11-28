import z from 'zod'

import {
  dateNullableSchema,
  dateSchema,
  stringOptionalSchema,
  stringSchema,
  uuidSchema,
} from '../../_common'

export const tenantLabelRuleSchema = z.object({
  id: uuidSchema,
  tenant_id: uuidSchema,
  name: stringSchema,
  rule: stringSchema, // (rawScore: number, labels: Record<string, number>) => number
  created_at: dateSchema,
  updated_at: dateSchema,
  deprecated_at: dateNullableSchema,
})

export const tenantLabelRuleCreateBodySchema = tenantLabelRuleSchema.pick({
  name: true,
  rule: true,
})

export const tenantLabelRuleUpdateBodySchema = z.object({
  name: stringOptionalSchema,
  rule: stringOptionalSchema,
})

export const tenantLabelRuleResponseSchema = tenantLabelRuleSchema.pick({
  id: true,
  name: true,
  rule: true,
  created_at: true,
  updated_at: true,
})

export type TenantLabelRule = z.infer<typeof tenantLabelRuleSchema>
export type TenantLabelRuleCreateBody = z.infer<
  typeof tenantLabelRuleCreateBodySchema
>
export type TenantLabelRuleUpdateBody = z.infer<
  typeof tenantLabelRuleUpdateBodySchema
>
export type TenantLabelRuleResponse = z.infer<
  typeof tenantLabelRuleResponseSchema
>
