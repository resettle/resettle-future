import { API_ERROR_CODES, APIError, apiSuccessResponse } from '@resettle/api'
import { GLOBAL_API_SCHEMAS } from '@resettle/api/global'
import {
  createTenantLabelRule,
  deprecateTenantLabelRule,
  updateTenantLabelRule,
} from '@resettle/database/global'
import { jsonValidator, paramValidator } from '@services/_common'
import { Hono } from 'hono'

const DUMMY_TENANT_ID = '00000000-0000-0000-0000-000000000000'

export const tenantRouter = new Hono<{ Bindings: Cloudflare.Env }>()

tenantRouter.post(
  GLOBAL_API_SCHEMAS.tenant.createTenantLabelRule.route.path,
  jsonValidator(GLOBAL_API_SCHEMAS.tenant.createTenantLabelRule.body),
  async ctx => {
    const db = ctx.get('db')
    const body = ctx.req.valid('json')
    const result = await createTenantLabelRule(db, DUMMY_TENANT_ID, body)

    return apiSuccessResponse(
      GLOBAL_API_SCHEMAS.tenant.createTenantLabelRule.responseData,
      {
        id: result.id,
        name: result.name,
        rule: result.rule,
        created_at: result.created_at,
        updated_at: result.updated_at,
      },
      200,
    )
  },
)

tenantRouter.patch(
  GLOBAL_API_SCHEMAS.tenant.updateTenantLabelRule.route.path,
  paramValidator(
    ['tenantLabelRuleId'] as const,
    GLOBAL_API_SCHEMAS.tenant.updateTenantLabelRule.params,
  ),
  jsonValidator(GLOBAL_API_SCHEMAS.tenant.updateTenantLabelRule.body),
  async ctx => {
    const db = ctx.get('db')
    const { tenantLabelRuleId } = ctx.req.valid('param')
    const body = ctx.req.valid('json')
    const result = await updateTenantLabelRule(
      db,
      DUMMY_TENANT_ID,
      tenantLabelRuleId,
      body,
    )

    if (!result) {
      throw new APIError({
        statusCode: 404,
        code: API_ERROR_CODES.NOT_FOUND,
        message: 'Tenant label not found',
      })
    }

    return apiSuccessResponse(
      GLOBAL_API_SCHEMAS.tenant.updateTenantLabelRule.responseData,
      {
        id: result.id,
        name: result.name,
        rule: result.rule,
        created_at: result.created_at,
        updated_at: result.updated_at,
      },
      200,
    )
  },
)

tenantRouter.delete(
  GLOBAL_API_SCHEMAS.tenant.deprecateTenantLabelRule.route.path,
  paramValidator(
    ['tenantLabelRuleId'] as const,
    GLOBAL_API_SCHEMAS.tenant.deprecateTenantLabelRule.params,
  ),
  async ctx => {
    const db = ctx.get('db')
    const { tenantLabelRuleId } = ctx.req.valid('param')
    const result = await deprecateTenantLabelRule(
      db,
      DUMMY_TENANT_ID,
      tenantLabelRuleId,
    )

    if (!result) {
      throw new APIError({
        statusCode: 404,
        code: API_ERROR_CODES.NOT_FOUND,
        message: 'Tenant label not found',
      })
    }

    return apiSuccessResponse(
      GLOBAL_API_SCHEMAS.tenant.deprecateTenantLabelRule.responseData,
      {
        id: result.id,
        name: result.name,
        rule: result.rule,
        created_at: result.created_at,
        updated_at: result.updated_at,
      },
      200,
    )
  },
)
