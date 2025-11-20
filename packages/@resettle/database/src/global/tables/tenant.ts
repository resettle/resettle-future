import type { Tenant } from '@resettle/schema/global'
import { assert, type Equals } from '@resettle/utils'
import type { Generated, GeneratedAlways, Selectable } from 'kysely'

export interface TenantTable {
  id: GeneratedAlways<string>
  name: string
  created_at: Generated<Date>
  updated_at: Generated<Date>
  deleted_at: Date | null
}

assert<Equals<Tenant, Selectable<TenantTable>>>
