import { route } from '@resettle/utils'

export const tenant = route('tenant', {
  labelRule: route('label-rule', {
    id: route(':tenantLabelRuleId'),
  }),
})
