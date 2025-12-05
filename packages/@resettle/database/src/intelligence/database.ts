import type {
  CanonicalJobTable,
  CanonicalOrganizationTable,
  CostOfLivingDataTable,
  ExchangeRateDataTable,
  JobMergeActionTable,
  JobPlaceTable,
  LabelTable,
  MetadataTable,
  ModifiedScoreTable,
  OccupationCodeCrosswalkTable,
  OccupationCodeTable,
  OpportunityTable,
  OrganizationMergeActionTable,
  PlaceNameOrAliasTable,
  PlaceTable,
  ProfileTagTable,
  RawJobTable,
  RawOrganizationTable,
  RawScoreTable,
  TagProfileTable,
  TagTemplateTable,
  TenantLabelRuleTable,
  TenantTable,
  UserTable,
} from './tables'

export interface IntelligenceDatabase {
  canonical_job: CanonicalJobTable
  canonical_organization: CanonicalOrganizationTable
  cost_of_living_data: CostOfLivingDataTable
  exchange_rate_data: ExchangeRateDataTable
  job_merge_action: JobMergeActionTable
  job_place: JobPlaceTable
  label: LabelTable
  metadata: MetadataTable
  modified_score: ModifiedScoreTable
  occupation_code: OccupationCodeTable
  occupation_code_crosswalk: OccupationCodeCrosswalkTable
  opportunity: OpportunityTable
  organization_merge_action: OrganizationMergeActionTable
  place: PlaceTable
  place_name_or_alias: PlaceNameOrAliasTable
  profile_tag: ProfileTagTable
  raw_job: RawJobTable
  raw_organization: RawOrganizationTable
  raw_score: RawScoreTable
  tag_profile: TagProfileTable
  tag_template: TagTemplateTable
  tenant: TenantTable
  tenant_label_rule: TenantLabelRuleTable
  user: UserTable
}
