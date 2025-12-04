import type { GlobalDatabase } from '@resettle/database/global'
import type { SkillTag } from '@resettle/schema/global'
import {
  FileMigrationProvider,
  Kysely,
  Migrator,
  PostgresDialect,
} from 'kysely'
import assert from 'node:assert'
import { promises as fs } from 'node:fs'
import * as path from 'node:path'
import { cwd } from 'node:process'
import { after, before, describe, it } from 'node:test'
import { Pool } from 'pg'
import { toSql } from 'pgvector/kysely'

import { createUUIDSetHash } from '@resettle/utils'
import { calculateRawScores, skillCollectionDistance } from './score'

const SCHEMA_NAME = 'score'

const getEmbedding = (text: string, dim = 1536) => {
  let seed = 0
  for (let i = 0; i < text.length; i++) {
    seed = (seed * 31 + text.charCodeAt(i)) >>> 0
  }

  const rng = () => {
    seed = (seed * 1664525 + 1013904223) >>> 0
    return (seed & 0xffff) / 0xffff
  }

  const raw = Array.from({ length: dim }, () => rng() * 2 - 1)
  const norm = Math.hypot(...raw)
  return raw.map(v => v / norm)
}

const createSkillTag = (
  name: string,
  category: string,
  subCategory: string,
): SkillTag => ({
  id: name,
  slug: name,
  name,
  external_id: name,
  namespace: 'skill',
  category,
  sub_category: subCategory,
  embedding: getEmbedding(name),
})

const getRandomSets = (
  texts: string[],
  items: number,
  maxSize: number,
  minSize = 1,
): Set<string>[] => {
  const generated = new Set<string>()
  const results: Set<string>[] = []

  const randomSubset = (): Set<string> => {
    const size = minSize + Math.floor(Math.random() * (maxSize - minSize + 1))

    const chosen = new Set<number>()
    while (chosen.size < size) {
      const idx = Math.floor(Math.random() * texts.length)
      chosen.add(idx)
    }

    const subset = new Set<string>()
    for (const idx of chosen) subset.add(texts[idx])
    return subset
  }

  for (let i = 0; i < items; i++) {
    let subset: Set<string>
    let key: string

    do {
      subset = randomSubset()
      key = [...subset].sort().join('||')
    } while (generated.has(key))

    generated.add(key)
    results.push(subset)
  }

  return results
}

export const prepareForRawScores = async (
  db: Kysely<GlobalDatabase>,
  templateCount: number,
  itemProfileCount: number,
  userProfileCount: number,
) => {
  assert.ok(templateCount > 0)
  assert.ok(itemProfileCount > 0)
  assert.ok(userProfileCount > 0)
  const tagTemplates = await db
    .insertInto('tag_template')
    .values(
      Array(templateCount)
        .fill(null)
        .map((_, i) => createSkillTag(`tag${i}`, 'category', 'sub'))
        .map(t => ({
          slug: t.name,
          name: t.name,
          namespace: 'skill',
          embedding: toSql(getEmbedding(t.name)),
          metadata: JSON.stringify({
            category: 'category',
            sub_category: 'sub_category',
            external_id: name,
          }),
        })),
    )
    .returningAll()
    .execute()

  const sets = getRandomSets(
    tagTemplates.map(t => t.id),
    itemProfileCount + userProfileCount,
    10,
  )
  const hashes: string[] = []
  for (const set of sets) {
    hashes.push(await createUUIDSetHash([...set]))
  }
  const tagProfiles = await db
    .insertInto('tag_profile')
    .values(hashes.map(h => ({ hash: h })))
    .returningAll()
    .execute()
  const references: [string, string][] = []
  for (let i = 0; i < tagProfiles.length; i++) {
    const set = sets[i]
    for (const tag of set) {
      references.push([tagProfiles[i].id, tag])
    }
  }
  await db
    .insertInto('profile_tag')
    .values(
      references.map(r => ({
        tag_profile_id: r[0],
        tag_template_id: r[1],
        data: JSON.stringify({}),
      })),
    )
    .execute()
  const itemTagProfiles = tagProfiles.slice(0, itemProfileCount)
  await db
    .insertInto('opportunity')
    .values(
      itemTagProfiles.map(p => ({
        tag_profile_id: p.id,
        type: 'job',
      })),
    )
    .execute()
}

