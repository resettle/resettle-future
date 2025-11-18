import { z } from 'zod'

import { dateNullableSchema, dateSchema, uuidSchema } from '../../_common'

export const SESSION_TYPES = [
  'opportunity-process',
  'recommendation-process',
  'message',
] as const

export const sessionTypeSchema = z.enum(SESSION_TYPES)

export const SESSION_STATUSES = ['ongoing', 'error', 'done'] as const

export const sessionStatusSchema = z.enum(SESSION_STATUSES)

export const sessionSchema = z.object({
  id: uuidSchema,
  type: sessionTypeSchema,
  status: sessionStatusSchema,
  created_at: dateSchema,
  completed_at: dateNullableSchema,
})

export type SessionType = z.infer<typeof sessionTypeSchema>
export type SessionStatus = z.infer<typeof sessionStatusSchema>
export type Session = z.infer<typeof sessionSchema>
