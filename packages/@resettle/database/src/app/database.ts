import type { OTPTable, ShortLinkTable, SignalTable, UserTable } from './tables'

export interface AppDatabase {
  otp: OTPTable
  short_link: ShortLinkTable
  signal: SignalTable
  user: UserTable
}
