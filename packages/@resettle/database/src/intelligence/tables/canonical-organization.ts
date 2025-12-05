import type { CountryAlpha2Code } from '@resettle/schema'
import type {
  CanonicalOrganization,
  OrganizationType,
} from '@resettle/schema/intelligence'
import { assert, type Equals } from '@resettle/utils'
import type {
  Generated,
  GeneratedAlways,
  JSONColumnType,
  Selectable,
} from 'kysely'

export interface CanonicalOrganizationTable {
  id: GeneratedAlways<string>
  type: OrganizationType
  slug: string
  name: string
  domain: string | null
  country_code: CountryAlpha2Code | null
  sources: JSONColumnType<{
    name?: string
    domain?: string
    country_code?: string
  }>
  is_original: boolean
  created_at: Generated<Date>
  updated_at: Generated<Date>
}

assert<Equals<CanonicalOrganization, Selectable<CanonicalOrganizationTable>>>
