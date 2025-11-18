import { z } from 'zod'

import {
  dateNullableSchema,
  dateSchema,
  numberSchema,
  stringSchema,
  uuidSchema,
} from '../../_common'

export const TAG_NAMESPACES = ['skill', 'interest'] as const

export const tagNamespaceSchema = z.enum(TAG_NAMESPACES)

export const skillTagMetadataSchema = z.object({
  namespace: z.literal('skill'),
  category: stringSchema,
  sub_category: stringSchema,
  external_id: stringSchema,
})

export const interestTagMetadataSchema = z.object({
  namespace: z.literal('interest'),
})

export const tagMetadataSchema = z.discriminatedUnion('namespace', [
  skillTagMetadataSchema,
  interestTagMetadataSchema,
])

export const tagTemplateSchema = z.object({
  id: uuidSchema,
  slug: stringSchema,
  name: stringSchema,
  namespace: tagNamespaceSchema,
  embedding: z.array(numberSchema),
  metadata: tagMetadataSchema,
  created_at: dateSchema,
  deprecated_at: dateNullableSchema,
})

export type TagNamespace = z.infer<typeof tagNamespaceSchema>
export type TagTemplate = z.infer<typeof tagTemplateSchema>
export type TagMetadata = z.infer<typeof tagMetadataSchema>
