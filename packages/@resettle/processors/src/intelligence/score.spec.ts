import type { IntelligenceDatabase } from '@resettle/database/intelligence'
import type { SkillTag } from '@resettle/schema/intelligence'
import { createUUIDSetHash } from '@resettle/utils'
import {
  FileMigrationProvider,
  Kysely,
  Migrator,
  PostgresDialect,
  sql,
} from 'kysely'
import assert from 'node:assert'
import { promises as fs } from 'node:fs'
import * as path from 'node:path'
import { cwd } from 'node:process'
import { after, before, beforeEach, describe, it } from 'node:test'
import { Pool } from 'pg'
import { toSql } from 'pgvector/kysely'

import {
  calculateModifiedScores,
  calculateRawScores,
  skillCollectionDistance,
} from './score'

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

const getRandomIndices = (length: number, amount: number) => {
  const results = new Set<number>()

  do {
    const candidate = Math.floor(Math.random() * length)
    if (!results.has(candidate)) {
      results.add(candidate)
    }
  } while (results.size < amount)
  return [...results]
}

const prepareForRawScores = async (
  db: Kysely<IntelligenceDatabase>,
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
            external_id: t.name,
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

  return tagTemplates
}

const prepareForModifiedScores = async (
  db: Kysely<IntelligenceDatabase>,
  rules: string[],
  templateCount: number,
  userCount: number,
  opportunityCount: number,
  labelCount: number,
) => {
  assert.ok(rules.length > 0)
  assert.ok(templateCount > 0)
  assert.ok(userCount > 0)
  assert.ok(opportunityCount > 0)
  assert.ok(labelCount > 0)
  const tenant = await db
    .insertInto('tenant')
    .values({ name: 'tenant', configuration: JSON.stringify({}) })
    .returningAll()
    .executeTakeFirstOrThrow()
  await db
    .insertInto('tenant_label_rule')
    .values(
      rules.map((r, i) => ({
        tenant_id: tenant.id,
        name: `rule${i}`,
        rule: r,
      })),
    )
    .execute()
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
            external_id: t.name,
          }),
        })),
    )
    .returningAll()
    .execute()

  const sets = getRandomSets(
    tagTemplates.map(t => t.id),
    userCount + opportunityCount,
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

  const userTagProfiles = tagProfiles.slice(0, userCount)
  const itemTagProfiles = tagProfiles.slice(userCount)
  const users = await db
    .insertInto('user')
    .values(
      userTagProfiles.map((p, i) => ({
        tenant_id: tenant.id,
        username: `user${i}`,
        tag_profile_id: p.id,
        metadata: JSON.stringify({}),
      })),
    )
    .returningAll()
    .execute()
  const opportunities = await db
    .insertInto('opportunity')
    .values(
      itemTagProfiles.map(p => ({
        tag_profile_id: p.id,
        type: 'job',
      })),
    )
    .returningAll()
    .execute()
  const pair = new Map<string, string>()
  for (const user of users) {
    for (const opportunity of opportunities) {
      pair.set(user.id, opportunity.id)
    }
  }
  const pairs = [...pair]
  for (let i = 0; i < labelCount; i++) {
    const indices = getRandomIndices(
      pairs.length,
      Math.min(1, Math.floor((Math.random() * pairs.length) / 2)),
    )
    await db
      .insertInto('label')
      .values(
        pairs
          .filter((_v, i) => indices.includes(i))
          .map(p => ({
            user_id: p[0],
            opportunity_id: p[1],
            name: `label${i}`,
            value: 1,
          })),
      )
      .execute()
  }

  return users
}

const cleanup = async (db: Kysely<IntelligenceDatabase>) => {
  await db.deleteFrom('modified_score').execute()
  await db.deleteFrom('raw_score').execute()
  await db.deleteFrom('label').execute()
  await db.deleteFrom('opportunity').execute()
  await db.deleteFrom('user').execute()
  await db.deleteFrom('profile_tag').execute()
  await db.deleteFrom('tag_profile').execute()
  await db.deleteFrom('tag_template').execute()
  await db.deleteFrom('tenant_label_rule').execute()
  await db.deleteFrom('tenant').execute()
}

