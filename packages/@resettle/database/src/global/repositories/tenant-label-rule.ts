import type {
  TenantLabelRuleCreateBody,
  TenantLabelRuleUpdateBody,
} from '@resettle/schema/global'
import { sql, type Kysely } from 'kysely'

import type { GlobalDatabase } from '../database'

export const createTenantLabelRule = async (
  db: Kysely<GlobalDatabase>,
  tenantId: string,
  tenantLabel: TenantLabelRuleCreateBody,
) => {
  return await db
    .insertInto('tenant_label_rule')
    .values({
      tenant_id: tenantId,
      name: tenantLabel.name,
      rule: tenantLabel.rule,
    })
    .returningAll()
    .executeTakeFirstOrThrow()
}

export const updateTenantLabelRule = async (
  db: Kysely<GlobalDatabase>,
  tenantId: string,
  tenantLabelRuleId: string,
  tenantLabelRule: TenantLabelRuleUpdateBody,
) => {
  return await db
    .updateTable('tenant_label_rule')
    .set({ name: tenantLabelRule.name, rule: tenantLabelRule.rule })
    .where('tenant_id', '=', tenantId)
    .where('id', '=', tenantLabelRuleId)
    .returningAll()
    .executeTakeFirst()
}

export const deprecateTenantLabelRule = async (
  db: Kysely<GlobalDatabase>,
  tenantId: string,
  tenantLabelRuleId: string,
) => {
  return await db
    .updateTable('tenant_label_rule')
    .set('deprecated_at', sql`now()`)
    .where('tenant_id', '=', tenantId)
    .where('id', '=', tenantLabelRuleId)
    .returningAll()
    .executeTakeFirst()
}
