import type {
  OccupationCode,
  OccupationCodeClassification,
} from '@resettle/schema/global'
import { assert, type Equals } from '@resettle/utils'
import type { Selectable } from 'kysely'

export interface OccupationCodeTable {
  id: string
  classification: OccupationCodeClassification
  code: string
  label: string
}

assert<Equals<OccupationCode, Selectable<OccupationCodeTable>>>
