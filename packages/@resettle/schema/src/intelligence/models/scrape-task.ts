import { z } from 'zod'

import {
  cutoffSchema,
  dateNullableSchema,
  dateSchema,
  intOptionalSchema,
  stringSchema,
  uuidSchema,
} from '../../_common'

export const SCRAPE_TASK_STATUSES = [
  'scheduled',
  'processing',
  'completed',
  'error',
] as const

export const scrapeTaskStatusSchema = z.enum(SCRAPE_TASK_STATUSES)

export const SCRAPE_TASK_TYPES = ['brief', 'full'] as const

export const scrapeTaskTypeSchema = z.enum(SCRAPE_TASK_TYPES)

export const scrapeTaskConfigurationSchema = z.object({
  cutoff: cutoffSchema.optional(),
  limit: intOptionalSchema,
})

export const scrapeTaskSchema = z.object({
  id: uuidSchema,
  source: stringSchema,
  status: scrapeTaskStatusSchema,
  type: scrapeTaskTypeSchema,
  configuration: scrapeTaskConfigurationSchema,
  created_at: dateSchema,
  finalized_at: dateNullableSchema,
})

export type ScrapeTaskStatus = z.infer<typeof scrapeTaskStatusSchema>
export type ScrapeTaskType = z.infer<typeof scrapeTaskTypeSchema>
export type ScrapeTaskConfiguration = z.infer<
  typeof scrapeTaskConfigurationSchema
>
export type ScrapeTask = z.infer<typeof scrapeTaskSchema>
