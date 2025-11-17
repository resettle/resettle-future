import type { OTP, OTPType } from '@resettle/schema/app'
import { assert, type Equals } from '@resettle/utils'
import type { Generated, GeneratedAlways, Selectable } from 'kysely'

export interface OTPTable {
  id: GeneratedAlways<string>
  action_id: Generated<string>
  type: OTPType
  recipient: string
  code: string
  created_at: Generated<Date>
  expires_at: Date
  last_sent_at: Date
}

assert<Equals<OTP, Selectable<OTPTable>>>
