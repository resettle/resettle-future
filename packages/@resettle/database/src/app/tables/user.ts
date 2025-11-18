import type {
  User,
  UserMetadata,
  UserProfile,
  UserRole,
} from '@resettle/schema/app'
import { assert, type Equals } from '@resettle/utils'
import type {
  Generated,
  GeneratedAlways,
  JSONColumnType,
  Selectable,
} from 'kysely'

export interface UserTable {
  id: GeneratedAlways<string>
  email: string
  username: string
  role: UserRole
  metadata: JSONColumnType<UserMetadata>
  profile: JSONColumnType<UserProfile>
  created_at: Generated<Date>
  updated_at: Generated<Date>
  deleted_at: Date | null
}

assert<Equals<User, Selectable<UserTable>>>
