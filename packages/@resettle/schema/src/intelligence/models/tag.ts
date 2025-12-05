import { z } from 'zod'

import {
  dateNullableSchema,
  dateSchema,
  numberSchema,
  recordSchema,
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

export const tagTemplateResponseSchema = tagTemplateSchema.pick({
  id: true,
  slug: true,
  name: true,
  namespace: true,
  metadata: true,
})

export const profileTagSchema = z.object({
  tag_profile_id: uuidSchema,
  tag_template_id: uuidSchema,
  data: recordSchema,
  created_at: dateSchema,
  updated_at: dateSchema,
})

export const userTagAttachBodySchema = z.object({
  user_id: uuidSchema,
  tag_id: uuidSchema,
  data: recordSchema,
})

export const userTagDetachBodySchema = z.object({
  user_id: uuidSchema,
  tag_id: uuidSchema,
})

export const skillTagSchema = tagTemplateSchema
  .omit({
    created_at: true,
    deprecated_at: true,
    metadata: true,
  })
  .extend(skillTagMetadataSchema.shape)

export type TagNamespace = z.infer<typeof tagNamespaceSchema>
export type TagTemplate = z.infer<typeof tagTemplateSchema>
export type TagMetadata = z.infer<typeof tagMetadataSchema>
export type SkillTagMetadata = z.infer<typeof skillTagMetadataSchema>
export type TagTemplateResponse = z.infer<typeof tagTemplateResponseSchema>
export type ProfileTag = z.infer<typeof profileTagSchema>
export type UserTagAttachBody = z.infer<typeof userTagAttachBodySchema>
export type UserTagDetachBody = z.infer<typeof userTagDetachBodySchema>
export type SkillTag = z.infer<typeof skillTagSchema>
