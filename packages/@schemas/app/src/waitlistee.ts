import { z } from 'zod'
import { dateSchema, emailSchema, uuidSchema } from '../../common/src'

export const WAITLISTEE_STATUS_OPTIONS = [
  'pending',
  'sent',
  'checked',
  'accepted',
] as const

export const waitlisteeStatusSchema = z.enum(WAITLISTEE_STATUS_OPTIONS)

export const waitlisteeSchema = z.object({
  id: uuidSchema,
  email: emailSchema,
  status: waitlisteeStatusSchema,
  created_at: dateSchema,
  updated_at: dateSchema,
})

export type Waitlistee = z.infer<typeof waitlisteeSchema>
export type WaitlisteeStatus = z.infer<typeof waitlisteeStatusSchema>
