import { z } from 'zod'

import {
  dateNullableSchema,
  dateSchema,
  jsonObjectNullableSchema,
  urlSchema,
  uuidSchema,
} from '../../_common'

export const RESUME_FILE_TYPE_OPTIONS = ['pdf', 'docx'] as const

export const resumeFileTypeSchema = z.enum(RESUME_FILE_TYPE_OPTIONS)

export const resumeSchema = z.object({
  id: uuidSchema,
  user_id: uuidSchema,
  file_type: resumeFileTypeSchema,
  file_url: urlSchema,
  parsed_result: jsonObjectNullableSchema,
  created_at: dateSchema,
  updated_at: dateSchema,
  deleted_at: dateNullableSchema,
})

export type Resume = z.infer<typeof resumeSchema>
export type ResumeFileType = z.infer<typeof resumeFileTypeSchema>
