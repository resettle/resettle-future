import type {
  OpportunityTagTable,
  OTPTable,
  ShortLinkTable,
  SignalTable,
  TagTemplateTable,
  UserTable,
  UserTagTable,
} from './tables'

export interface AppDatabase {
  opportunity_tag: OpportunityTagTable
  otp: OTPTable
  short_link: ShortLinkTable
  signal: SignalTable
  tag_template: TagTemplateTable
  user: UserTable
  user_tag: UserTagTable
}
