import {
  GetObjectCommand,
  ListObjectsV2Command,
  PutObjectCommand,
  type ListObjectsV2Output,
  type S3Client,
} from '@3rd-party-clients/s3'
import { format, startOfMonth, subDays } from 'date-fns'

export const getPreviousDay = () => format(subDays(new Date(), 1), 'yyyy-MM-dd')

export const getTheDayBeforePreviousDay = () =>
  format(subDays(new Date(), 2), 'yyyy-MM-dd')

export const getCurrentDay = () => format(new Date(), 'yyyy-MM-dd')

export const getCurrentMonth = () => format(new Date(), 'yyyy-MM')

export const getStartOfMonth = () => startOfMonth(new Date())

export type RefType = 'fs' | 's3'
export type FileSystemRef = { type: 'fs'; path: string }
export type FileSystemRefDir = { type: 'fs'; directory: string }
export type S3Ref = { type: 's3'; bucket: string; key: string }
export type S3RefDir = { type: 's3'; bucket: string }
export type Ref = FileSystemRef | S3Ref
export type RefDir = FileSystemRefDir | S3RefDir
export type ByteStream = ReadableStream<Uint8Array<ArrayBufferLike>>
export type LoadOptions = { stream: boolean }
export type LoadResult = Promise<
  { success: true; data: ReadableStream<string> | Buffer } | { success: false }
>
export type SaveOptions = {
  contentType?: string
  contentLength?: number
}
export type ListOptions = { prefix: string }

export const refDirToRefS3 = (ref: S3RefDir, filename: string): S3Ref => ({
  type: 's3',
  bucket: ref.bucket,
  key: filename,
})

const linesFromByteStream = (stream: ByteStream): ReadableStream<string> => {
  const decoder = new TextDecoder()

  let remaining = ''

  return new ReadableStream<string>({
    async start(controller) {
      const reader = stream.getReader()

      while (true) {
        const { done, value } = await reader.read()

        if (done) {
          break
        }

        const text = decoder.decode(value, { stream: true })
        remaining += text

        const lines = remaining.split('\n')
        remaining = lines.pop()!

        for (const line of lines) {
          controller.enqueue(line)
        }
      }

      if (remaining) {
        controller.enqueue(remaining)
      }

      controller.close()
    },
  })
}

export async function loadFromS3(
  s3: S3Client,
  ref: S3Ref,
  opts: LoadOptions,
): LoadResult {
  try {
    const response = await s3.send(
      new GetObjectCommand({
        Bucket: ref.bucket,
        Key: ref.key,
      }),
    )

    if (opts.stream) {
      return {
        success: true,
        data: linesFromByteStream(response.Body.transformToWebStream()),
      }
    }

    return {
      success: true,
      data: Buffer.from(await response.Body.transformToByteArray()),
    }
  } catch (e: any) {
    if (e.name === 'NoSuchKey') {
      console.log(e)
      return { success: false }
    }

    throw e
  }
}

export async function saveToS3(
  s3: S3Client,
  ref: S3Ref,
  content: ByteStream | string,
  options: SaveOptions,
) {
  await s3.send(
    new PutObjectCommand({
      Bucket: ref.bucket,
      Key: ref.key,
      Body: content,
      ContentType: options.contentType,
      ContentLength: options.contentLength,
    }),
  )
}

export async function listFilesInS3(
  s3: S3Client,
  ref: S3RefDir,
  options: ListOptions,
) {
  const allKeys: string[] = []

  let continuationToken: string | undefined = undefined

  do {
    const r: ListObjectsV2Output = await s3.send(
      new ListObjectsV2Command({
        Bucket: ref.bucket,
        Prefix: options.prefix,
        ContinuationToken: continuationToken,
        MaxKeys: 1000,
      }),
    )

    for (const obj of r.Contents ?? []) {
      if (obj.Key) allKeys.push(obj.Key)
    }

    continuationToken = r.NextContinuationToken
  } while (continuationToken)

  return allKeys
}

export const conditionalInMemoryDownloadS3 = async (
  s3: S3Client,
  ref: S3Ref,
  url: string,
) => {
  const result = await loadFromS3(s3, ref, { stream: false })
  if (!result.success) {
    const resp = await fetch(url)

    if (!resp.body) {
      throw new Error(
        `Error fetching ${url} - ${resp.status}: ${resp.statusText}`,
      )
    }

    resp.body

    await saveToS3(s3, ref, resp.body, {})
    const secondResult = await loadFromS3(s3, ref, { stream: false })
    if (!secondResult.success) {
      throw new Error(`Error loading ${url}`)
    }

    return secondResult.data
  }

  return result.data
}

export const conditionalStreamDownloadS3 = async (
  s3: S3Client,
  ref: S3Ref,
  url: string,
) => {
  const result = await loadFromS3(s3, ref, { stream: true })
  if (!result.success) {
    const resp = await fetch(url)

    if (!resp.body) {
      throw new Error(
        `Error fetching ${url} - ${resp.status}: ${resp.statusText}`,
      )
    }

    await saveToS3(s3, ref, resp.body, { contentType: 'application/zip' })
  }
}
