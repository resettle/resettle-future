import type { Session, SessionStatus, SessionType } from '@resettle/schema/app'
import { assert, type Equals } from '@resettle/utils'
import type { Generated, GeneratedAlways, Selectable } from 'kysely'

export interface SessionTable {
  id: GeneratedAlways<string>
  type: SessionType
  status: SessionStatus
  created_at: Generated<Date>
  completed_at: Date | null
}

assert<Equals<Session, Selectable<SessionTable>>>
