import { z } from 'zod'

import {
  dateSchema,
  numberSchema,
  stringSchema,
  uuidSchema,
} from '../../_common'

export const SIGNAL_TYPES = [
  'message',
  'click',
  'dwell-start',
  'dwell-end',
  'scroll',
] as const

export const signalTypeSchema = z.enum(SIGNAL_TYPES)

export const messageSignalDataSchema = z.object({
  type: z.literal('message'),
  session_id: uuidSchema,
  channels: z.array(stringSchema),
})

export const scrollSignalDataSchema = z.object({
  type: z.literal('scroll'),
  depth: numberSchema,
})

export const signalDataSchema = z.discriminatedUnion('type', [
  messageSignalDataSchema,
  scrollSignalDataSchema,
])

export const signalSchema = z.object({
  id: stringSchema,
  type: signalTypeSchema,
  user_id: uuidSchema,
  opportunity_id: uuidSchema,
  data: signalDataSchema.nullable(),
  created_at: dateSchema,
})

export type SignalType = z.infer<typeof signalTypeSchema>
export type Signal = z.infer<typeof signalSchema>
export type SignalData = z.infer<typeof signalDataSchema>
