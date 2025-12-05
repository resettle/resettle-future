import { z } from 'zod'

import { dateSchema } from '../../_common'

export const metadataSchema = z.object({
  geonames_updated_at: dateSchema,
  numbeo_updated_at: dateSchema,
  lightcast_updated_at: dateSchema,
})

export type Metadata = z.infer<typeof metadataSchema>
