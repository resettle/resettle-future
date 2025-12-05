import type { Metadata } from '@resettle/schema/intelligence'
import { assert, type Equals } from '@resettle/utils'
import type { Generated, Selectable } from 'kysely'

export interface MetadataTable {
  geonames_updated_at: Generated<Date>
  numbeo_updated_at: Generated<Date>
  lightcast_updated_at: Generated<Date>
}

assert<Equals<Metadata, Selectable<MetadataTable>>>
