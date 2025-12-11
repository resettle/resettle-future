import { z } from 'zod'

export const SCRAPE_SOURCE_TRUSTWORTHINESS = [
  'owned',
  'branded',
  'curated-niche',
  'curated-generic',
  'aggregated',
  'unknown',
] as const

export const scrapeSourceTrustworthinessSchema = z.enum(
  SCRAPE_SOURCE_TRUSTWORTHINESS,
)

export type ScrapeSourceTrustworthiness = z.infer<
  typeof scrapeSourceTrustworthinessSchema
>
