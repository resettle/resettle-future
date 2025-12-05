import type { ModifiedScore } from '@resettle/schema/intelligence'
import { assert, type Equals } from '@resettle/utils'
import type { Generated, GeneratedAlways, Selectable } from 'kysely'

export interface ModifiedScoreTable {
  id: GeneratedAlways<string>
  user_id: string
  opportunity_id: string
  score: number
  created_at: Generated<Date>
  updated_at: Generated<Date>
}

assert<Equals<ModifiedScore, Selectable<ModifiedScoreTable>>>
