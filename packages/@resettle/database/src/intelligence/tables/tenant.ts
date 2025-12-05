import type { Tenant, TenantConfiguration } from '@resettle/schema/intelligence'
import { assert, type Equals } from '@resettle/utils'
import type {
  Generated,
  GeneratedAlways,
  JSONColumnType,
  Selectable,
} from 'kysely'

export interface TenantTable {
  id: GeneratedAlways<string>
  name: string
  configuration: JSONColumnType<TenantConfiguration>
  created_at: Generated<Date>
  updated_at: Generated<Date>
  deleted_at: Date | null
}

assert<Equals<Tenant, Selectable<TenantTable>>>
