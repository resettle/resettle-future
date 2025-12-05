import { z } from 'zod'

export const MARITAL_STATUSES = [
  'single',
  'married',
  'divorced',
  'widowed',
] as const

export const maritalStatusSchema = z.enum(MARITAL_STATUSES)

export type MaritalStatus = z.infer<typeof maritalStatusSchema>
