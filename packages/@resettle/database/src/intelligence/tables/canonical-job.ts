import type { CanonicalJob } from '@resettle/schema/intelligence'
import { assert, type Equals } from '@resettle/utils'
import type { Generated, JSONColumnType, Selectable } from 'kysely'

export interface CanonicalJobTable {
  id: Generated<string>
  canonical_organization_id: string | null
  title: string
  description: string
  url: string | null
  posted_at: Date
  sources: JSONColumnType<{
    title?: string
    description?: string
    url?: string
    posted_at?: string
  }>
  is_original: boolean
  processed_at: Date | null
  created_at: Generated<Date>
  updated_at: Generated<Date>
}

assert<Equals<CanonicalJob, Selectable<CanonicalJobTable>>>
