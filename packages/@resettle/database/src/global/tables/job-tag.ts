import type { Generated, JSONColumnType } from 'kysely'

export interface JobTagTable {
  canonical_job_id: string
  tag_template_id: string
  data: JSONColumnType<any>
  created_at: Generated<Date>
  updated_at: Generated<Date>
}
