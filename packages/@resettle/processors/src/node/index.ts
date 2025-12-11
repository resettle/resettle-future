import type { S3Client } from '@3rd-party-clients/s3'
import { createReadStream, createWriteStream, existsSync } from 'node:fs'
import { mkdir, readdir, readFile, writeFile } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import { createInterface } from 'node:readline'
import { Readable } from 'node:stream'
import { pipeline } from 'node:stream/promises'

import {
  listFilesInS3,
  loadFromS3,
  saveToS3,
  type ByteStream,
  type FileSystemRef,
  type FileSystemRefDir,
  type ListOptions,
  type LoadOptions,
  type LoadResult,
  type Ref,
  type RefDir,
  type SaveOptions,
} from '../_common'

export const refDirToRef = (ref: RefDir, filename: string): Ref => {
  switch (ref.type) {
    case 'fs':
      return { type: 'fs', path: resolve(ref.directory, filename) }
    case 's3':
      return { type: 's3', bucket: ref.bucket, key: filename }
  }
}

export async function loadFromFileSystem(
  ref: FileSystemRef,
  opts: LoadOptions,
): LoadResult {
  try {
    if (!existsSync(ref.path)) {
      return { success: false }
    }

    if (!opts.stream) {
      return { success: true, data: await readFile(ref.path) }
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

export async function saveToFileSystem(
  ref: FileSystemRef,
  content: ByteStream | string,
) {
  await mkdir(dirname(ref.path), { recursive: true })
  if (typeof content === 'string') {
    await writeFile(ref.path, content)
    return
  }

  await pipeline(Readable.fromWeb(content as any), createWriteStream(ref.path))
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

export async function listFilesInFileSystem(
  ref: FileSystemRefDir,
  options: ListOptions,
) {
  const files = await readdir(ref.directory, { withFileTypes: true })
  return files
    .filter(f => f.isFile() && f.name.startsWith(options.prefix))
    .map(f => f.name)
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

export const conditionalInMemoryDownload = async (
  s3: S3Client,
  ref: Ref,
  url: string,
) => {
  const result = await loadFile({ s3 }, ref, { stream: false })
  if (!result.success) {
    const resp = await fetch(url)

    if (!resp.body) {
      throw new Error(
        `Error fetching ${url} - ${resp.status}: ${resp.statusText}`,
      )
    }

    await saveFile({ s3 }, ref, resp.body, {})
    const secondResult = await loadFile({ s3 }, ref, { stream: false })
    if (!secondResult.success) {
      throw new Error(`Error loading ${url}`)
    }

    return secondResult.data
  }

  return result.data
}

export const conditionalStreamDownload = async (
  s3: S3Client,
  ref: Ref,
  url: string,
) => {
  const result = await loadFile({ s3 }, ref, { stream: true })
  if (!result.success) {
    const resp = await fetch(url)

    if (!resp.body) {
      throw new Error(
        `Error fetching ${url} - ${resp.status}: ${resp.statusText}`,
      )
    }

    await saveFile({ s3 }, ref, resp.body, {
      contentType: 'application/zip',
      contentLength: Number(resp.headers.get('content-length') ?? '0'),
    })
  }
}
