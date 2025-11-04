import {
  GetObjectCommand,
  ListObjectsV2Command,
  PutObjectCommand,
  type ListObjectsV2Output,
  type S3Client,
} from '@3rd-party-clients/s3'
import { format, startOfMonth, subDays } from 'date-fns'
import { createReadStream, createWriteStream, existsSync } from 'node:fs'
import { readdir, readFile, writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import { createInterface } from 'node:readline'
import { Readable } from 'node:stream'
import { pipeline } from 'node:stream/promises'

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
export type SaveOptions = { contentType?: string }
export type ListOptions = { prefix: string }

export const refDirToRef = (ref: RefDir, filename: string): Ref => {
  switch (ref.type) {
    case 'fs':
      return { type: 'fs', path: resolve(ref.directory, filename) }
    case 's3':
      return { type: 's3', bucket: ref.bucket, key: filename }
  }
}

async function loadFromFileSystem(
  ref: FileSystemRef,
  opts: LoadOptions,
): LoadResult {
  try {
    if (!opts.stream) {
      return { success: true, data: await readFile(ref.path) }
    }

    if (!existsSync(ref.path)) {
      return { success: false }
    }

    const reader = createInterface({
      input: createReadStream(ref.path),
      crlfDelay: Infinity,
    })

    return {
      success: true,
      data: new ReadableStream<string>({
        start(controller) {
          reader.on('line', line => {
            controller.enqueue(line)
          })
          reader.on('close', () => {
            controller.close()
          })
          reader.on('error', err => {
            controller.error(err)
          })
        },

        cancel() {
          reader.close()
        },
      }),
    }
  } catch (e: any) {
    if (e.code === 'ENOENT') {
      console.log(e)
      return { success: false }
    }

    throw e
  }
}

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

async function loadFromS3(
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

export function loadFile(
  ctx: { s3: S3Client },
  ref: Ref,
  opts: { stream: true },
): Promise<{ success: true; data: ReadableStream<string> } | { success: false }>
export async function loadFile(
  ctx: { s3: S3Client },
  ref: Ref,
  opts: { stream: false },
): Promise<{ success: true; data: Buffer } | { success: false }>
export async function loadFile(
  ctx: { s3: S3Client },
  ref: Ref,
  opts: LoadOptions,
): LoadResult {
  switch (ref.type) {
    case 'fs':
      return await loadFromFileSystem(ref, opts)
    case 's3':
      return await loadFromS3(ctx.s3, ref, opts)
  }
}

async function saveToFileSystem(
  ref: FileSystemRef,
  content: ByteStream | string,
) {
  if (typeof content === 'string') {
    await writeFile(ref.path, content)
    return
  }

  await pipeline(Readable.fromWeb(content as any), createWriteStream(ref.path))
}

async function saveToS3(
  s3: S3Client,
  ref: S3Ref,
  content: ByteStream | string,
  options: SaveOptions,
) {
  await s3.send(
    new PutObjectCommand({
      Bucket: ref.bucket,
      Key: ref.key,
      Body:
        typeof content === 'string'
          ? content
          : (Readable.fromWeb(content as any) as unknown as Blob),
      ContentType: options.contentType,
    }),
  )
}

export async function saveFile(
  ctx: { s3: S3Client },
  ref: Ref,
  content: ByteStream | string,
  options: SaveOptions,
) {
  switch (ref.type) {
    case 'fs':
      return await saveToFileSystem(ref, content)
    case 's3':
      return await saveToS3(ctx.s3, ref, content, options)
  }
}

async function listFilesInFileSystem(
  ref: FileSystemRefDir,
  options: ListOptions,
) {
  const files = await readdir(ref.directory, { withFileTypes: true })
  return files
    .filter(f => f.isFile() && f.name.startsWith(options.prefix))
    .map(f => f.name)
}

async function listFilesInS3(
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

export async function listFiles(
  ctx: { s3: S3Client },
  ref: RefDir,
  options: ListOptions,
) {
  switch (ref.type) {
    case 'fs':
      return listFilesInFileSystem(ref, options)
    case 's3':
      return listFilesInS3(ctx.s3, ref, options)
  }
}
