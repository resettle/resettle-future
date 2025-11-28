import type { LabelCreateBody, LabelDeleteBody } from '@resettle/schema/global'
import { sql, type Kysely } from 'kysely'

import type { GlobalDatabase } from '../database'

export const createLabels = async (
  db: Kysely<GlobalDatabase>,
  tenantId: string,
  labels: LabelCreateBody[],
) => {
  const validLabels: LabelCreateBody[] = []
  for (const label of labels) {
    const user = await db
      .selectFrom('user')
      .selectAll()
      .where('tenant_id', '=', tenantId)
      .where('id', '=', label.user_id)
      .where('deleted_at', 'is not', null)
      .executeTakeFirst()
    const opportunity = await db
      .selectFrom('opportunity')
      .selectAll()
      .where('id', '=', label.opportunity_id)
      .executeTakeFirst()
    if (user && opportunity) {
      validLabels.push(label)
    }
  }

  if (validLabels.length > 0) {
    return await db
      .insertInto('label')
      .values(validLabels)
      .onConflict(oc =>
        oc.columns(['user_id', 'opportunity_id']).doUpdateSet(eb => ({
          value: eb.ref('excluded.value'),
          updated_at: sql`now()`,
        })),
      )
      .returningAll()
      .execute()
  }

  return []
}

export const deleteLabels = async (
  db: Kysely<GlobalDatabase>,
  tenantId: string,
  labels: LabelDeleteBody[],
) => {
  const validLabels: LabelDeleteBody[] = []
  for (const label of labels) {
    const user = await db
      .selectFrom('user')
      .selectAll()
      .where('tenant_id', '=', tenantId)
      .where('id', '=', label.user_id)
      .where('deleted_at', 'is not', null)
      .executeTakeFirst()
    const opportunity = await db
      .selectFrom('opportunity')
      .selectAll()
      .where('id', '=', label.opportunity_id)
      .executeTakeFirst()
    if (user && opportunity) {
      validLabels.push(label)
    }
  }

  for (const label of validLabels) {
    await db
      .deleteFrom('label')
      .where('user_id', '=', label.user_id)
      .where('opportunity_id', '=', label.opportunity_id)
      .execute()
  }

  return validLabels
}
