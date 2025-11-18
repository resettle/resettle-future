import type {
  CanonicalOpportunityTable,
  CanonicalOrganizationTable,
  OpportunityMergeActionTable,
  OpportunityPlaceTable,
  OpportunityTagTable,
  OrganizationMergeActionTable,
  OTPTable,
  RawOpportunityTable,
  RawOrganizationTable,
  ScoreTable,
  ShortLinkTable,
  SignalTable,
  TagTemplateTable,
  UserTable,
  UserTagTable,
} from './tables'

export interface AppDatabase {
  canonical_opportunity: CanonicalOpportunityTable
  canonical_organization: CanonicalOrganizationTable
  opportunity_merge_action: OpportunityMergeActionTable
  opportunity_place: OpportunityPlaceTable
  opportunity_tag: OpportunityTagTable
  organization_merge_action: OrganizationMergeActionTable
  otp: OTPTable
  raw_opportunity: RawOpportunityTable
  raw_organization: RawOrganizationTable
  score: ScoreTable
  short_link: ShortLinkTable
  signal: SignalTable
  tag_template: TagTemplateTable
  user: UserTable
  user_tag: UserTagTable
}
