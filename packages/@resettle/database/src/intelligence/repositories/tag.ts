import type {
  TagNamespace,
  TagTemplateResponse,
  UserTagAttachBody,
  UserTagDetachBody,
} from '@resettle/schema/intelligence'
import { sql, type Kysely } from 'kysely'

import { createUUIDSetHash } from '@resettle/utils'
import type { IntelligenceDatabase } from '../database'

export const searchTags = async (
  db: Kysely<IntelligenceDatabase>,
  opts: {
    limit: number
    orderByDirection: 'asc' | 'desc'
    where: {
      q: string
      fuzzy?: boolean
      namespace?: TagNamespace
    }
  },
): Promise<TagTemplateResponse[]> => {
  return await db
    .selectFrom('tag_template')
    .selectAll()
    .$if(Boolean(opts.where.fuzzy), qb =>
      qb.where(
        sql<number>`lower(name) <<-> lower(${sql.lit(opts.where.q)})`,
        '<',
        0.3,
      ),
    )
    .$if(!Boolean(opts.where.fuzzy), qb =>
      qb.where(
        sql`lower(name)`,
        'like',
        sql<string>`lower(${sql.lit(`%${opts.where.q}%`)})`,
      ),
    )
    .$if(Boolean(opts.where.namespace), qb =>
      qb.where('namespace', '=', opts.where.namespace!),
    )
    .$if(Boolean(opts.where.fuzzy), qb =>
      qb.orderBy(
        sql<number>`lower(name) <<-> lower(${sql.lit(opts.where.q)})`,
        opts.orderByDirection,
      ),
    )
    .$if(!Boolean(opts.where.fuzzy), qb =>
      qb.orderBy(
        sql<number>`lower(name) like lower(${sql.lit(`%${opts.where.q}%`)})`,
        opts.orderByDirection,
      ),
    )
    .where('deprecated_at', 'is not', null)
    .limit(opts.limit)
    .execute()
}

export const attachTags = async (
  db: Kysely<IntelligenceDatabase>,
  tenantId: string,
  attachments: UserTagAttachBody[],
) => {
  const validAttachments = new Map<string, Map<string, Record<string, any>>>()
  const currentAttachments = new Map<
    string,
    { tags: Map<string, Record<string, any>>; hash: string | null }
  >()
  for (const attachment of attachments) {
    if (currentAttachments.has(attachment.user_id)) {
      // The current tags of the user was already read and the user is guaranteed to exist, skip reading.
      validAttachments.set(
        attachment.user_id,
        validAttachments
          .get(attachment.user_id)
          ?.set(attachment.tag_id, attachment.data) ??
          new Map<string, Record<string, any>>().set(
            attachment.tag_id,
            attachment.data,
          ),
      )

      continue
    }

    const user = await db
      .selectFrom('user')
      .selectAll()
      .where('tenant_id', '=', tenantId)
      .where('id', '=', attachment.user_id)
      .executeTakeFirst()

    if (user) {
      validAttachments.set(
        attachment.user_id,
        validAttachments
          .get(attachment.user_id)
          ?.set(attachment.tag_id, attachment.data) ??
          new Map<string, Record<string, any>>().set(
            attachment.tag_id,
            attachment.data,
          ),
      )
      if (!user.tag_profile_id) {
        currentAttachments.set(user.id, { tags: new Map(), hash: null })
      } else {
        // A profile will have at least 1 attached tag.
        const tagIds = await db
          .selectFrom('tag_profile')
          .innerJoin(
            'profile_tag',
            'tag_profile.id',
            'profile_tag.tag_profile_id',
          )
          .select([
            'profile_tag.tag_template_id',
            'tag_profile.hash',
            'profile_tag.data',
          ])
          .where('tag_profile.id', '=', user.tag_profile_id)
          .execute()
        currentAttachments.set(user.id, {
          tags: new Map(tagIds.map(t => [t.tag_template_id, t.data])),
          hash: tagIds[0].hash,
        })
      }
    }
  }

  const actualAttachments: UserTagAttachBody[] = []
  for (const [userId, tags] of validAttachments) {
    const prevIndex = actualAttachments.length
    const currentMap = currentAttachments.get(userId)!.tags
    for (const [tagId, data] of tags) {
      if (!currentMap.has(tagId)) {
        actualAttachments.push({ user_id: userId, tag_id: tagId, data })
      }

      currentMap.set(tagId, data)
    }

    if (actualAttachments.length > prevIndex) {
      const newHash = await createUUIDSetHash([...currentMap.keys()])
      const tagProfile = await db
        .selectFrom('tag_profile')
        .selectAll()
        .where('hash', '=', newHash)
        .executeTakeFirst()
      if (tagProfile) {
        await db
          .updateTable('user')
          .set('tag_profile_id', tagProfile.id)
          .where('id', '=', userId)
          .execute()
      } else {
        const newTagProfile = await db
          .insertInto('tag_profile')
          .values({ hash: newHash })
          .returningAll()
          .executeTakeFirstOrThrow()
        await db
          .insertInto('profile_tag')
          .values(
            [...currentMap.entries()].map(([tagId, data]) => ({
              tag_profile_id: newTagProfile.id,
              tag_template_id: tagId,
              data: JSON.stringify(data),
            })),
          )
          .execute()
      }
    }
  }

  return actualAttachments
}

