import { AwsClient } from 'aws4fetch'
import { XMLParser } from 'fast-xml-parser'

export class NotFound extends Error {
  constructor(message = 'NotFound') {
    super(message)
    this.name = 'NotFound'
  }
}

export class NoSuchKey extends Error {
  constructor(message = 'NoSuchKey') {
    super(message)
    this.name = 'NoSuchKey'
  }
}

export type GetObjectCommandInput = { Bucket: string; Key: string }
export type HeadObjectCommandInput = { Bucket: string; Key: string }
export type DeleteObjectCommandInput = { Bucket: string; Key: string }
export type PutObjectCommandInput = {
  Bucket: string
  Key: string
  Body: Blob | ArrayBuffer | Buffer<ArrayBufferLike> | string
  ContentType?: string
}
export type CopyObjectCommandInput = {
  Bucket: string
  Key: string
  CopySource: string
}
export type DeleteObjectsCommandInput = {
  Bucket: string
  Delete: {
    Objects: { Key: string }[]
  }
}
export type HeadBucketCommandInput = { Bucket: string }

export type ListObjectsV2CommandInput = {
  Bucket: string
  Prefix?: string
  ContinuationToken?: string
  MaxKeys?: number
}

export type ObjectListItem = { Key?: string }
export type ListObjectsV2Output = {
  Contents?: ObjectListItem[]
  NextContinuationToken?: string
}

export type GetObjectOutput = {
  Body: S3Body
  ContentLength?: number
  ContentType?: string
  ETag?: string
}

export type HeadObjectOutput = {
  ContentLength?: number
  ContentType?: string
  ETag?: string
}

export class S3Body {
  private readonly response: Response

  constructor(response: Response) {
    this.response = response
  }

  transformToWebStream(): ReadableStream<Uint8Array> {
    // Response.body is a ReadableStream<Uint8Array>
    if (!this.response.body) {
      // Create an empty stream
      return new ReadableStream<Uint8Array>({
        start(controller) {
          controller.close()
        },
      })
    }
    return this.response.body as ReadableStream<Uint8Array>
  }

  async transformToByteArray(): Promise<Uint8Array> {
    const ab = await this.response.arrayBuffer()
    return new Uint8Array(ab)
  }

  async transformToString(): Promise<string> {
    return await this.response.text()
  }
}

export class GetObjectCommand {
  readonly input: GetObjectCommandInput
  constructor(input: GetObjectCommandInput) {
    this.input = input
  }
}

export class PutObjectCommand {
  readonly input: PutObjectCommandInput
  constructor(input: PutObjectCommandInput) {
    this.input = input
  }
}

export class DeleteObjectCommand {
  readonly input: DeleteObjectCommandInput
  constructor(input: DeleteObjectCommandInput) {
    this.input = input
  }
}

export class HeadObjectCommand {
  readonly input: HeadObjectCommandInput
  constructor(input: HeadObjectCommandInput) {
    this.input = input
  }
}

export class HeadBucketCommand {
  readonly input: HeadBucketCommandInput
  constructor(input: HeadBucketCommandInput) {
    this.input = input
  }
}

export class CopyObjectCommand {
  readonly input: CopyObjectCommandInput
  constructor(input: CopyObjectCommandInput) {
    this.input = input
  }
}

export class DeleteObjectsCommand {
  readonly input: DeleteObjectsCommandInput
  constructor(input: DeleteObjectsCommandInput) {
    this.input = input
  }
}

export class ListObjectsV2Command {
  readonly input: ListObjectsV2CommandInput
  constructor(input: ListObjectsV2CommandInput) {
    this.input = input
  }
}

export class S3Client {
  private readonly options: {
    endpoint: string
    accessKeyId: string
    secretAccessKey: string
  }

  private readonly client: AwsClient
  private readonly xml: XMLParser

  constructor(options: {
    endpoint: string
    accessKeyId: string
    secretAccessKey: string
  }) {
    this.options = options
    this.client = new AwsClient({
      service: 's3',
      region: 'auto',
      accessKeyId: options.accessKeyId,
      secretAccessKey: options.secretAccessKey,
    })
    this.xml = new XMLParser({
      ignoreAttributes: false,
      attributeNamePrefix: '',
    })
  }

