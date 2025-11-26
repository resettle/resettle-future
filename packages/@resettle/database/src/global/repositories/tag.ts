import type {
  TagNamespace,
  TagTemplateResponse,
  UserTagBody,
} from '@resettle/schema/global'
import { sql, type Kysely } from 'kysely'

import type { GlobalDatabase } from '../database'

export const searchTags = async (
  db: Kysely<GlobalDatabase>,
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

export const assignTags = async (
  db: Kysely<GlobalDatabase>,
  tenantId: string,
  assignments: UserTagBody[],
) => {
  const validAssignments: { user_id: string; tag_id: string }[] = []
  for (const assignment of assignments) {
    const user = await db
      .selectFrom('user')
      .select('id')
      .where('tenant_id', '=', tenantId)
      .where('id', '=', assignment.user_id)
      .executeTakeFirst()
    if (user) {
      validAssignments.push(assignment)
    }
  }

  if (validAssignments.length > 0) {
    return await db
      .insertInto('user_tag')
      .values(
        validAssignments.map(v => ({
          user_id: v.user_id,
          tag_template_id: v.tag_id,
          data: JSON.stringify({}),
        })),
      )
      .returningAll()
      .execute()
  }

  return []
}
