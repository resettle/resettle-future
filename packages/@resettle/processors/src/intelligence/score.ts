import type { IntelligenceDatabase } from '@resettle/database/intelligence'
import type { SkillTag, SkillTagMetadata } from '@resettle/schema/intelligence'
import { cosineSimilarity } from '@resettle/utils'
import { isAfter } from 'date-fns'
import { type Kysely } from 'kysely'

// TODO: Differentiate by data.
// The range is [0, 3]
const skillDistance = (a: SkillTag, b: SkillTag) => {
  if (a.name === b.name) return 0
  const cosineDistance = 1 - cosineSimilarity(a.embedding, b.embedding)
  if (a.sub_category === b.sub_category) return cosineDistance
  if (a.category === b.category) return 1 + cosineDistance
  return 2 + cosineDistance
}

export const skillCollectionDistance = (a: SkillTag[], b: SkillTag[]) => {
  if (a.length === 0 || b.length === 0) {
    throw new Error('Both arrays must have at least one element')
  }

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

  return total / small.length
}

const distanceToScore = (distance: number) => (3 - distance) / 3

export const calculateRawScores = async (db: Kysely<IntelligenceDatabase>) => {
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

  const itemTagProfiles = tagProfiles.filter(p => p.opportunity_id)
  const pages = Math.ceil(itemTagProfiles.length / 1000)
  const userTagProfiles = tagProfiles.filter(p => !p.opportunity_id)
  for (const utp of userTagProfiles) {
    const now = new Date()
    await db.transaction().execute(async tx => {
      const tags1 = await tx
        .selectFrom('profile_tag')
        .innerJoin(
          'tag_template',
          'profile_tag.tag_template_id',
          'tag_template.id',
        )
        .select([
          'profile_tag.data',
          'tag_template.embedding',
          'tag_template.id',
          'tag_template.name',
          'tag_template.namespace',
          'tag_template.slug',
          'tag_template.metadata',
        ])
        .where('profile_tag.tag_profile_id', '=', utp.id)
        .where('tag_template.namespace', '=', 'skill')
        .where('tag_template.deprecated_at', 'is not', null)
        .execute()

      for (let i = 0; i < pages; i++) {
        const page = itemTagProfiles.slice(i * 1000, (i + 1) * 1000)
        const toCompute = page.filter(itp =>
          utp.computed_at === null
            ? true
            : isAfter(itp.created_at, utp.computed_at),
        )
        if (toCompute.length > 0) {
          const tags2 = await tx
            .selectFrom('profile_tag')
            .innerJoin(
              'tag_template',
              'profile_tag.tag_template_id',
              'tag_template.id',
            )
            .select([
              'profile_tag.tag_profile_id',
              'profile_tag.data',
              'tag_template.embedding',
              'tag_template.id',
              'tag_template.name',
              'tag_template.namespace',
              'tag_template.slug',
              'tag_template.metadata',
            ])
            .where(
              'profile_tag.tag_profile_id',
              'in',
              toCompute.map(itp => itp.id),
            )
            .where('tag_template.namespace', '=', 'skill')
            .where('tag_template.deprecated_at', 'is not', null)
            .execute()
          const computed = toCompute.map(itp => ({
            user_tag_profile_id: utp.id,
            item_tag_profile_id: itp.id,
            method: 'similarity',
            created_at: now,
            score: distanceToScore(
              skillCollectionDistance(
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
                tags2
                  .filter(t => t.tag_profile_id === itp.id)
                  .map(t => ({
                    id: t.id,
                    slug: t.slug,
                    name: t.name,
                    namespace: 'skill',
                    category: (t.metadata as SkillTagMetadata).category,
                    sub_category: (t.metadata as SkillTagMetadata).sub_category,
                    external_id: (t.metadata as SkillTagMetadata).external_id,
                    embedding: t.embedding,
                  })),
              ),
            ),
          }))

          await tx.insertInto('raw_score').values(computed).execute()
        }
      }

      await tx
        .updateTable('tag_profile')
        .set('computed_at', now)
        .where('id', '=', utp.id)
        .execute()
    })
  }
}

