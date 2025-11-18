import type { Generated } from 'kysely'

export interface ScoreTable {
  user_id: string
  canonical_opportunity_id: string
  score: number
  processed_at: Generated<Date>
}
