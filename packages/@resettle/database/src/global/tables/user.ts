import type { User } from '@resettle/schema/global'
import { assert, type Equals } from '@resettle/utils'
import type {
  Generated,
  GeneratedAlways,
  JSONColumnType,
  Selectable,
} from 'kysely'

export interface UserTable {
  id: GeneratedAlways<string>
  tenant_id: string
  username: string
  metadata: JSONColumnType<Record<string, any>>
  created_at: Generated<Date>
  updated_at: Generated<Date>
  deleted_at: Date | null
}

assert<Equals<User, Selectable<UserTable>>>
