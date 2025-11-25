import {
  emailSchema,
  stringOptionalSchema,
  stringSchema,
  uuidSchema,
} from '@resettle/schema'
import { z } from 'zod'

import { defineAPISchema } from '../../_common'
import { APP_API_ROUTES } from '../routes'

export const signInWithEmail = defineAPISchema({
  method: 'POST',
  route: APP_API_ROUTES.auth.signIn.email,
  body: z.object({
    action_id: uuidSchema,
    email: emailSchema,
    email_otp: stringSchema,
    username: stringOptionalSchema,
  }),
  responseData: z.object({
    uid: uuidSchema,
    access_token: stringSchema,
  }),
})

export const requestEmailOTP = defineAPISchema({
  method: 'POST',
  route: APP_API_ROUTES.auth.otp.email,
  body: z.object({
    action_id: uuidSchema,
    email: emailSchema,
    locale: stringOptionalSchema,
  }),
  responseData: z.object({}),
})
