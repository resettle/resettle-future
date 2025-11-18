import type { Generated, JSONColumnType } from 'kysely'

export interface OpportunityTagTable {
  canonical_opportunity_id: string
  tag_template_id: string
  data: JSONColumnType<any>
  created_at: Generated<Date>
  updated_at: Generated<Date>
}
