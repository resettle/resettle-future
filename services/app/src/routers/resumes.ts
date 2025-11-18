import { API_ERROR_CODES, APIError, apiSuccessResponse } from '@resettle/api'
import { APP_API_SCHEMAS } from '@resettle/api/app'
import {
  createResume,
  getResumeById,
  getResumesWithOffsetPagination,
} from '@resettle/database/app'
import type { Resume } from '@resettle/schema/app'
import {
  auth,
  jsonValidator,
  paramValidator,
  queryValidator,
} from '@services/_common'
import { Hono } from 'hono'

/**
 * Converts a resume to a resume response
 * @param resume - The resume to convert
 * @returns The resume response
 */
const toResumeResponse = (resume: Resume): Resume => {
  return {
    id: resume.id,
    user_id: resume.user_id,
    file_type: resume.file_type,
    file_url: resume.file_url,
    parsed_result: resume.parsed_result,
    created_at: resume.created_at,
    updated_at: resume.updated_at,
    deleted_at: resume.deleted_at,
  }
}

export const resumesRouter = new Hono<{ Bindings: Cloudflare.Env }>()

resumesRouter.post(
  APP_API_SCHEMAS.resume.createResume.route.path,
  auth(),
  jsonValidator(APP_API_SCHEMAS.resume.createResume.body),
  async ctx => {
    const db = ctx.get('db')
    const user = ctx.get('user')
    const { file_type, file_url } = ctx.req.valid('json')

    const resume = await createResume(db, {
      user_id: user.id,
      file_type,
      file_url,
    })

    return apiSuccessResponse(
      APP_API_SCHEMAS.resume.createResume.responseData,
      toResumeResponse(resume),
      201,
    )
  },
)

resumesRouter.get(
  APP_API_SCHEMAS.resume.getResumes.route.path,
  auth(),
  queryValidator(APP_API_SCHEMAS.resume.getResumes.query),
  async ctx => {
    const db = ctx.get('db')
    const {
      limit = 10,
      page = 1,
      order_by = 'created_at',
      order_by_direction = 'desc',
      ...where
    } = ctx.req.valid('query')

    const resumes = await getResumesWithOffsetPagination(db, {
      limit,
      page,
      orderBy: order_by,
      orderByDirection: order_by_direction,
      where,
    })

    return apiSuccessResponse(
      APP_API_SCHEMAS.resume.getResumes.responseData,
      {
        ...resumes,
        data: resumes.data.map(toResumeResponse),
      },
      200,
    )
  },
)

resumesRouter.get(
  APP_API_SCHEMAS.resume.getResumeById.route.path,
  auth(),
  paramValidator(['resumeId'] as const, APP_API_SCHEMAS.resume.getResumeById.params!),
  queryValidator(APP_API_SCHEMAS.resume.getResumeById.query),
  async ctx => {
    const db = ctx.get('db')
    const { resumeId } = ctx.req.valid('param')

    const resume = await getResumeById(db, resumeId)

    if (!resume) {
      throw new APIError({
        statusCode: 404,
        code: API_ERROR_CODES.NOT_FOUND,
        message: 'Resume not found',
      })
    }

    return apiSuccessResponse(
      APP_API_SCHEMAS.resume.getResumeById.responseData,
      toResumeResponse(resume),
      200,
    )
  },
)

