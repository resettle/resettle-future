import { z } from 'zod'

export const MERGE_ACTION_TYPES = ['merge', 'unmerge'] as const

export const mergeActionTypeSchema = z.enum(MERGE_ACTION_TYPES)

export type MergeActionType = z.infer<typeof mergeActionTypeSchema>
