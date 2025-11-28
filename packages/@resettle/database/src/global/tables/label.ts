import type { Label } from '@resettle/schema/global'
import { assert, type Equals } from '@resettle/utils'
import type { Generated, Selectable } from 'kysely'

export interface LabelTable {
  user_id: string
  opportunity_id: string
  name: string
  value: number
  created_at: Generated<Date>
  updated_at: Generated<Date>
}

assert<Equals<Label, Selectable<LabelTable>>>
