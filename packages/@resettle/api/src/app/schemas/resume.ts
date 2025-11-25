import {
  resumeFileTypeSchema,
  resumeSchema,
  type Resume,
} from '@resettle/schema/app'
import { safeParseDate } from '@resettle/utils'
import { z } from 'zod'

import { stringBoolOptionalSchema, uuidOptionalSchema } from '@resettle/schema'
import { defineAPISchema, getOffsetPaginationSchema } from '../../_common'
import { APP_API_ROUTES } from '../routes'

const transformResume = (resume: Resume) => {
  resume.created_at = safeParseDate(resume.created_at)
  resume.updated_at = safeParseDate(resume.updated_at)
  resume.deleted_at = safeParseDate(resume.deleted_at)
  return resume
}

export const createResume = defineAPISchema({
  method: 'POST',
  route: APP_API_ROUTES.resumes,
  body: resumeSchema.pick({
    file_type: true,
    file_url: true,
  }),
  responseData: resumeSchema,
})

export const getResumes = defineAPISchema({
  method: 'GET',
  route: APP_API_ROUTES.resumes,
  query: z.looseObject({
    limit: z.coerce.number().int().min(1).max(100).optional(),
    page: z.coerce.number().int().min(1).optional(),
    order_by: z.enum(['id', 'created_at', 'updated_at']).optional(),
    order_by_direction: z.enum(['asc', 'desc']).optional(),
    id: uuidOptionalSchema,
    user_id: uuidOptionalSchema,
    file_type: resumeFileTypeSchema.optional(),
    is_deleted: stringBoolOptionalSchema,
  }),
  responseData: getOffsetPaginationSchema(
    resumeSchema,
    z.enum(['id', 'created_at', 'updated_at']),
  ),
  transform: rawResponse => {
    return {
      ...rawResponse,
      data: rawResponse.data.map(transformResume),
    }
  },
})

export const getResumeById = defineAPISchema({
  method: 'GET',
  route: APP_API_ROUTES.resumes.id,
  params: z.object({
    resumeId: z.uuid(),
  }),
  query: z.looseObject({}),
  responseData: resumeSchema,
  transform: transformResume,
})
