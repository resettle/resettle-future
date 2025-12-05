import { z } from 'zod'

import { educationExperienceSchema } from '../education'
import { countryAlpha2CodeSchema } from '../iso'
import { workExperienceSchema } from '../work'
import { maritalStatusSchema } from './marital-status'

export const FAMILY_MEMBER_TYPES = [
  'partner',
  'child',
  'parent',
  'grandchild',
  'grandparent',
  'sibling',
  'aunt/uncle',
  'niece/nephew',
  'cousin',
] as const

export const familyMemberTypeSchema = z.enum(FAMILY_MEMBER_TYPES)

export const familyMemberSchema = z.object({
  id: z.uuid(),
  type: familyMemberTypeSchema,
  date_of_birth: z.coerce.date().optional(),
  country_of_birth: countryAlpha2CodeSchema.optional(),
  citizenship: z.array(countryAlpha2CodeSchema).optional(),
  permanent_residency: z.array(countryAlpha2CodeSchema).optional(),
  education_experiences: z.array(educationExperienceSchema).optional(),
  work_experiences: z.array(workExperienceSchema).optional(),
  financial_dependent: z.boolean().optional(),
  marital_status: maritalStatusSchema.optional(),
})

export type FamilyMember = z.infer<typeof familyMemberSchema>
export type FamilyMemberType = z.infer<typeof familyMemberTypeSchema>
