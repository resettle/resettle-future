import type { TenantLabelRule } from '@resettle/schema/intelligence'
import { assert, type Equals } from '@resettle/utils'
import type { Generated, GeneratedAlways, Selectable } from 'kysely'

export interface TenantLabelRuleTable {
  id: GeneratedAlways<string>
  tenant_id: string
  name: string
  rule: string
  created_at: Generated<Date>
  updated_at: Generated<Date>
  deprecated_at: Date | null
}

assert<Equals<TenantLabelRule, Selectable<TenantLabelRuleTable>>>
