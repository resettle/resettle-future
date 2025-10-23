import { z } from 'zod'

import { dateSchema } from '../../common'

export const metadataSchema = z.object({
  geonames_updated_at: dateSchema,
  numbeo_updated_at: dateSchema,
})

export type Metadata = z.infer<typeof metadataSchema>
