import {
  tenantLabelRuleCreateBodySchema,
  tenantLabelRuleResponseSchema,
  tenantLabelRuleUpdateBodySchema,
} from '@resettle/schema/intelligence'
import { z } from 'zod'

import { jsonObjectSchema } from '@resettle/schema'
import { defineAPISchema } from '../../_common'
import { INTELLIGENCE_API_ROUTES } from '../routes'

export const createTenantLabelRule = defineAPISchema({
  method: 'POST',
  route: INTELLIGENCE_API_ROUTES.tenant.labelRule,
  body: tenantLabelRuleCreateBodySchema,
  responseData: tenantLabelRuleResponseSchema,
})

export const updateTenantLabelRule = defineAPISchema({
  method: 'PATCH',
  route: INTELLIGENCE_API_ROUTES.tenant.labelRule.id,
  params: z.object({
    tenantLabelRuleId: z.uuid(),
  }),
  body: tenantLabelRuleUpdateBodySchema,
  responseData: tenantLabelRuleResponseSchema,
})

export const deprecateTenantLabelRule = defineAPISchema({
  method: 'DELETE',
  route: INTELLIGENCE_API_ROUTES.tenant.labelRule.id,
  params: z.object({
    tenantLabelRuleId: z.uuid(),
  }),
  query: jsonObjectSchema,
  responseData: tenantLabelRuleResponseSchema,
})
