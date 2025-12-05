import { z } from 'zod'
import { numberSchema } from '../../_common'

export const RECOMMENDATION_STRATEGIES = [
  'latest',
  'raw_similarity',
  'label_similarity',
] as const

export const recommendationStrategySchema = z.enum(RECOMMENDATION_STRATEGIES)

export const recommendationSourcesSchema = z.partialRecord(
  recommendationStrategySchema,
  numberSchema,
)

export type RecommendationStrategy = z.infer<
  typeof recommendationStrategySchema
>
export type RecommendationSources = z.infer<typeof recommendationSourcesSchema>
