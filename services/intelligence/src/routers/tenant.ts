import { API_ERROR_CODES, APIError, apiSuccessResponse } from '@resettle/api'
import { INTELLIGENCE_API_SCHEMAS } from '@resettle/api/intelligence'
import {
  createTenantLabelRule,
  deprecateTenantLabelRule,
  updateTenantLabelRule,
} from '@resettle/database/intelligence'
import { jsonValidator, paramValidator } from '@services/_common'
import { Hono } from 'hono'
import { describeRoute, resolver } from 'hono-openapi'

const DUMMY_TENANT_ID = '00000000-0000-0000-0000-000000000000'

export const tenantRouter = new Hono<{ Bindings: Cloudflare.Env }>()

tenantRouter.post(
  INTELLIGENCE_API_SCHEMAS.tenant.createTenantLabelRule.route.path,
  describeRoute({
    description: 'Create tenant label rule',
    responses: {
      200: {
        description: 'Tenant label rule created successfully',
        content: {
          'application/json': {
            schema: resolver(INTELLIGENCE_API_SCHEMAS.tenant.createTenantLabelRule.responseData),
          },
        },
      },
    },
  }),
  jsonValidator(INTELLIGENCE_API_SCHEMAS.tenant.createTenantLabelRule.body),
  async ctx => {
    const db = ctx.get('db')
    const body = ctx.req.valid('json')
    const result = await createTenantLabelRule(db, DUMMY_TENANT_ID, body)

    return apiSuccessResponse(
      INTELLIGENCE_API_SCHEMAS.tenant.createTenantLabelRule.responseData,
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
  INTELLIGENCE_API_SCHEMAS.tenant.updateTenantLabelRule.route.path,
  describeRoute({
    description: 'Update tenant label rule',
    responses: {
      200: {
        description: 'Tenant label rule updated successfully',
        content: {
          'application/json': {
            schema: resolver(INTELLIGENCE_API_SCHEMAS.tenant.updateTenantLabelRule.responseData),
          },
        },
      },
    },
  }),
  paramValidator(
    ['tenantLabelRuleId'] as const,
    INTELLIGENCE_API_SCHEMAS.tenant.updateTenantLabelRule.params,
  ),
  jsonValidator(INTELLIGENCE_API_SCHEMAS.tenant.updateTenantLabelRule.body),
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
      INTELLIGENCE_API_SCHEMAS.tenant.updateTenantLabelRule.responseData,
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
  INTELLIGENCE_API_SCHEMAS.tenant.deprecateTenantLabelRule.route.path,
  describeRoute({
    description: 'Deprecate tenant label rule',
    responses: {
      200: {
        description: 'Tenant label rule deprecated successfully',
        content: {
          'application/json': {
            schema: resolver(INTELLIGENCE_API_SCHEMAS.tenant.deprecateTenantLabelRule.responseData),
          },
        },
      },
    },
  }),
  paramValidator(
    ['tenantLabelRuleId'] as const,
    INTELLIGENCE_API_SCHEMAS.tenant.deprecateTenantLabelRule.params,
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
      INTELLIGENCE_API_SCHEMAS.tenant.deprecateTenantLabelRule.responseData,
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
