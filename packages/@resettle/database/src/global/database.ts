import type {
  CanonicalJobTable,
  CanonicalOrganizationTable,
  CostOfLivingDataTable,
  ExchangeRateDataTable,
  JobMergeActionTable,
  JobPlaceTable,
  JobTagTable,
  LabelTable,
  MetadataTable,
  OccupationCodeCrosswalkTable,
  OccupationCodeTable,
  OrganizationMergeActionTable,
  PlaceNameOrAliasTable,
  PlaceTable,
  RawJobTable,
  RawOrganizationTable,
  ScoreTable,
  TagTemplateTable,
  TenantTable,
  UserTable,
  UserTagTable,
} from './tables'

export interface GlobalDatabase {
  canonical_job: CanonicalJobTable
  canonical_organization: CanonicalOrganizationTable
  cost_of_living_data: CostOfLivingDataTable
  exchange_rate_data: ExchangeRateDataTable
  job_merge_action: JobMergeActionTable
  job_place: JobPlaceTable
  job_tag: JobTagTable
  label: LabelTable
  metadata: MetadataTable
  occupation_code: OccupationCodeTable
  occupation_code_crosswalk: OccupationCodeCrosswalkTable
  organization_merge_action: OrganizationMergeActionTable
  place: PlaceTable
  place_name_or_alias: PlaceNameOrAliasTable
  raw_job: RawJobTable
  raw_organization: RawOrganizationTable
  score: ScoreTable
  tag_template: TagTemplateTable
  tenant: TenantTable
  user_tag: UserTagTable
  user: UserTable
}
