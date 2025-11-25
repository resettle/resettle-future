import type { Resume, ResumeFileType } from '@resettle/schema/app'
import { assert, type Equals } from '@resettle/utils'
import type {
  Generated,
  GeneratedAlways,
  JSONColumnType,
  Selectable,
} from 'kysely'

export interface ResumeTable {
  id: GeneratedAlways<string>
  user_id: string
  file_type: ResumeFileType
  file_url: string
  parsed_result: JSONColumnType<Record<string, unknown>> | null
  created_at: Generated<Date>
  updated_at: Generated<Date>
  deleted_at: Date | null
}

assert<Equals<Resume, Selectable<ResumeTable>>>
