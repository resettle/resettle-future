import type { User } from '@resettle/schema/intelligence'
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
  tag_profile_id: string | null
  username: string
  metadata: JSONColumnType<Record<string, any>>
  created_at: Generated<Date>
  updated_at: Generated<Date>
  computed_at: Date | null
  deleted_at: Date | null
}

assert<Equals<User, Selectable<UserTable>>>
