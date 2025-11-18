import type { Generated } from 'kysely'

export interface OpportunityPlaceTable {
  canonical_opportunity_id: string
  place_id: string
  created_at: Generated<Date>
}