export const calculateModifiedScores = async (db: Kysely<IntelligenceDatabase>) => {
  // Before executing this, we assume all raw scores are calculated.
  const tenantLabelRules = await db
    .selectFrom('tenant')
    .innerJoin('tenant_label_rule', 'tenant.id', 'tenant_label_rule.tenant_id')
    .select(['tenant.id', 'tenant_label_rule.name', 'tenant_label_rule.rule'])
    .where('tenant_label_rule.deprecated_at', 'is', null)
    .execute()
  const tenantLabelRuleMap = new Map<
    string,
    ((rawScore: number, events: Record<string, number>) => number)[]
  >()
  for (const rule of tenantLabelRules) {
    if (!tenantLabelRuleMap.has(rule.id)) {
      tenantLabelRuleMap.set(rule.id, [])
    }

    tenantLabelRuleMap
      .get(rule.id)!
      .push(
        new Function('rawScore', 'events', `return ${rule.rule}`) as (
          rawScore: number,
          events: Record<string, number>,
        ) => number,
      )
  }

  const opportunities = await db
    .selectFrom('opportunity')
    .select(['id', 'opportunity.tag_profile_id'])
    .execute()

  for (const [tenantId, rules] of tenantLabelRuleMap) {
    const users = await db
      .selectFrom('user')
      .select(['id', 'computed_at', 'tag_profile_id'])
      .where('tenant_id', '=', tenantId)
      .where('deleted_at', 'is', null)
      .execute()
    for (const user of users) {
      const now = new Date()
      await db.transaction().execute(async tx => {
        const labels = await tx
          .selectFrom('label')
          .select([
            'label.updated_at',
            'label.name',
            'label.value',
            'label.opportunity_id',
          ])
          .where('user_id', '=', user.id)
          .execute()
        const labelsByOpportunity = new Map<
          string,
          { labels: Record<string, number>; lastUpdatedAt: number }
        >()
        for (const label of labels) {
          if (!labelsByOpportunity.has(label.opportunity_id)) {
            labelsByOpportunity.set(label.opportunity_id, {
              labels: {},
              lastUpdatedAt: 0,
            })
          }

          labelsByOpportunity.get(label.opportunity_id)!.labels[label.name] =
            label.value
          labelsByOpportunity.get(label.opportunity_id)!.lastUpdatedAt =
            Math.max(
              labelsByOpportunity.get(label.opportunity_id)!.lastUpdatedAt,
              label.updated_at.getTime(),
            )
        }

        for (const [opportunityId, labels] of labelsByOpportunity) {
          if (
            user.computed_at &&
            labels.lastUpdatedAt < user.computed_at.getTime()
          ) {
            continue
          }

          const rawScore = await tx
            .selectFrom('raw_score')
            .select('score')
            .where('user_tag_profile_id', '=', user.tag_profile_id!)
            .where(
              'item_tag_profile_id',
              '=',
              opportunities.find(o => o.id === opportunityId)!.tag_profile_id!,
            )
            .executeTakeFirst()

          if (rawScore === undefined) {
            console.log(
              `Skipping combo user_id:${user.id}-item_id:${opportunityId}, missing raw score`,
            )
            continue
          }

          const modifiedScore = rules
            .map(r => r(rawScore.score, labels.labels))
            .reduce((p, c) => p + c, 0)
          await tx
            .insertInto('modified_score')
            .values({
              user_id: user.id,
              opportunity_id: opportunityId,
              score: modifiedScore,
            })
            .onConflict(oc =>
              oc.columns(['user_id', 'opportunity_id']).doUpdateSet(eb => ({
                score: eb.ref('excluded.score'),
                updated_at: now,
              })),
            )
            .execute()
        }

        await tx.updateTable('user').set('computed_at', now).execute()
      })
    }
  }
}
