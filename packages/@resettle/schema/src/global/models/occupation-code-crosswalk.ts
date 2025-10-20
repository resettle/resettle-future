import { z } from 'zod'

import { uuidSchema } from '../../common'

export const occupationCodeCrosswalkSchema = z.object({
  source_id: uuidSchema,
  target_id: uuidSchema,
})

export type OccupationCodeCrosswalk = z.infer<
  typeof occupationCodeCrosswalkSchema
>
