import { GetObjectCommand, type S3Client } from '@3rd-party-clients/s3'

/**
 * Retrieves a JSON or CSV file from R2 storage and parses it into JS object.
 *
 * @param ctx - Context containing R2 client, bucket name, and environment variables
 * @param params - Parameters for the R2 object
 * @param params.name - Name of the data source to retrieve
 * @param params.extension - Extension of the data source to retrieve
 * @returns Parsed R2 object
 */
export const getParsedR2Object = async <T>(
  ctx: {
    r2: S3Client
    bucket: string
  },
  params: {
    name: string
    extension: 'json' | 'csv'
  },
): Promise<T> => {
  const resp = await ctx.r2.send(
    new GetObjectCommand({
      Bucket: ctx.bucket,
      Key: `${params.name}.${params.extension}`,
    }),
  )

  if (!resp.Body) {
    throw new Error('R2 object not found')
  }

  const payload = await resp.Body.transformToString()

  switch (params.extension) {
    case 'json':
      return JSON.parse(payload)
    case 'csv':
    default:
      throw new Error('R2 object parsed failed: Unsupported extension')
  }
}
