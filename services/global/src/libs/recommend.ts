import { type GlobalDatabase } from '@resettle/database/global'
import type {
  OpportunityType,
  SkillTag,
  SkillTagMetadata,
} from '@resettle/schema/global'
import { createUUIDSetHash } from '@resettle/utils'
import type { Kysely } from 'kysely'

const cosineSimilarity = (a: number[], b: number[]) => {
  if (a.length !== b.length) {
    throw new Error('Vectors must be of same length')
  }

  let dot = 0
  let normA = 0
  let normB = 0

  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i]
    normA += a[i] * a[i]
    normB += b[i] * b[i]
  }

  if (normA === 0 || normB === 0) {
    return 0
  }

  return dot / (Math.sqrt(normA) * Math.sqrt(normB))
}

// TODO: Differentiate by data.
// The range is [0, 3]
const skillDistance = (a: SkillTag, b: SkillTag) => {
  if (a.name === b.name) return 0
  const cosineDistance = 1 - cosineSimilarity(a.embedding, b.embedding)
  if (a.sub_category === b.sub_category) return cosineDistance
  if (a.category === b.category) return 1 + cosineDistance
  return 2 + cosineDistance
}

const skillCollectionDistance = (a: SkillTag[], b: SkillTag[]) => {
  const largerLength = Math.max(a.length, b.length)
  let small = a
  let large = b
  if (largerLength === a.length) {
    small = b
    large = a
  }

  const used = new Array(largerLength).fill(false)
  let total = 0

  for (const tag of small) {
    let best = Infinity
    let bestIdx = -1

    for (let j = 0; j < large.length; j++) {
      if (used[j]) continue
      const d = skillDistance(tag, large[j])
      if (d < best) {
        best = d
        bestIdx = j
      }
    }

    if (bestIdx === -1) break
    used[bestIdx] = true
    total += best
  }

  return total
}

export const calculateScore = async (
  db: Kysely<GlobalDatabase>,
  tagProfileId1: string,
  tagProfileId2: string,
) => {
  const tags1 = await db
    .selectFrom('profile_tag')
    .innerJoin('tag_template', 'profile_tag.tag_template_id', 'tag_template.id')
    .select([
      'profile_tag.data',
      'tag_template.embedding',
      'tag_template.id',
      'tag_template.name',
      'tag_template.namespace',
      'tag_template.slug',
      'tag_template.metadata',
    ])
    .where('profile_tag.tag_profile_id', '=', tagProfileId1)
    .where('tag_template.namespace', '=', 'skill')
    .where('tag_template.deprecated_at', 'is not', null)
    .execute()
  const tags2 = await db
    .selectFrom('profile_tag')
    .innerJoin('tag_template', 'profile_tag.tag_template_id', 'tag_template.id')
    .select([
      'profile_tag.data',
      'tag_template.embedding',
      'tag_template.id',
      'tag_template.name',
      'tag_template.namespace',
      'tag_template.slug',
      'tag_template.metadata',
    ])
    .where('profile_tag.tag_profile_id', '=', tagProfileId2)
    .where('tag_template.namespace', '=', 'skill')
    .where('tag_template.deprecated_at', 'is not', null)
    .execute()

  return skillCollectionDistance(
    tags1.map(t => ({
      id: t.id,
      slug: t.slug,
      name: t.name,
      namespace: 'skill',
      category: (t.metadata as SkillTagMetadata).category,
      sub_category: (t.metadata as SkillTagMetadata).sub_category,
      external_id: (t.metadata as SkillTagMetadata).external_id,
      embedding: t.embedding,
    })),
    tags2.map(t => ({
      id: t.id,
      slug: t.slug,
      name: t.name,
      namespace: 'skill',
      category: (t.metadata as SkillTagMetadata).category,
      sub_category: (t.metadata as SkillTagMetadata).sub_category,
      external_id: (t.metadata as SkillTagMetadata).external_id,
      embedding: t.embedding,
    })),
  )
}

// TODO: We might want to add a priority queue registering requested recommendation pairs.
// TODO: Make decay strategy configurable.
export const getRecommendationByTags = async (
  db: Kysely<GlobalDatabase>,
  tags: string[],
  types: OpportunityType[],
  limit: number,
) => {
  const hash = await createUUIDSetHash(tags)
  const tagProfile = await db
    .selectFrom('tag_profile')
    .selectAll()
    .where('hash', '=', hash)
    .executeTakeFirst()
  let tagProfileId = tagProfile?.id
  if (!tagProfile) {
    const { id } = await db
      .insertInto('tag_profile')
      .values({ hash })
      .returningAll()
      .executeTakeFirstOrThrow()
    await db
      .insertInto('profile_tag')
      .values(
        tags.map(t => ({
          tag_profile_id: id,
          tag_template_id: t,
          data: JSON.stringify({}),
        })),
      )
      .execute()
    tagProfileId = id
  }

  return []
}

export const getRecommendationByUser = async (
  db: Kysely<GlobalDatabase>,
  tenantId: string,
  userId: string,
  types: OpportunityType[],
  limit: number,
) => {
  return []
}
