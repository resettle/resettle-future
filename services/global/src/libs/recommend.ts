import { type GlobalDatabase } from '@resettle/database/global'
import type {
  OpportunityResponse,
  OpportunityType,
  RecommendationSources,
} from '@resettle/schema/global'
import { createUUIDSetHash } from '@resettle/utils'
import { differenceInDays } from 'date-fns'
import type { Kysely } from 'kysely'

const getOpportunities = async (
  db: Kysely<GlobalDatabase>,
  opportunitiesByType: Map<OpportunityType, { id: string; index: number }[]>,
): Promise<OpportunityResponse[]> => {
  const results: OpportunityResponse[] = []
  for (const [type, opportunities] of opportunitiesByType) {
    switch (type) {
      case 'job':
        const jobs = await db
          .selectFrom('canonical_job')
          .innerJoin(
            'canonical_organization',
            'canonical_job.canonical_organization_id',
            'canonical_organization.id',
          )
          .select([
            'canonical_job.id',
            'canonical_job.created_at',
            'canonical_job.description',
            'canonical_job.posted_at',
            'canonical_job.title',
            'canonical_job.updated_at',
            'canonical_job.url',
            'canonical_organization.country_code as organization_country_code',
            'canonical_organization.domain as organization_domain',
            'canonical_organization.name as organization_name',
            'canonical_organization.type as organization_type',
          ])
          .where(
            'id',
            'in',
            opportunities.map(o => o.id),
          )
          .execute()
        for (const job of jobs) {
          results[opportunities.find(o => o.id === job.id)!.index] = {
            ...job,
            type: 'job',
          }
        }
    }
  }

  return results
}

const getLatestRecommendation = async (
  db: Kysely<GlobalDatabase>,
  types: OpportunityType[],
  limit: number,
): Promise<OpportunityResponse[]> => {
  const opportunities = await db
    .selectFrom('opportunity')
    .selectAll()
    .$if(types.length > 0, qb =>
      qb.where(eb => eb.or(types.map(t => eb('type', '=', t)))),
    )
    .orderBy('updated_at', 'desc')
    .limit(limit)
    .execute()

  const opportunitiesByType = new Map<
    OpportunityType,
    { id: string; index: number }[]
  >()
  for (let i = 0; i < opportunities.length; i++) {
    const opportunity = opportunities[i]
    if (!opportunitiesByType.has(opportunity.type)) {
      opportunitiesByType.set(opportunity.type, [])
    }

    opportunitiesByType.set(opportunity.type, [
      ...opportunitiesByType.get(opportunity.type)!,
      { id: opportunity.id, index: i },
    ])
  }

  return await getOpportunities(db, opportunitiesByType)
}

const getSimilarityRecommendationByTags = async (
  db: Kysely<GlobalDatabase>,
  tagProfileId: string,
  types: OpportunityType[],
  limit: number,
): Promise<OpportunityResponse[]> => {
  const opportunities = await db
    .selectFrom('raw_score')
    .innerJoin('tag_profile', 'raw_score.item_tag_profile_id', 'tag_profile.id')
    .innerJoin('opportunity', 'opportunity.tag_profile_id', 'tag_profile.id')
    .selectAll('opportunity')
    .where('user_tag_profile_id', '=', tagProfileId)
    .$if(types.length > 0, qb =>
      qb.where(eb => eb.or(types.map(t => eb('opportunity.type', '=', t)))),
    )
    .orderBy('score', 'desc')
    .limit(limit)
    .execute()

  const opportunitiesByType = new Map<
    OpportunityType,
    { id: string; index: number }[]
  >()
  for (let i = 0; i < opportunities.length; i++) {
    const opportunity = opportunities[i]
    if (!opportunitiesByType.has(opportunity.type)) {
      opportunitiesByType.set(opportunity.type, [])
    }

    opportunitiesByType.set(opportunity.type, [
      ...opportunitiesByType.get(opportunity.type)!,
      { id: opportunity.id, index: i },
    ])
  }

  return await getOpportunities(db, opportunitiesByType)
}

