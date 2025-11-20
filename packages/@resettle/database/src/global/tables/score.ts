import type { Generated } from 'kysely'

export interface ScoreTable {
  user_id: string
  item_id: string
  score: number
  created_at: Generated<Date>
}
