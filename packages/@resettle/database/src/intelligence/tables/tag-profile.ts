import type { TagProfile } from '@resettle/schema/intelligence'
import { assert, type Equals } from '@resettle/utils'
import type { Generated, GeneratedAlways, Selectable } from 'kysely'

export interface TagProfileTable {
  id: GeneratedAlways<string>
  hash: string
  created_at: Generated<Date>
  computed_at: Date | null
}

assert<Equals<TagProfile, Selectable<TagProfileTable>>>