const getSimilarityRecommendationByUser = async (
  db: Kysely<GlobalDatabase>,
  userId: string,
  types: OpportunityType[],
  limit: number,
): Promise<OpportunityResponse[]> => {
  const opportunities = await db
    .selectFrom('modified_score')
    .innerJoin('user', 'modified_score.user_id', 'user.id')
    .innerJoin('opportunity', 'opportunity.id', 'modified_score.opportunity_id')
    .selectAll('opportunity')
    .where('user.id', '=', userId)
    .$if(types.length > 0, qb =>
      qb.where(eb => eb.or(types.map(t => eb('opportunity.type', '=', t)))),
    )
    .orderBy('score', 'desc')
    .limit(limit)
    .execute()

  const opportunitiesByType = new Map<
    OpportunityType,
    { id: string; index: number }[]
  >()
  for (let i = 0; i < opportunities.length; i++) {
    const opportunity = opportunities[i]
    if (!opportunitiesByType.has(opportunity.type)) {
      opportunitiesByType.set(opportunity.type, [])
    }

    opportunitiesByType.set(opportunity.type, [
      ...opportunitiesByType.get(opportunity.type)!,
      { id: opportunity.id, index: i },
    ])
  }

  return await getOpportunities(db, opportunitiesByType)
}

// TODO: We might want to add a priority queue registering requested recommendation pairs.
export const getRecommendationByTags = async (
  db: Kysely<GlobalDatabase>,
  tenantId: string,
  tags: string[],
  types: OpportunityType[],
  limit: number,
): Promise<{
  opportunities: OpportunityResponse[]
  sources: RecommendationSources
}> => {
  const hash = await createUUIDSetHash(tags)
  let tagProfile = await db
    .selectFrom('tag_profile')
    .selectAll()
    .where('hash', '=', hash)
    .executeTakeFirst()
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

    return {
      opportunities: await getLatestRecommendation(db, types, limit),
      sources: { latest: 100 },
    }
  }

  if (!tagProfile.computed_at) {
    return {
      opportunities: await getLatestRecommendation(db, types, limit),
      sources: { latest: 100 },
    }
  }

  const latest = await db
    .selectFrom('tag_profile')
    .innerJoin('opportunity', 'opportunity.tag_profile_id', 'tag_profile.id')
    .selectAll('tag_profile')
    .where('created_at', '>', tagProfile.computed_at)
    .orderBy('created_at', 'desc')
    .limit(1)
    .execute()

  // If there's new item tag profiles created AFTER the latest compute time of the target tag profile, we apply decay algorithm.
  if (latest.length > 0) {
    const tenant = await db
      .selectFrom('tenant')
      .selectAll()
      .where('id', '=', tenantId)
      .executeTakeFirstOrThrow()
    const days = differenceInDays(latest[0].created_at, tagProfile.computed_at)
    if (
      tenant.configuration.tag_profile_score_validity_decay_start ===
        undefined ||
      tenant.configuration.tag_profile_score_validity_decay_end === undefined
    ) {
      return {
        opportunities: await getSimilarityRecommendationByTags(
          db,
          tagProfile.id,
          types,
          limit,
        ),
        sources: { raw_similarity: 100 },
      }
    }

    // Example: if decay_start == 3 and decay_end == 5, when days == 2, strategy is similarity 100%, when days == 3, strategy is similarity 67% + latest 33%
    // Calculation: latest <- max(0, min(1, (days - decay_start + 1) / (decay_end - decay_start + 1)))
    const latestRatio = Math.max(
      Math.min(
        (days -
          tenant.configuration.tag_profile_score_validity_decay_start +
          1) /
          (tenant.configuration.tag_profile_score_validity_decay_end -
            tenant.configuration.tag_profile_score_validity_decay_start +
            1),
        1,
      ),
      0,
    )

    if (latestRatio === 0) {
      return {
        opportunities: await getSimilarityRecommendationByTags(
          db,
          tagProfile.id,
          types,
          limit,
        ),
        sources: { raw_similarity: 100 },
      }
    }

    if (latestRatio === 1) {
      return {
        opportunities: await getLatestRecommendation(db, types, limit),
        sources: { latest: 100 },
      }
    }

    const latestLimit = Math.round(latestRatio * limit)
    const latestPercentage = Math.round(latestRatio * 100)

    return {
      opportunities: [
        ...(await getSimilarityRecommendationByTags(
          db,
          tagProfile.id,
          types,
          limit - latestLimit,
        )),
        ...(await getLatestRecommendation(db, types, latestLimit)),
      ],
      sources: {
        raw_similarity: 100 - latestPercentage,
        latest: latestPercentage,
      },
    }
  }

  return {
    opportunities: await getSimilarityRecommendationByTags(
      db,
      tagProfile.id,
      types,
      limit,
    ),
    sources: { raw_similarity: 100 },
  }
}