describe('score', () => {
  let db: Kysely<IntelligenceDatabase>

  before(async () => {
    db = new Kysely<IntelligenceDatabase>({
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
        migrationFolder: path.join(
          cwd(),
          '../database/src/intelligence/migrations',
        ),
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

  beforeEach(async () => {
    await cleanup(db)
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

  it('calculates scores incrementally', async () => {
    await prepareForRawScores(db, 10, 1, 1)
    let tagProfiles = await db
      .selectFrom('tag_profile')
      .leftJoin('opportunity', 'opportunity.tag_profile_id', 'tag_profile.id')
      .select([
        'tag_profile.computed_at',
        'tag_profile.created_at',
        'tag_profile.id',
        'opportunity.id as opportunity_id',
      ])
      .execute()
    await calculateRawScores(db)
    let scores = await db.selectFrom('raw_score').selectAll().execute()
    assert.equal(scores.length, 2)
    const createdAt1 = scores[0].created_at
    // Similarity is always 1 when a profile compares to itself
    assert.equal(
      scores.filter(s => s.item_tag_profile_id === s.user_tag_profile_id)[0]
        .score,
      1,
    )
    await calculateRawScores(db)
    scores = await db.selectFrom('raw_score').selectAll().execute()
    const createdAt2 = scores[0].created_at
    assert.equal(scores.length, 2)
    assert.deepStrictEqual(createdAt1, createdAt2)
    tagProfiles = await db
      .selectFrom('tag_profile')
      .leftJoin('opportunity', 'opportunity.tag_profile_id', 'tag_profile.id')
      .select([
        'tag_profile.computed_at',
        'tag_profile.created_at',
        'tag_profile.id',
        'opportunity.id as opportunity_id',
      ])
      .execute()
    for (const tagProfile of tagProfiles) {
      assert.ok(tagProfile.computed_at)
      assert.ok(tagProfile.computed_at.getTime() > createdAt2.getTime())
    }
  })

  it('calculates scores incrementally, complex scenario', async () => {
    const tagTemplates = await prepareForRawScores(db, 10, 1, 1)
    await calculateRawScores(db)
    let scores = await db.selectFrom('raw_score').selectAll().execute()
    assert.equal(scores.length, 2)
    const tagProfiles = await db
      .selectFrom('tag_profile')
      .leftJoin('opportunity', 'opportunity.tag_profile_id', 'tag_profile.id')
      .select([
        'tag_profile.computed_at',
        'tag_profile.created_at',
        'tag_profile.id',
        'opportunity.id as opportunity_id',
      ])
      .execute()
    const userOnlyTagProfiles = tagProfiles.filter(p => !p.opportunity_id)
    const itemOnlyTagProfiles = tagProfiles.filter(p => p.opportunity_id)
    // Create a new opportunity with existing profile
    const opportunity = await db
      .insertInto('opportunity')
      .values({
        tag_profile_id: userOnlyTagProfiles[0].id,
        type: 'job',
      })
      .returningAll()
      .execute()
    await calculateRawScores(db)
    scores = await db.selectFrom('raw_score').selectAll().execute()
    assert.equal(scores.length, 4)
    // Create a new user-only tag profile
    const sets = getRandomSets(
      tagTemplates.map(t => t.id),
      1,
      10,
    )
    const hash = await createUUIDSetHash([...sets[0]])
    const newTagProfile = await db
      .insertInto('tag_profile')
      .values({ hash })
      .returningAll()
      .executeTakeFirstOrThrow()
    await db
      .insertInto('profile_tag')
      .values(
        [...sets[0]].map(i => ({
          tag_profile_id: newTagProfile.id,
          tag_template_id: i,
          data: JSON.stringify({}),
        })),
      )
      .execute()
    await calculateRawScores(db)
    scores = await db.selectFrom('raw_score').selectAll().execute()
    assert.equal(scores.length, 6)
    // Assign an opportunity to an item-only tag profile
    await db
      .updateTable('opportunity')
      .set('tag_profile_id', itemOnlyTagProfiles[0].id)
      .set('updated_at', sql`now()`)
      .where('id', '=', opportunity[0].id)
      .execute()
    await calculateRawScores(db)
    scores = await db.selectFrom('raw_score').selectAll().execute()
    assert.equal(scores.length, 6)
    // Assign an opportunity to an user-only tag profile
    await db
      .updateTable('opportunity')
      .set('tag_profile_id', newTagProfile.id)
      .set('updated_at', sql`now()`)
      .where('id', '=', opportunity[0].id)
      .execute()
    await calculateRawScores(db)
    scores = await db.selectFrom('raw_score').selectAll().execute()
    assert.equal(scores.length, 9)
  })

  it('calculates modified scores', async () => {
    const users = await prepareForModifiedScores(
      db,
      [`score * events['label0']`, `score * 2 * events['label0']`],
      10,
      1,
      1,
      1,
    )
    await calculateRawScores(db)
    const rawScores = await db.selectFrom('raw_score').selectAll().execute()
    assert.equal(rawScores.length, 2)
    await calculateModifiedScores(db)
    const modifiedScores = await db
      .selectFrom('modified_score')
      .selectAll()
      .execute()
    assert.equal(modifiedScores.length, 1)
    const rawScore = rawScores.find(
      s => s.user_tag_profile_id !== s.item_tag_profile_id,
    )!.score
    assert.equal(modifiedScores[0].score, rawScore * 3)
    const user = await db
      .selectFrom('user')
      .selectAll()
      .where('id', '=', users[0].id)
      .executeTakeFirstOrThrow()
    assert.deepStrictEqual(user.computed_at, modifiedScores[0].created_at)
    await calculateModifiedScores(db)
  })

  it('calculates modified scores, complex scenario', async () => {
    await prepareForModifiedScores(
      db,
      [`score * events['label0']`, `score * 2 * events['label0']`],
      10,
      2,
      2,
      1,
    )
    await calculateRawScores(db)
    const rawScores = await db.selectFrom('raw_score').selectAll().execute()
    assert.equal(rawScores.length, 8)
    await calculateModifiedScores(db)
    const modifiedScores = await db
      .selectFrom('modified_score')
      .selectAll()
      .execute()
    assert.equal(modifiedScores.length, 4)
  })
})
