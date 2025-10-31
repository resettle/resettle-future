import type {
  CostOfLivingDataTable,
  ExchangeRateDataTable,
  MetadataTable,
  OccupationCodeCrosswalkTable,
  OccupationCodeTable,
  PlaceNameOrAliasTable,
  PlaceTable,
} from './tables'

export interface Database {
  cost_of_living_data: CostOfLivingDataTable
  exchange_rate_data: ExchangeRateDataTable
  metadata: MetadataTable
  occupation_code: OccupationCodeTable
  occupation_code_crosswalk: OccupationCodeCrosswalkTable
  place: PlaceTable
  place_name_or_alias: PlaceNameOrAliasTable
}
