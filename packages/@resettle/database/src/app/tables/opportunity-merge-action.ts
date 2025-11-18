import type { MergeActionType } from '@resettle/schema'
import type { OpportunityMergeAction } from '@resettle/schema/app'
import { assert, type Equals } from '@resettle/utils'
import type {
  Generated,
  GeneratedAlways,
  JSONColumnType,
  Selectable,
} from 'kysely'

export interface OpportunityMergeActionTable {
  id: GeneratedAlways<string>
  raw_id: string
  canonical_id: string
  type: MergeActionType
  actor_id: string | null
  data: JSONColumnType<Record<string, any>> | null
  created_at: Generated<Date>
}

assert<Equals<OpportunityMergeAction, Selectable<OpportunityMergeActionTable>>>
