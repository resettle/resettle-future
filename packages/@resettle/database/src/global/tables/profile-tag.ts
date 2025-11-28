import type { ProfileTag } from '@resettle/schema/global'
import { assert, type Equals } from '@resettle/utils'
import type { Generated, JSONColumnType, Selectable } from 'kysely'

export interface ProfileTagTable {
  tag_profile_id: string
  tag_template_id: string
  data: JSONColumnType<Record<string, any>>
  created_at: Generated<Date>
  updated_at: Generated<Date>
}

assert<Equals<ProfileTag, Selectable<ProfileTagTable>>>
