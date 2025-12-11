import type {
  ScrapeTask,
  ScrapeTaskConfiguration,
  ScrapeTaskStatus,
  ScrapeTaskType,
} from '@resettle/schema/intelligence'
import { assert, type Equals } from '@resettle/utils'
import type {
  Generated,
  GeneratedAlways,
  JSONColumnType,
  Selectable,
} from 'kysely'

export interface ScrapeTaskTable {
  id: GeneratedAlways<string>
  source: string
  status: ScrapeTaskStatus
  type: ScrapeTaskType
  configuration: JSONColumnType<ScrapeTaskConfiguration>
  created_at: Generated<Date>
  finalized_at: Date | null
}

assert<Equals<ScrapeTask, Selectable<ScrapeTaskTable>>>
