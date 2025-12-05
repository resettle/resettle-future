import type {
  TagMetadata,
  TagNamespace,
  TagTemplate,
} from '@resettle/schema/intelligence'
import { assert, type Equals } from '@resettle/utils'
import type {
  Generated,
  GeneratedAlways,
  JSONColumnType,
  Selectable,
} from 'kysely'

export interface TagTemplateTable {
  id: GeneratedAlways<string>
  slug: string
  name: string
  namespace: TagNamespace
  embedding: JSONColumnType<number[]>
  metadata: JSONColumnType<TagMetadata>
  created_at: Generated<Date>
  deprecated_at: Date | null
}

assert<Equals<TagTemplate, Selectable<TagTemplateTable>>>
