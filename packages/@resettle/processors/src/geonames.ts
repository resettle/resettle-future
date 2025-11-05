import { S3Client } from '@3rd-party-clients/s3'
import type { GlobalDatabase, PlaceTable } from '@resettle/database/global'
import type { CountryAlpha2Code } from '@resettle/schema'
import {
  PLACE_FEATURE_CODES,
  type PlaceFeatureCode,
} from '@resettle/schema/global'
import { isSameDay } from 'date-fns'
import type { Insertable, Kysely } from 'kysely'
import { createReadStream, createWriteStream } from 'node:fs'
import { createInterface } from 'node:readline'
import { Open } from 'unzipper'

import {
  getPreviousDay,
  getTheDayBeforePreviousDay,
  loadFile,
  refDirToRef,
  saveFile,
  type Ref,
  type RefDir,
} from './utils'

const ALL_COUNTRIES_FILENAME = `allCountries.zip`

/**
 * Conditional in memory download
 * @param s3 - The S3 client
 * @param ref - The reference
 * @param filename - The filename
 * @returns The content
 */
const conditionalInMemoryDownload = async (
  s3: S3Client,
  ref: Ref,
  filename: string,
) => {
  const result = await loadFile({ s3 }, ref, { stream: false })
  if (!result.success) {
    const resp = await fetch(
      `https://download.geonames.org/export/dump/${filename}`,
    )

    if (!resp.body) {
      throw new Error(
        `Error fetching ${filename} - ${resp.status}: ${resp.statusText}`,
      )
    }

    await saveFile({ s3 }, ref, resp.body, {})
    const secondResult = await loadFile({ s3 }, ref, { stream: false })
    if (!secondResult.success) {
      throw new Error(`Error loading ${filename}`)
    }

    return secondResult.data
  }

  return result.data
}

/**
 * Conditional stream download
 * @param s3 - The S3 client
 * @param ref - The reference
 * @param filename - The filename
 * @returns The content
 */
const conditionalStreamDownload = async (
  s3: S3Client,
  ref: Ref,
  filename: string,
) => {
  const result = await loadFile({ s3 }, ref, { stream: true })
  if (!result.success) {
    const resp = await fetch(
      `https://download.geonames.org/export/dump/${filename}`,
    )

    if (!resp.body) {
      throw new Error(
        `Error fetching ${filename} - ${resp.status}: ${resp.statusText}`,
      )
    }

    await saveFile({ s3 }, ref, resp.body, { contentType: 'application/zip' })
  }
}

/**
 * Process deletes
 * @param ctx - The context
 * @param ctx.s3 - The S3 client
 * @param ctx.db - The global database
 * @param ref - The reference directory
 */
const processDeletes = async (
  ctx: {
    s3: S3Client
    db: Kysely<GlobalDatabase>
  },
  ref: RefDir,
) => {
  const filename = `deletes-${getPreviousDay()}.txt`
  const content = (
    await conditionalInMemoryDownload(
      ctx.s3,
      refDirToRef(ref, `geonames/${filename}`),
      filename,
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

/**
 * Process modifications
 * @param ctx - The context
 * @param ctx.s3 - The S3 client
 * @param ctx.db - The global database
 * @param ref - The reference directory
 */
const processModifications = async (
  ctx: {
    s3: S3Client
    db: Kysely<GlobalDatabase>
  },
  ref: RefDir,
) => {
  const filename = `modifications-${getPreviousDay()}.txt`
  const content = (
    await conditionalInMemoryDownload(
      ctx.s3,
      refDirToRef(ref, `geonames/${filename}`),
      filename,
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
            numbeo_reference: eb.ref('excluded.numbeo_reference'),
          })),
        )
        .execute()
    }
  }
}

/**
 * Process geonames incrementally
 * @param ctx - The context
 * @param ctx.s3 - The S3 client
 * @param ctx.db - The global database
 * @param ref - The reference directory
 */
const processGeonamesIncrementally = async (
  ctx: {
    s3: S3Client
    db: Kysely<GlobalDatabase>
  },
  ref: RefDir,
) => {
  await processDeletes(ctx, ref)
  await processModifications(ctx, ref)
  await ctx.db
    .updateTable('metadata')
    .set('geonames_updated_at', new Date(getPreviousDay()))
    .execute()
}

/**
 * Process geonames completely
 * @param ctx - The context
 * @param ctx.s3 - The S3 client
 * @param ctx.db - The global database
 * @param ref - The reference directory
 * @param tempFile - The temporary file
 */