export const detachTags = async (
  db: Kysely<IntelligenceDatabase>,
  tenantId: string,
  detachments: UserTagDetachBody[],
) => {
  const validDetachments = new Map<string, Set<string>>()
  const currentAttachments = new Map<
    string,
    { tags: Set<string>; hash: string | null }
  >()
  for (const detachment of detachments) {
    if (currentAttachments.has(detachment.user_id)) {
      // The current tags of the user was already read and the user is guaranteed to exist, skip reading.
      validDetachments.set(
        detachment.user_id,
        validDetachments.get(detachment.user_id)?.add(detachment.tag_id) ??
          new Set([detachment.tag_id]),
      )

      continue
    }

    const user = await db
      .selectFrom('user')
      .selectAll()
      .where('tenant_id', '=', tenantId)
      .where('id', '=', detachment.user_id)
      .executeTakeFirst()

    if (user && user.tag_profile_id) {
      validDetachments.set(
        detachment.user_id,
        validDetachments.get(detachment.user_id)?.add(detachment.tag_id) ??
          new Set([detachment.tag_id]),
      )

      // A profile will have at least 1 attached tag.
      const tagIds = await db
        .selectFrom('tag_profile')
        .innerJoin(
          'profile_tag',
          'tag_profile.id',
          'profile_tag.tag_profile_id',
        )
        .select(['profile_tag.tag_template_id', 'tag_profile.hash'])
        .where('tag_profile.id', '=', user.tag_profile_id)
        .execute()
      currentAttachments.set(user.id, {
        tags: new Set(tagIds.map(t => t.tag_template_id)),
        hash: tagIds[0].hash,
      })
    }
  }

  const actualDetachments: UserTagDetachBody[] = []
  for (const [userId, tagIds] of validDetachments) {
    const prevIndex = actualDetachments.length
    const currentSet = currentAttachments.get(userId)!.tags
    for (const tagId of tagIds) {
      if (currentSet.has(tagId)) {
        actualDetachments.push({ user_id: userId, tag_id: tagId })
      }

      currentSet.delete(tagId)
    }

    if (actualDetachments.length > prevIndex) {
      if (currentSet.size === 0) {
        await db
          .updateTable('user')
          .set('tag_profile_id', null)
          .where('id', '=', userId)
          .execute()
      } else {
        const newHash = await createUUIDSetHash([...currentSet])
        const tagProfile = await db
          .selectFrom('tag_profile')
          .selectAll()
          .where('hash', '=', newHash)
          .executeTakeFirst()

        if (tagProfile) {
          await db
            .updateTable('user')
            .set('tag_profile_id', tagProfile.id)
            .where('id', '=', userId)
            .execute()
        } else {
          const newTagProfile = await db
            .insertInto('tag_profile')
            .values({ hash: newHash })
            .returningAll()
            .executeTakeFirstOrThrow()
          await db
            .insertInto('profile_tag')
            .values(
              [...currentSet].map(tagId => ({
                tag_profile_id: newTagProfile.id,
                tag_template_id: tagId,
                data: JSON.stringify({}),
              })),
            )
            .execute()
        }
      }
    }
  }

  return actualDetachments
}
