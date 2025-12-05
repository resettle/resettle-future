import type { RawScore } from '@resettle/schema/intelligence'
import { assert, type Equals } from '@resettle/utils'
import type { Generated, GeneratedAlways, Selectable } from 'kysely'

export interface RawScoreTable {
  id: GeneratedAlways<string>
  user_tag_profile_id: string
  item_tag_profile_id: string
  method: string
  score: number
  created_at: Generated<Date>
}

assert<Equals<RawScore, Selectable<RawScoreTable>>>
