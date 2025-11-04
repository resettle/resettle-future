import type { OccupationCodeCrosswalk } from '@resettle/schema/global'
import { assert, type Equals } from '@resettle/utils'
import type { Selectable } from 'kysely'

export interface OccupationCodeCrosswalkTable {
  source_id: string
  target_id: string
}

assert<
  Equals<OccupationCodeCrosswalk, Selectable<OccupationCodeCrosswalkTable>>
>
