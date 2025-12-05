import type { FortuneGlobal500, InstitutionRanking } from '@resettle/schema'
import type {
  ExchangeRateData,
  OccupationCode,
  OccupationCodeCrosswalk,
} from '@resettle/schema/intelligence'

import type { Ref, RefInput } from './refs'

export type StateInputOverrides = {
  points?: number
}

export type ContextInput = {
  exchangeRatesData: ExchangeRateData[]
  institutionRankingsData: InstitutionRanking[]
  fortuneGlobal500Data: FortuneGlobal500[]
  occupationClassificationCrosswalksData: OccupationCodeCrosswalk[]
  occupationClassificationsData: OccupationCode[]
}

export type ContextBindings = {
  getRefValue: <T>(ref: Ref, input: RefInput) => T
  stateInputOverrides: StateInputOverrides
}

export type Context = ContextInput & ContextBindings
