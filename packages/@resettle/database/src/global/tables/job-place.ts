import type { Generated } from 'kysely'

export interface JobPlaceTable {
  canonical_job_id: string
  place_id: string
  created_at: Generated<Date>
}
