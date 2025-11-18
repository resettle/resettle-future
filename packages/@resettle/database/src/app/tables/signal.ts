import type { Signal, SignalData, SignalType } from '@resettle/schema/app'
import { assert, type Equals } from '@resettle/utils'
import type {
  Generated,
  GeneratedAlways,
  JSONColumnType,
  Selectable,
} from 'kysely'

export interface SignalTable {
  id: GeneratedAlways<string>
  type: SignalType
  user_id: string
  canonical_opportunity_id: string
  data: JSONColumnType<SignalData> | null
  created_at: Generated<Date>
}

assert<Equals<Signal, Selectable<SignalTable>>>
