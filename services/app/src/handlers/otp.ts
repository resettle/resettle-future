import { API_ERROR_CODES, APIError } from '@resettle/api'
import {
  createOTP,
  deleteOTPById,
  getOTP,
  updateOTPById,
  type AppDatabase,
} from '@resettle/database/app'
import {
  OTP_DIGITS,
  OTP_RESEND_DURATION,
  type OTPType,
} from '@resettle/schema/app'
import type { Kysely } from 'kysely'
import type { SendMailClient } from 'zeptomail'

import {
  NON_PRODUCTION_WHITELISTED_EMAILS,
  NON_PRODUCTION_WHITELISTED_OTP_CODE,
  OTP_EMAIL_SENDER_ADDRESS,
  OTP_EMAIL_SENDER_NAME,
} from '../libs/constants'

/**
 * Generates a random OTP code with the specified number of digits
 * @returns A string containing the generated OTP code
 */
const generateOTPCode = () => {
  return Array.from({ length: OTP_DIGITS }, () =>
    Math.floor(Math.random() * 10).toString(),
  ).join('')
}

/**
 * Creates and sends a one-time password (OTP) to the specified recipient
 * @param ctx - Context containing database connection and email client
 * @param params - Parameters including action id, recipient type, and recipient address
 * @throws APIError if recipient type is not supported, email sending fails, or OTP is requested too frequently
 */
export const createAndSendOTP = async (
  ctx: {
    db: Kysely<AppDatabase>
    zeptoMail: SendMailClient
    env: {
      ENV: string
    }
  },
  params: {
    action_id: string
    type: OTPType
    recipient: string
    locale?: string
  },
) => {
  const { db, zeptoMail } = ctx
  const { action_id, type, recipient, locale = 'en' } = params

  if (type !== 'email') {
    throw new APIError({
      statusCode: 400,
      code: API_ERROR_CODES.OTP_RECIPIENT_TYPE_NOT_SUPPORTED,
      message: `OTP type '${type}' is not supported yet`,
    })
  }

  if (
    ctx.env.ENV !== 'production' &&
    !NON_PRODUCTION_WHITELISTED_EMAILS.includes(recipient)
  ) {
    throw new APIError({
      statusCode: 400,
      code: API_ERROR_CODES.OTP_EMAIL_SEND_FAILED,
      message: 'Please use non-production whitelisted emails',
    })
  }

  /**
   * Sends an OTP email to the recipient
   * @param code - The OTP code to be sent
   * @throws APIError if email sending fails
   */
  const sendOtpEmail = async (code: string) => {
    try {
      await zeptoMail.sendMailWithTemplate({
        from: {
          name: OTP_EMAIL_SENDER_NAME,
          address: OTP_EMAIL_SENDER_ADDRESS,
        },
        to: [
          {
            email_address: {
              address: recipient,
            },
          },
        ],
        template_alias: `otp-${locale}`,
        merge_info: { code },
      })
    } catch (error) {
      throw new APIError({
        statusCode: 500,
        code: API_ERROR_CODES.OTP_EMAIL_SEND_FAILED,
        message: 'Failed to send OTP email',
        data: {
          reason: error,
        },
      })
    }
  }

  const now = new Date()
  const code =
    ctx.env.ENV !== 'production' &&
    NON_PRODUCTION_WHITELISTED_EMAILS.includes(recipient)
      ? NON_PRODUCTION_WHITELISTED_OTP_CODE
      : generateOTPCode()

  const existing = await getOTP(db, action_id, type, recipient)

  if (!existing) {
    const otp = await createOTP(db, {
      action_id,
      type,
      recipient,
      code,
      last_sent_at: now,
    })

    return await sendOtpEmail(otp.code)
  }

  if (existing.expires_at.getTime() <= now.getTime()) {
    await updateOTPById(db, existing.id, {
      code,
      last_sent_at: now,
    })

    return await sendOtpEmail(existing.code)
  }

  if (existing.last_sent_at.getTime() + OTP_RESEND_DURATION <= now.getTime()) {
    await updateOTPById(db, existing.id, { last_sent_at: now })

    return await sendOtpEmail(existing.code)
  }

  throw new APIError({
    statusCode: 400,
    code: API_ERROR_CODES.OTP_REQUEST_TOO_FREQUENT,
    message: 'OTP requested too frequently',
  })
}

/**
 * Verifies a one-time password (OTP) against the stored value
 * @param ctx - Context containing database connection
 * @param params - Parameters including action id, recipient type, recipient address, and code to verify
 * @throws APIError if the OTP is invalid or doesn't match
 */
export const verifyOTP = async (
  ctx: {
    db: Kysely<AppDatabase>
    env: {
      ENV: string
    }
  },
  params: {
    action_id: string
    type: OTPType
    recipient: string
    code: string
  },
) => {
  const { db } = ctx
  const { action_id, type, recipient, code } = params

  const otp = await getOTP(db, action_id, type, recipient)

  if (!otp || otp.code !== code) {
    throw new APIError({
      statusCode: 400,
      code: API_ERROR_CODES.OTP_INVALID,
      message: 'Invalid or expired OTP code',
    })
  }

  await deleteOTPById(db, otp.id)
}
