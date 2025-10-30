import type {
  NumbeoReference,
  Place,
  PlaceFeatureCode,
} from '@resettle/schema/global'
import { assert, type Equals } from '@resettle/utils'
import type { GeneratedAlways, JSONColumnType, Selectable } from 'kysely'
import type { CountryAlpha2Code } from '../../../../../packages/@resettle/schema/src/_common'

export interface PlaceTable {
  id: GeneratedAlways<string>
  external_id: number
  name: string
  alternate_names: string[]
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

assert<Equals<Place, Selectable<PlaceTable>>>
