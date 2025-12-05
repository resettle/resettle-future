import { API_ERROR_CODES, APIError, apiSuccessResponse } from '@resettle/api'
import { APP_API_SCHEMAS } from '@resettle/api/app'
import {
  createResume,
  getResumeById,
  getResumesWithOffsetPagination,
} from '@resettle/database/app'
import {
  auth,
  jsonValidator,
  paramValidator,
  queryValidator,
} from '@services/_common'
import { Hono } from 'hono'

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
      resume,
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
      resumes,
      200,
    )
  },
)

resumesRouter.get(
  APP_API_SCHEMAS.resume.getResumeById.route.path,
  auth(),
  paramValidator(
    APP_API_SCHEMAS.resume.getResumeById.route.params,
    APP_API_SCHEMAS.resume.getResumeById.params,
  ),
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
      resume,
      200,
    )
  },
)
