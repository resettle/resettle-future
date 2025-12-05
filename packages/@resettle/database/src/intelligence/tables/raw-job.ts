import type { RawJob } from '@resettle/schema/intelligence'
import { assert, type Equals } from '@resettle/utils'
import type { Generated, GeneratedAlways, Selectable } from 'kysely'

export interface RawJobTable {
  id: GeneratedAlways<string>
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

assert<Equals<RawJob, Selectable<RawJobTable>>>
