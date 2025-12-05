import {
  labelCreateBodySchema,
  labelDeleteBodySchema,
  labelSchema,
} from '@resettle/schema/intelligence'
import { z } from 'zod'

import { defineAPISchema } from '../../_common'
import { INTELLIGENCE_API_ROUTES } from '../routes'

export const createLabels = defineAPISchema({
  method: 'POST',
  route: INTELLIGENCE_API_ROUTES.label,
  body: z.array(labelCreateBodySchema).min(1).max(10),
  responseData: z.array(labelSchema),
})

export const deleteLabels = defineAPISchema({
  method: 'POST',
  route: INTELLIGENCE_API_ROUTES.label.delete,
  body: z.array(labelDeleteBodySchema).min(1).max(10),
  responseData: z.array(labelDeleteBodySchema),
})
