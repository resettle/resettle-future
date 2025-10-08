import { z } from 'zod'

import {
  dateNullableSchema,
  dateOptionalSchema,
  dateSchema,
  educationExperienceArrayOptionalSchema,
  emailSchema,
  genderOptionalSchema,
  monetaryOptionalSchema,
  religionOptionalSchema,
  stringOptionalSchema,
  stringSchema,
  uuidSchema,
  workExperienceArrayOptionalSchema,
} from './common'

export const USER_ROLE_OPTIONS = ['admin', 'mod', 'user'] as const

export const userRoleSchema = z.enum(USER_ROLE_OPTIONS)

export const userMetadataSchema = z.object({
  preferred_locale: stringOptionalSchema,
  ip: stringOptionalSchema,
  user_agent: stringOptionalSchema,
  timezone: stringOptionalSchema,
  browser_fingerprint: stringOptionalSchema,
})

export const userProfileSchema = z.object({
  first_name: stringOptionalSchema,
  last_name: stringOptionalSchema,
  date_of_birth: dateOptionalSchema,
  gender: genderOptionalSchema,
  religion: religionOptionalSchema,
  education_experiences: educationExperienceArrayOptionalSchema,
  work_experiences: workExperienceArrayOptionalSchema,
  spare_savings: monetaryOptionalSchema,
})

export const userSchema = z.object({
  id: uuidSchema,
  email: emailSchema,
  username: stringSchema,
  role: userRoleSchema,
  metadata: userMetadataSchema,
  profile: userProfileSchema,
  created_at: dateSchema,
  updated_at: dateSchema,
  deleted_at: dateNullableSchema,
})

export const userAuthSchema = userSchema.pick({
  id: true,
  email: true,
  username: true,
  role: true,
})

export type User = z.infer<typeof userSchema>
export type UserRole = z.infer<typeof userRoleSchema>
export type UserMetadata = z.infer<typeof userMetadataSchema>
export type UserProfile = z.infer<typeof userProfileSchema>
export type UserAuth = z.infer<typeof userAuthSchema>
