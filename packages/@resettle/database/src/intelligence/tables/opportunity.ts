import type { Opportunity, OpportunityType } from '@resettle/schema/intelligence'
import { assert, type Equals } from '@resettle/utils'
import type { Generated, GeneratedAlways, Selectable } from 'kysely'

export interface OpportunityTable {
  id: GeneratedAlways<string>
  tag_profile_id: string | null
  type: OpportunityType
  updated_at: Generated<Date>
}

assert<Equals<Opportunity, Selectable<OpportunityTable>>>
