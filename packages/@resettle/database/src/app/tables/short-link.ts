import type { ShortLink } from '@resettle/schema/app'
import { assert, type Equals } from '@resettle/utils'
import type { Generated, Selectable } from 'kysely'

export interface ShortLinkTable {
  token: string
  user_id: string
  canonical_opportunity_id: string
  session_id: string
  created_at: Generated<Date>
}

assert<Equals<ShortLink, Selectable<ShortLinkTable>>>
