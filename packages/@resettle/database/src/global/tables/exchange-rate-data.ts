import type { CurrencyCode } from '@resettle/schema'
import type { ExchangeRateData } from '@resettle/schema/global'
import { assert, type Equals } from '@resettle/utils'
import type { Generated, Selectable } from 'kysely'

export interface ExchangeRateDataTable {
  currency_code: CurrencyCode
  rate_to_usd: number
  created_at: Generated<Date>
}

assert<Equals<ExchangeRateData, Selectable<ExchangeRateDataTable>>>
