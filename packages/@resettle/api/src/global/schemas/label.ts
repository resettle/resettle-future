import { numberSchema, uuidSchema } from '@resettle/schema'
import { labelSchema } from '@resettle/schema/global'
import { z } from 'zod'

import { defineAPISchema } from '../../_common'
import { GLOBAL_API_ROUTES } from '../routes'

export const createLabels = defineAPISchema({
  method: 'POST',
  route: GLOBAL_API_ROUTES.label,
  body: z.array(
    z.object({
      user_id: uuidSchema,
      item_id: uuidSchema,
      value: numberSchema,
    }),
  ),
  responseData: z.array(labelSchema),
})

export const deleteLabels = defineAPISchema({
  method: 'POST',
  route: GLOBAL_API_ROUTES.label.delete,
  body: z.array(
    z.object({
      user_id: uuidSchema,
      item_id: uuidSchema,
    }),
  ),
  responseData: z.array(labelSchema),
})
