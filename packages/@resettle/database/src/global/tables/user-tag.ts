import type { UserTag } from '@resettle/schema/global'
import { assert, type Equals } from '@resettle/utils'
import type { Generated, JSONColumnType, Selectable } from 'kysely'

export interface UserTagTable {
  user_id: string
  tag_template_id: string
  data: JSONColumnType<Record<string, any>>
  created_at: Generated<Date>
  updated_at: Generated<Date>
}

assert<Equals<UserTag, Selectable<UserTagTable>>>