const processGeonamesCompletely = async (
  ctx: {
    s3: S3Client
    db: Kysely<GlobalDatabase>
  },
  ref: RefDir,
  tempFile: string,
) => {
  const filename = `geonames/all-countries-${getPreviousDay()}.zip`
  const computedRef = refDirToRef(ref, filename)

  await conditionalStreamDownload(ctx.s3, computedRef, ALL_COUNTRIES_FILENAME)

  const directory =
    computedRef.type === 'fs'
      ? await Open.file(computedRef.path)
      : await Open.s3_v3(ctx.s3, {
          Bucket: computedRef.bucket,
          Key: computedRef.key,
        })

  const readStream1 = directory.files[0].stream()
  const rl1 = createInterface({
    input: readStream1,
    crlfDelay: Infinity,
  })

  const writeStream = createWriteStream(tempFile)

  for await (const line of rl1) {
    const parts = line.split('\t')
    const id = parts[0]
    const name = parts[1]
    const alternates = parts[3]
    const latitude = parts[4]
    const longitude = parts[5]
    const featureCode = parts[7]
    const countryCode = parts[8]
    const admin1 = parts[10]
    const admin2 = parts[11]
    const admin3 = parts[12]
    const admin4 = parts[13]
    const population = parts[14]
    const elevation = parts[16]

    if (PLACE_FEATURE_CODES.includes(featureCode as any)) {
      writeStream.write(
        [
          id,
          name,
          alternates,
          latitude,
          longitude,
          featureCode,
          countryCode,
          admin1,
          admin2,
          admin3,
          admin4,
          population,
          elevation,
        ].join('\t') + '\n',
      )
    }
  }

  writeStream.end()

  const readStream2 = createReadStream(tempFile, {
    highWaterMark: 1024 * 1024,
  })

  const rl2 = createInterface({
    input: readStream2,
    crlfDelay: Infinity,
  })

  let rows: Insertable<PlaceTable>[] = []

  for await (const line of rl2) {
    const parts = line.split('\t')
    const id = parseInt(parts[0])
    const name = parts[1]
    const aliases = parts[2].length === 0 ? [] : parts[2].split(',')
    const latitude = parseFloat(parts[3])
    const longitude = parseFloat(parts[4])
    const featureCode = parts[5] as PlaceFeatureCode
    const countryCode = parts[6] as CountryAlpha2Code
    const admin1Code = parts[7]
    const admin2Code = parts[8]
    const admin3Code = parts[9]
    const admin4Code = parts[10]
    const population = parts[11]
    const elevation = parseInt(parts[12])

    rows.push({
      external_id: id,
      name,
      aliases,
      latitude,
      longitude,
      feature_code: featureCode,
      country_code: countryCode,
      admin1_code: admin1Code,
      admin2_code: admin2Code,
      admin3_code: admin3Code,
      admin4_code: admin4Code,
      population,
      elevation,
    })
  }

  const BATCH_SIZE = 1000

  for (let i = 0; i < Math.ceil(rows.length / BATCH_SIZE); i++) {
    if (i % 100 === 0) {
      console.log(`Inserting geonames batch ${i}`)
    }

    const batch = rows.slice(i * BATCH_SIZE, (i + 1) * BATCH_SIZE)

    await ctx.db
      .insertInto('place')
      .values(batch)
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
          numbeo_reference: eb.ref('excluded.numbeo_reference'),
        })),
      )
      .execute()
  }

  await ctx.db
    .updateTable('metadata')
    .set('geonames_updated_at', new Date(getPreviousDay()))
    .execute()
}

/**
 * Process geonames
 * @param ctx - The context
 * @param ctx.s3 - The S3 client
 * @param ctx.db - The global database
 * @param ref - The reference directory
 * @param tempFile - The temporary file
 */
export const processGeonames = async (
  ctx: { s3: S3Client; db: Kysely<GlobalDatabase> },
  ref: RefDir,
  tempFile: string,
) => {
  const metadata = await ctx.db.selectFrom('metadata').selectAll().execute()
  const previousDay = getPreviousDay()
  const theDayBeforePreviousDay = getTheDayBeforePreviousDay()

  if (
    metadata.length === 0 ||
    (!isSameDay(metadata[0].geonames_updated_at, previousDay) &&
      !isSameDay(metadata[0].geonames_updated_at, theDayBeforePreviousDay))
  ) {
    console.log(
      'Geonames is multiple versions older than the latest version, updating by whole...',
    )
    await processGeonamesCompletely(ctx, ref, tempFile)
  } else if (
    isSameDay(metadata[0].geonames_updated_at, theDayBeforePreviousDay)
  ) {
    console.log(
      'Geonames is one version older than the latest version, updating by delta...',
    )
    await processGeonamesIncrementally(ctx, ref)
  } else {
    console.log('Geonames is already of the latest version, skipping...')
  }
}
