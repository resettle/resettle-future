import { z } from 'zod'

import { dateSchema, stringSchema, uuidSchema } from '../../common'

export const CANONICAL_ENTITY_TYPES = [
  'country',
  'place',
  'currency',
  'occupation-code',
] as const

export const canonicalEntityTypesSchema = z.enum(CANONICAL_ENTITY_TYPES)

export const canonicalEntitySchema = z.object({
  id: uuidSchema,
  name: stringSchema,
  type: canonicalEntityTypesSchema,
  created_at: dateSchema,
})

export type CanonicalEntityType = z.infer<typeof canonicalEntityTypesSchema>
export type CanonicalEntity = z.infer<typeof canonicalEntitySchema>
