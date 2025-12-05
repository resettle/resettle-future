import type { CountryAlpha2Code } from '@resettle/schema'
import type {
  NumbeoReference,
  Place,
  PlaceFeatureCode,
} from '@resettle/schema/intelligence'
import { assert, type Equals } from '@resettle/utils'
import type { GeneratedAlways, JSONColumnType, Selectable } from 'kysely'

export interface PlaceTable {
  id: GeneratedAlways<string>
  external_id: number
  name: string
  aliases: string[]
  latitude: number
  longitude: number
  feature_code: PlaceFeatureCode
  country_code: CountryAlpha2Code
  admin1_code: string
  admin2_code: string
  admin3_code: string
  admin4_code: string
  population: string // bigint
  elevation: number
  numbeo_reference: JSONColumnType<NumbeoReference> | null
}

// materialized view of `place`
export interface PlaceNameOrAliasTable {
  id: string
  name: string
  country_code: CountryAlpha2Code
  has_numbeo_reference: boolean
}

assert<Equals<Place, Selectable<PlaceTable>>>
