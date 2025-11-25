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

export const userTagSchema = z.object({
  user_id: uuidSchema,
  tag_template_id: uuidSchema,
  data: recordSchema,
  created_at: dateSchema,
  updated_at: dateSchema,
})

export const userTagBodySchema = z.object({
  user_id: uuidSchema,
  tag_id: uuidSchema,
})

export const userTagResponseSchema = userTagSchema
  .pick({
    user_id: true,
    created_at: true,
    updated_at: true,
  })
  .extend({
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
export type UserTag = z.infer<typeof userTagSchema>
export type UserTagBody = z.infer<typeof userTagBodySchema>
export type UserTagResponse = z.infer<typeof userTagResponseSchema>
export type SkillTag = z.infer<typeof skillTagSchema>
