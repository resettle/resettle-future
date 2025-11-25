import type { Opportunity, OpportunityType } from '@resettle/schema/global'
import { assert, type Equals } from '@resettle/utils'
import type { GeneratedAlways, Selectable } from 'kysely'

export interface OpportunityTable {
  id: GeneratedAlways<string>
  type: OpportunityType
}

assert<Equals<Opportunity, Selectable<OpportunityTable>>>
