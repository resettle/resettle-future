import { z } from 'zod'

import { stringSchema } from '../../_common'

export const occupationCodeCrosswalkSchema = z.object({
  source_id: stringSchema,
  target_id: stringSchema,
})

export type OccupationCodeCrosswalk = z.infer<
  typeof occupationCodeCrosswalkSchema
>