describe('score', () => {
  let db: Kysely<GlobalDatabase>

  before(async () => {
    db = new Kysely<GlobalDatabase>({
      dialect: new PostgresDialect({
        pool: new Pool({
          connectionString: process.env.POSTGRES_CONNECTION_STRING_TEST,
        }),
      }),
    })
    await db.schema.dropSchema(SCHEMA_NAME).ifExists().cascade().execute()
    await db.schema.createSchema(SCHEMA_NAME).ifNotExists().execute()
    db = db.withSchema(SCHEMA_NAME)
    const migrator = new Migrator({
      db,
      provider: new FileMigrationProvider({
        fs,
        path,
        migrationFolder: path.join(cwd(), '../database/src/global/migrations'),
      }),
      migrationTableSchema: SCHEMA_NAME,
    })
    const { error } = await migrator.migrateToLatest()

    if (error) {
      console.error('failed to migrate')
      console.error(error)
      process.exit(1)
    }
  })

  after(async () => {
    await db.schema.dropSchema(SCHEMA_NAME).ifExists().cascade().execute()
    await db.destroy()
  })

  it('calculates distance throws', () => {
    assert.throws(() => skillCollectionDistance([], []), {
      name: 'Error',
      message: 'Both arrays must have at least one element',
    })
  })

  it('calculates distance between single tags', () => {
    const distance1 = skillCollectionDistance(
      [createSkillTag('tag1', 'category', 'sub')],
      [createSkillTag('tag1', 'category', 'sub')],
    )
    assert.equal(distance1, 0)

    const distance2 = skillCollectionDistance(
      [createSkillTag('tag1', 'category', 'sub')],
      [createSkillTag('tag2', 'category', 'sub')],
    )
    assert.ok(distance2 <= 1)
    assert.ok(distance2 >= 0)

    const distance3 = skillCollectionDistance(
      [createSkillTag('tag1', 'category', 'sub1')],
      [createSkillTag('tag2', 'category', 'sub2')],
    )
    assert.ok(distance3 <= 2)
    assert.ok(distance3 >= 1)

    const distance4 = skillCollectionDistance(
      [createSkillTag('tag1', 'category1', 'sub1')],
      [createSkillTag('tag2', 'category2', 'sub2')],
    )
    assert.ok(distance4 <= 3)
    assert.ok(distance4 >= 2)
  })

  it('distance between skill collections is symmetric', () => {
    const collection1 = [
      createSkillTag('tag1', 'category', 'sub'),
      createSkillTag('tag2', 'category', 'sub'),
    ]
    const collection2 = [
      createSkillTag('tag1', 'category', 'sub'),
      createSkillTag('tag3', 'category', 'sub2'),
    ]
    const distance1 = skillCollectionDistance(collection1, collection2)
    const distance2 = skillCollectionDistance(collection2, collection1)
    assert.equal(distance1, distance2)

    const collection3 = [
      createSkillTag('tag1', 'category', 'sub'),
      createSkillTag('tag2', 'category', 'sub'),
      createSkillTag('tag4', 'category', 'sub2'),
      createSkillTag('tag5', 'category2', 'sub2'),
    ]
    const collection4 = [
      createSkillTag('tag1', 'category', 'sub'),
      createSkillTag('tag3', 'category', 'sub2'),
    ]
    const distance3 = skillCollectionDistance(collection3, collection4)
    const distance4 = skillCollectionDistance(collection4, collection3)
    assert.equal(distance3, distance4)

    const collection5 = [
      createSkillTag('tag2', 'category', 'sub'),
      createSkillTag('tag4', 'category2', 'sub2'),
    ]
    const collection6 = [
      createSkillTag('tag1', 'category', 'sub'),
      createSkillTag('tag3', 'category', 'sub2'),
    ]
    const distance5 = skillCollectionDistance(collection5, collection6)
    const distance6 = skillCollectionDistance(collection6, collection5)
    assert.equal(distance5, distance6)
  })

  it('calculates distance between multi tags', () => {
    const distance1 = skillCollectionDistance(
      [
        createSkillTag('tag1', 'category', 'sub'),
        createSkillTag('tag2', 'category', 'sub'),
      ],
      [createSkillTag('tag1', 'category', 'sub')],
    )
    assert.equal(distance1, 0)

    const distance2 = skillCollectionDistance(
      [
        createSkillTag('tag1', 'category', 'sub'),
        createSkillTag('tag2', 'category', 'sub'),
      ],
      [
        createSkillTag('tag1', 'category', 'sub'),
        createSkillTag('tag3', 'category', 'sub'),
      ],
    )
    assert.ok(distance2 <= 1)
    assert.ok(distance2 >= 0)

    const distance3 = skillCollectionDistance(
      [
        createSkillTag('tag1', 'category', 'sub'),
        createSkillTag('tag2', 'category', 'sub'),
      ],
      [
        createSkillTag('tag1', 'category', 'sub'),
        createSkillTag('tag3', 'category', 'sub2'),
      ],
    )
    assert.ok(distance3 <= 2)
    assert.ok(distance3 >= 1)
  })

  it('calculates scores when there is no tag profiles', async () => {
    await calculateRawScores(db)
    const scores = await db.selectFrom('raw_score').selectAll().execute()
    assert.equal(scores.length, 0)
  })
})
