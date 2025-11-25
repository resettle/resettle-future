import type { OTPTable, ResumeTable, UserTable } from './tables'

export interface AppDatabase {
  otp: OTPTable
  resume: ResumeTable
  user: UserTable
}