  send(command: GetObjectCommand): Promise<GetObjectOutput>
  send(command: PutObjectCommand): Promise<{}>
  send(command: DeleteObjectCommand): Promise<{}>
  send(command: DeleteObjectsCommand): Promise<{}>
  send(command: HeadObjectCommand): Promise<HeadObjectOutput>
  send(command: HeadBucketCommand): Promise<{}>
  send(command: CopyObjectCommand): Promise<{}>
  send(command: ListObjectsV2Command): Promise<ListObjectsV2Output>
  async send(
    command:
      | GetObjectCommand
      | PutObjectCommand
      | DeleteObjectCommand
      | DeleteObjectsCommand
      | HeadObjectCommand
      | HeadBucketCommand
      | CopyObjectCommand
      | ListObjectsV2Command,
  ): Promise<GetObjectOutput | {} | HeadObjectOutput | ListObjectsV2Output> {
    if (command instanceof GetObjectCommand) {
      const { Bucket, Key } = command.input
      const res = await this.client.fetch(
        `${this.options.endpoint}/${Bucket}/${Key}`,
        { method: 'GET' },
      )
      if (res.status === 404) throw new NoSuchKey()
      if (!res.ok) throw new Error('Failed to get object')
      return {
        Body: new S3Body(res),
        ContentLength:
          Number(res.headers.get('content-length') ?? '0') || undefined,
        ContentType: res.headers.get('content-type') ?? undefined,
        ETag: res.headers.get('etag') ?? undefined,
      }
    }

    if (command instanceof PutObjectCommand) {
      const { Bucket, Key, Body, ContentType } = command.input
      const res = await this.client.fetch(
        `${this.options.endpoint}/${Bucket}/${Key}`,
        {
          method: 'PUT',
          body: Body as ArrayBuffer,
          headers: {
            ...(ContentType ? { 'Content-Type': ContentType } : {}),
          },
        },
      )
      if (!res.ok) throw new Error('Failed to put object')
      return {}
    }

    if (command instanceof DeleteObjectCommand) {
      const { Bucket, Key } = command.input
      const res = await this.client.fetch(
        `${this.options.endpoint}/${Bucket}/${Key}`,
        { method: 'DELETE' },
      )
      if (!res.ok) throw new Error('Failed to delete object')
      return {}
    }

    if (command instanceof DeleteObjectsCommand) {
      const { Bucket, Delete } = command.input
      const xmlBody = `<?xml version="1.0" encoding="UTF-8"?>
<Delete>
${Delete.Objects.map(obj => `  <Object><Key>${obj.Key}</Key></Object>`).join('\n')}
</Delete>`
      const res = await this.client.fetch(
        `${this.options.endpoint}/${Bucket}?delete`,
        {
          method: 'POST',
          body: xmlBody,
          headers: {
            'Content-Type': 'application/xml',
          },
        },
      )
      if (!res.ok) throw new Error('Failed to delete objects')
      return {}
    }

    if (command instanceof HeadObjectCommand) {
      const { Bucket, Key } = command.input
      const res = await this.client.fetch(
        `${this.options.endpoint}/${Bucket}/${Key}`,
        { method: 'HEAD' },
      )
      if (res.status === 404) throw new NotFound()
      if (!res.ok) throw new Error('Failed to head object')
      return {
        ContentLength:
          Number(res.headers.get('content-length') ?? '0') || undefined,
        ContentType: res.headers.get('content-type') ?? undefined,
        ETag: res.headers.get('etag') ?? undefined,
      }
    }

    if (command instanceof HeadBucketCommand) {
      const { Bucket } = command.input
      const res = await this.client.fetch(
        `${this.options.endpoint}/${Bucket}`,
        { method: 'HEAD' },
      )
      if (!res.ok) throw new Error('Failed to head bucket')
      return {}
    }

    if (command instanceof CopyObjectCommand) {
      const { Bucket, Key, CopySource } = command.input
      const res = await this.client.fetch(
        `${this.options.endpoint}/${Bucket}/${Key}`,
        {
          method: 'PUT',
          headers: { 'x-amz-copy-source': CopySource },
        },
      )
      if (!res.ok) throw new Error('Failed to copy object')
      return {}
    }

    if (command instanceof ListObjectsV2Command) {
      const { Bucket, Prefix, ContinuationToken, MaxKeys } = command.input
      const params = new URLSearchParams({ 'list-type': '2' })
      if (Prefix) params.set('prefix', Prefix)
      if (ContinuationToken) params.set('continuation-token', ContinuationToken)
      if (MaxKeys !== undefined) params.set('max-keys', String(MaxKeys))
      const res = await this.client.fetch(
        `${this.options.endpoint}/${Bucket}?${params.toString()}`,
        { method: 'GET' },
      )
      if (!res.ok) throw new Error('Failed to list objects')
      const xmlText = await res.text()
      const parsed = this.xml.parse(xmlText)
      const root = parsed?.ListBucketResult ?? {}
      let contents: ObjectListItem[] = []
      const rawContents = root.Contents
      if (Array.isArray(rawContents)) {
        contents = rawContents.map(c => ({ Key: c.Key }))
      } else if (rawContents) {
        contents = [{ Key: rawContents.Key }]
      }
      const out: ListObjectsV2Output = {
        Contents: contents,
        NextContinuationToken: root.NextContinuationToken ?? undefined,
      }
      return out
    }

    throw new Error('Unsupported command')
  }
}