export const getRecommendationByUser = async (
  db: Kysely<GlobalDatabase>,
  tenantId: string,
  userId: string,
  types: OpportunityType[],
  limit: number,
): Promise<{
  opportunities: OpportunityResponse[]
  sources: RecommendationSources
} | null> => {
  const user = await db
    .selectFrom('user')
    .selectAll()
    .where('tenant_id', '=', tenantId)
    .where('id', '=', userId)
    .executeTakeFirst()
  if (!user) {
    return null
  }

  // Three layers: if the modified scores are up to date, recommend by them, if not, fallback to raw scores, use latest if both are not up to date.
  if (!user.computed_at) {
    if (!user.tag_profile_id) {
      return {
        opportunities: await getLatestRecommendation(db, types, limit),
        sources: { latest: 100 },
      }
    }

    const tagProfile = await db
      .selectFrom('tag_profile')
      .selectAll()
      .where('id', '=', user.tag_profile_id)
      .executeTakeFirstOrThrow()

    if (!tagProfile.computed_at) {
      return {
        opportunities: await getLatestRecommendation(db, types, limit),
        sources: { latest: 100 },
      }
    }

    const latest = await db
      .selectFrom('tag_profile')
      .innerJoin('opportunity', 'opportunity.tag_profile_id', 'tag_profile.id')
      .selectAll('tag_profile')
      .where('created_at', '>', tagProfile.computed_at)
      .orderBy('created_at', 'desc')
      .limit(1)
      .execute()

    if (latest.length > 0) {
      const tenant = await db
        .selectFrom('tenant')
        .selectAll()
        .where('id', '=', tenantId)
        .executeTakeFirstOrThrow()
      const days = differenceInDays(
        latest[0].created_at,
        tagProfile.computed_at,
      )
      if (
        tenant.configuration.tag_profile_score_validity_decay_start ===
          undefined ||
        tenant.configuration.tag_profile_score_validity_decay_end === undefined
      ) {
        return {
          opportunities: await getSimilarityRecommendationByTags(
            db,
            tagProfile.id,
            types,
            limit,
          ),
          sources: { raw_similarity: 100 },
        }
      }

      const latestRatio = Math.max(
        Math.min(
          (days -
            tenant.configuration.tag_profile_score_validity_decay_start +
            1) /
            (tenant.configuration.tag_profile_score_validity_decay_end -
              tenant.configuration.tag_profile_score_validity_decay_start +
              1),
          1,
        ),
        0,
      )

      if (latestRatio === 0) {
        return {
          opportunities: await getSimilarityRecommendationByTags(
            db,
            tagProfile.id,
            types,
            limit,
          ),
          sources: { raw_similarity: 100 },
        }
      }

      if (latestRatio === 1) {
        return {
          opportunities: await getLatestRecommendation(db, types, limit),
          sources: { latest: 100 },
        }
      }

      const latestLimit = Math.round(latestRatio * limit)
      const latestPercentage = Math.round(latestRatio * 100)

      return {
        opportunities: [
          ...(await getSimilarityRecommendationByTags(
            db,
            tagProfile.id,
            types,
            limit - latestLimit,
          )),
          ...(await getLatestRecommendation(db, types, latestLimit)),
        ],
        sources: {
          raw_similarity: 100 - latestPercentage,
          latest: latestPercentage,
        },
      }
    }

    return {
      opportunities: await getSimilarityRecommendationByTags(
        db,
        tagProfile.id,
        types,
        limit,
      ),
      sources: { raw_similarity: 100 },
    }
  }

  const latestByUser = await db
    .selectFrom('tag_profile')
    .innerJoin('opportunity', 'opportunity.tag_profile_id', 'tag_profile.id')
    .selectAll('tag_profile')
    .where('created_at', '>', user.computed_at)
    .orderBy('created_at', 'desc')
    .limit(1)
    .execute()

  if (latestByUser.length > 0) {
    const tenant = await db
      .selectFrom('tenant')
      .selectAll()
      .where('id', '=', tenantId)
      .executeTakeFirstOrThrow()
    const days = differenceInDays(latestByUser[0].created_at, user.computed_at)
    if (
      tenant.configuration.user_score_validity_decay_start === undefined ||
      tenant.configuration.user_score_validity_decay_end === undefined
    ) {
      return {
        opportunities: await getSimilarityRecommendationByUser(
          db,
          userId,
          types,
          limit,
        ),
        sources: { label_similarity: 100 },
      }
    }

    const rawOrLatestRatio = Math.max(
      Math.min(
        (days - tenant.configuration.user_score_validity_decay_start + 1) /
          (tenant.configuration.user_score_validity_decay_end -
            tenant.configuration.user_score_validity_decay_start +
            1),
        1,
      ),
      0,
    )
    if (rawOrLatestRatio === 0) {
      return {
        opportunities: await getSimilarityRecommendationByUser(
          db,
          userId,
          types,
          limit,
        ),
        sources: { label_similarity: 100 },
      }
    }

    const rawOrLatestLimit = Math.round(rawOrLatestRatio * limit)
    const rawOrLatestPercentage = Math.round(rawOrLatestRatio * 100)

    if (
      tenant.configuration.tag_profile_score_validity_decay_start ===
        undefined ||
      tenant.configuration.tag_profile_score_validity_decay_end === undefined ||
      !user.tag_profile_id
    ) {
      if (rawOrLatestRatio === 1) {
        return {
          opportunities: await getLatestRecommendation(db, types, limit),
          sources: { latest: 100 },
        }
      }

      return {
        opportunities: [
          ...(await getSimilarityRecommendationByUser(
            db,
            userId,
            types,
            limit - rawOrLatestLimit,
          )),
          ...(await getLatestRecommendation(db, types, rawOrLatestLimit)),
        ],
        sources: {
          label_similarity: 100 - rawOrLatestPercentage,
          latest: rawOrLatestPercentage,
        },
      }
    }

    const tagProfile = await db
      .selectFrom('tag_profile')
      .selectAll()
      .where('id', '=', user.tag_profile_id)
      .executeTakeFirstOrThrow()

    if (!tagProfile.computed_at) {
      if (rawOrLatestRatio === 1) {
        return {
          opportunities: await getLatestRecommendation(db, types, limit),
          sources: { latest: 100 },
        }
      }

      return {
        opportunities: [
          ...(await getSimilarityRecommendationByUser(
            db,
            userId,
            types,
            limit - rawOrLatestLimit,
          )),
          ...(await getLatestRecommendation(db, types, rawOrLatestLimit)),
        ],
        sources: {
          label_similarity: 100 - rawOrLatestPercentage,
          latest: rawOrLatestPercentage,
        },
      }
    }

    const latestByTagProfile = await db
      .selectFrom('tag_profile')
      .innerJoin('opportunity', 'opportunity.tag_profile_id', 'tag_profile.id')
      .selectAll('tag_profile')
      .where('created_at', '>', tagProfile.computed_at)
      .orderBy('created_at', 'desc')
      .limit(1)
      .execute()

    if (latestByTagProfile.length > 0) {
      const days = differenceInDays(
        latestByTagProfile[0].created_at,
        tagProfile.computed_at,
      )

      const latestRatio = Math.max(
        Math.min(
          (days -
            tenant.configuration.tag_profile_score_validity_decay_start +
            1) /
            (tenant.configuration.tag_profile_score_validity_decay_end -
              tenant.configuration.tag_profile_score_validity_decay_start +
              1),
          1,
        ),
        0,
      )

      if (latestRatio === 0) {
        if (rawOrLatestRatio === 1) {
          return {
            opportunities: await getSimilarityRecommendationByTags(
              db,
              tagProfile.id,
              types,
              rawOrLatestLimit,
            ),
            sources: {
              raw_similarity: 100,
            },
          }
        }

        return {
          opportunities: [
            ...(await getSimilarityRecommendationByUser(
              db,
              userId,
              types,
              limit - rawOrLatestLimit,
            )),
            ...(await getSimilarityRecommendationByTags(
              db,
              tagProfile.id,
              types,
              rawOrLatestLimit,
            )),
          ],
          sources: {
            label_similarity: 100 - rawOrLatestPercentage,
            raw_similarity: rawOrLatestPercentage,
          },
        }
      }

      if (latestRatio === 1) {
        if (rawOrLatestRatio === 1) {
          return {
            opportunities: await getLatestRecommendation(db, types, limit),
            sources: { latest: 100 },
          }
        }

        return {
          opportunities: [
            ...(await getSimilarityRecommendationByUser(
              db,
              userId,
              types,
              limit - rawOrLatestLimit,
            )),
            ...(await getLatestRecommendation(db, types, rawOrLatestLimit)),
          ],
          sources: {
            label_similarity: 100 - rawOrLatestPercentage,
            latest: rawOrLatestPercentage,
          },
        }
      }

      const latestLimit = Math.round(latestRatio * rawOrLatestRatio * limit)
      const latestPercentage = Math.round(latestRatio * rawOrLatestRatio * 100)

      return {
        opportunities: [
          ...(await getSimilarityRecommendationByUser(
            db,
            userId,
            types,
            limit - rawOrLatestLimit,
          )),
          ...(await getSimilarityRecommendationByTags(
            db,
            tagProfile.id,
            types,
            rawOrLatestLimit - latestLimit,
          )),
          ...(await getLatestRecommendation(db, types, latestLimit)),
        ],
        sources: {
          label_similarity: 100 - rawOrLatestPercentage,
          raw_similarity: rawOrLatestPercentage - latestPercentage,
          latest: latestPercentage,
        },
      }
    }

    if (rawOrLatestRatio === 1) {
      return {
        opportunities: await getSimilarityRecommendationByTags(
          db,
          tagProfile.id,
          types,
          limit,
        ),
        sources: { raw_similarity: 100 },
      }
    }

    return {
      opportunities: [
        ...(await getSimilarityRecommendationByUser(
          db,
          userId,
          types,
          limit - rawOrLatestLimit,
        )),
        ...(await getSimilarityRecommendationByTags(
          db,
          tagProfile.id,
          types,
          rawOrLatestLimit,
        )),
      ],
      sources: {
        label_similarity: 100 - rawOrLatestPercentage,
        raw_similarity: rawOrLatestPercentage,
      },
    }
  }

  return {
    opportunities: await getSimilarityRecommendationByUser(
      db,
      userId,
      types,
      limit,
    ),
    sources: { label_similarity: 100 },
  }
}
