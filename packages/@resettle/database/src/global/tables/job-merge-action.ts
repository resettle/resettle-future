import type { MergeActionType } from '@resettle/schema'
import type { JobMergeAction } from '@resettle/schema/global'
import { assert, type Equals } from '@resettle/utils'
import type {
  Generated,
  GeneratedAlways,
  JSONColumnType,
  Selectable,
} from 'kysely'

export interface JobMergeActionTable {
  id: GeneratedAlways<string>
  raw_id: string
  canonical_id: string
  type: MergeActionType
  actor_id: string | null
  data: JSONColumnType<Record<string, any>> | null
  created_at: Generated<Date>
}

assert<Equals<JobMergeAction, Selectable<JobMergeActionTable>>>
