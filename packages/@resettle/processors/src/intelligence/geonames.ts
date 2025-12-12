import { S3Client } from '@3rd-party-clients/s3'
import type { IntelligenceDatabase } from '@resettle/database/intelligence'
import type { CountryAlpha2Code } from '@resettle/schema'
import {
  PLACE_FEATURE_CODES,
  type PlaceFeatureCode,
} from '@resettle/schema/intelligence'
import { isSameDay } from 'date-fns'
import type { Kysely } from 'kysely'

import {
  conditionalInMemoryDownloadS3,
  getPreviousDay,
  getTheDayBeforePreviousDay,
  refDirToRefS3,
  type S3RefDir,
} from '../_common'

const processDeletes = async (
  ctx: {
    s3: S3Client
    db: Kysely<IntelligenceDatabase>
  },
  ref: S3RefDir,
) => {
  const filename = `deletes-${getPreviousDay()}.txt`
  const content = (
    await conditionalInMemoryDownloadS3(
      ctx.s3,
      refDirToRefS3(ref, `geonames/${filename}`),
      `https://download.geonames.org/export/dump/${filename}`,
    )
  ).toString('utf-8')
  for (const row of content.split('\n')) {
    const parts = row.split('\t')
    const id = parseInt(parts[0])
    const deleting = await ctx.db
      .deleteFrom('place')
      .where('external_id', '=', id)
      .returningAll()
      .executeTakeFirst()
    if (deleting && !deleting.numbeo_reference) {
      await ctx.db
        .deleteFrom('place')
        .where('external_id', '=', deleting.external_id)
        .execute()
    }
  }
}

const processModifications = async (
  ctx: {
    s3: S3Client
    db: Kysely<IntelligenceDatabase>
  },
  ref: S3RefDir,
) => {
  const filename = `modifications-${getPreviousDay()}.txt`
  const content = (
    await conditionalInMemoryDownloadS3(
      ctx.s3,
      refDirToRefS3(ref, `geonames/${filename}`),
      `https://download.geonames.org/export/dump/${filename}`,
    )
  ).toString('utf-8')

  for (const row of content.split('\n')) {
    const parts = row.split('\t')
    const id = parseInt(parts[0])
    const name = parts[1]
    const aliases = parts[3].length === 0 ? [] : parts[3].split(',')
    const latitude = parseFloat(parts[4])
    const longitude = parseFloat(parts[5])
    const featureCode = parts[7]
    const countryCode = parts[8] as CountryAlpha2Code
    const admin1 = parts[10]
    const admin2 = parts[11]
    const admin3 = parts[12]
    const admin4 = parts[13]
    const population = parts[14]
    const elevation = parseInt(parts[16])

    if (PLACE_FEATURE_CODES.includes(featureCode as any)) {
      const row = {
        external_id: id,
        name,
        aliases,
        latitude,
        longitude,
        feature_code: featureCode as PlaceFeatureCode,
        country_code: countryCode,
        admin1_code: admin1,
        admin2_code: admin2,
        admin3_code: admin3,
        admin4_code: admin4,
        population,
        elevation,
      }

      await ctx.db
        .insertInto('place')
        .values(row)
        .onConflict(oc =>
          oc.column('external_id').doUpdateSet(eb => ({
            name: eb.ref('excluded.name'),
            aliases: eb.ref('excluded.aliases'),
            latitude: eb.ref('excluded.latitude'),
            longitude: eb.ref('excluded.longitude'),
            feature_code: eb.ref('excluded.feature_code'),
            country_code: eb.ref('excluded.country_code'),
            admin1_code: eb.ref('excluded.admin1_code'),
            admin2_code: eb.ref('excluded.admin2_code'),
            admin3_code: eb.ref('excluded.admin3_code'),
            admin4_code: eb.ref('excluded.admin4_code'),
            population: eb.ref('excluded.population'),
            elevation: eb.ref('excluded.elevation'),
            numbeo_reference: eb.ref('place.numbeo_reference'),
          })),
        )
        .execute()
    }
  }
}

const processGeonamesIncrementally = async (
  ctx: {
    s3: S3Client
    db: Kysely<IntelligenceDatabase>
  },
  ref: S3RefDir,
) => {
  await processDeletes(ctx, ref)
  await processModifications(ctx, ref)
  await ctx.db
    .updateTable('metadata')
    .set('geonames_updated_at', new Date(getPreviousDay()))
    .execute()
}

export const processGeonames = async (
  ctx: { s3: S3Client; db: Kysely<IntelligenceDatabase> },
  ref: S3RefDir,
) => {
  const metadata = await ctx.db.selectFrom('metadata').selectAll().execute()
  const previousDay = getPreviousDay()
  const theDayBeforePreviousDay = getTheDayBeforePreviousDay()

  if (
    metadata.length === 0 ||
    (!isSameDay(metadata[0].geonames_updated_at, previousDay) &&
      !isSameDay(metadata[0].geonames_updated_at, theDayBeforePreviousDay))
  ) {
    throw new Error(
      'Geonames is multiple versions older than the latest version, can only update by whole via CLI',
    )
  }

  if (!isSameDay(metadata[0].geonames_updated_at, theDayBeforePreviousDay)) {
    console.log('Geonames is already of the latest version, skipping...')
    return
  }

  console.log(
    'Geonames is one version older than the latest version, updating by delta...',
  )
  await processGeonamesIncrementally(ctx, ref)
  await ctx.db.schema.refreshMaterializedView('place_name_or_alias').execute()
}
