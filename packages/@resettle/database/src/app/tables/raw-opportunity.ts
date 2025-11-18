import type { OpportunityType, RawOpportunity } from '@resettle/schema/app'
import { assert, type Equals } from '@resettle/utils'
import type { Generated, GeneratedAlways, Selectable } from 'kysely'

export interface RawOpportunityTable {
  id: GeneratedAlways<string>
  type: OpportunityType
  raw_organization_id: string | null
  source: string
  external_id: string
  title: string
  description: string
  url: string | null
  location: string
  posted_at: Date | null
  created_at: Generated<Date>
  updated_at: Generated<Date>
}

assert<Equals<RawOpportunity, Selectable<RawOpportunityTable>>>
