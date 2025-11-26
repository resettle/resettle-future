import type { CountryAlpha2Code } from '@resettle/schema'
import type { OrganizationType, RawOrganization } from '@resettle/schema/global'
import { assert, type Equals } from '@resettle/utils'
import type { Generated, GeneratedAlways, Selectable } from 'kysely'

export interface RawOrganizationTable {
  id: GeneratedAlways<string>
  type: OrganizationType
  source: string
  external_id: string
  name: string
  domain: string | null
  country_code: CountryAlpha2Code | null
  created_at: Generated<Date>
  updated_at: Generated<Date>
}

assert<Equals<RawOrganization, Selectable<RawOrganizationTable>>>
