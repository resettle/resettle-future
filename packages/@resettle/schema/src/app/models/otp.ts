import { z } from 'zod'

import { dateSchema, stringSchema, uuidSchema } from '../../_common'

export const OTP_DIGITS = 6
export const OTP_RESEND_DURATION = 60 * 10 * 1000 // 10 minutes

export const OTP_TYPE_OPTIONS = ['email', 'sms'] as const

export const otpTypeSchema = z.enum(OTP_TYPE_OPTIONS)

export const otpSchema = z.object({
  id: uuidSchema,
  action_id: uuidSchema,
  type: otpTypeSchema,
  recipient: stringSchema,
  code: stringSchema,
  created_at: dateSchema,
  expires_at: dateSchema,
  last_sent_at: dateSchema,
})

export type OTPType = z.infer<typeof otpTypeSchema>
export type OTP = z.infer<typeof otpSchema>
