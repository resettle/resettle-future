import type { GlobalDatabase } from '@resettle/database/global'
import type { SkillTag, SkillTagMetadata } from '@resettle/schema/global'
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

export const calculateJobScore = async (
  db: Kysely<GlobalDatabase>,
  userId: string,
  jobId: string,
) => {
  const userTags = await db
    .selectFrom('user_tag')
    .innerJoin('tag_template', 'user_tag.tag_template_id', 'tag_template.id')
    .select([
      'user_tag.data',
      'tag_template.embedding',
      'tag_template.id',
      'tag_template.name',
      'tag_template.namespace',
      'tag_template.slug',
      'tag_template.metadata',
    ])
    .where('user_tag.user_id', '=', userId)
    .where('tag_template.namespace', '=', 'skill')
    .where('tag_template.deprecated_at', 'is not', null)
    .execute()
  const jobTags = await db
    .selectFrom('job_tag')
    .innerJoin('tag_template', 'job_tag.tag_template_id', 'tag_template.id')
    .select([
      'job_tag.data',
      'tag_template.embedding',
      'tag_template.id',
      'tag_template.name',
      'tag_template.namespace',
      'tag_template.slug',
      'tag_template.metadata',
    ])
    .where('job_tag.canonical_job_id', '=', jobId)
    .where('tag_template.namespace', '=', 'skill')
    .where('tag_template.deprecated_at', 'is not', null)
    .execute()
  return skillCollectionDistance(
    userTags.map(t => ({
      id: t.id,
      slug: t.slug,
      name: t.name,
      namespace: 'skill',
      category: (t.metadata as SkillTagMetadata).category,
      sub_category: (t.metadata as SkillTagMetadata).sub_category,
      external_id: (t.metadata as SkillTagMetadata).external_id,
      embedding: t.embedding,
    })),
    jobTags.map(t => ({
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
