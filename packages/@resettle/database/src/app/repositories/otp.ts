import type { OTP, OTPType } from '@resettle/schema/app'
import { sql, type Kysely } from 'kysely'

import type { AppDatabase } from '../database'

/**
 * Parses an OTP object
 * @param otp - The OTP object to parse
 * @returns The parsed OTP object
 */
const parse = (otp: OTP) => otp

/**
 * Creates a new OTP record in the database
 * @param db - The Kysely database instance
 * @param values - The OTP values to insert (excluding id, created_at, and expires_at)
 * @returns The created OTP record
 * @throws If the operation fails
 */
export const createOTP = async (
  db: Kysely<AppDatabase>,
  values: Omit<OTP, 'id' | 'expires_at' | 'created_at' | 'updated_at'>,
): Promise<OTP> => {
  const result = await db
    .insertInto('otp')
    .values({
      ...values,
      last_sent_at: sql`now()`,
      expires_at: sql`now() + INTERVAL '10 minutes'`,
    })
    .returningAll()
    .executeTakeFirstOrThrow()

  return parse(result)
}

/**
 * Retrieves a valid (non-expired) OTP record based on action_id and recipient
 * @param db - The Kysely database instance
 * @param action_id - The OTP action id
 * @param recipient_type - The type of recipient
 * @param recipient - The recipient identifier (email, phone, etc.)
 * @returns The OTP record or null if not found
 */
export const getOTP = async (
  db: Kysely<AppDatabase>,
  action_id: string,
  type: OTPType,
  recipient: string,
): Promise<OTP | null> => {
  const result = await db
    .selectFrom('otp')
    .selectAll()
    .where('action_id', '=', action_id)
    .where('type', '=', type)
    .where('recipient', '=', recipient)
    .where('expires_at', '>', sql<Date>`now()`)
    .orderBy('last_sent_at', 'desc')
    .executeTakeFirst()

  return result ? parse(result) : null
}

/**
 * Updates an existing OTP record by its ID
 * @param db - The Kysely database instance
 * @param id - The unique identifier of the OTP record
 * @param values - The values to update
 * @param values.token - Optional new token value
 * @param values.last_sent_at - Optional timestamp when the OTP was last sent
 * @returns The updated OTP record or null if not found
 */
export const updateOTPById = async (
  db: Kysely<AppDatabase>,
  id: string,
  values: Partial<Pick<OTP, 'code' | 'last_sent_at'>>,
): Promise<OTP | null> => {
  const result = await db
    .updateTable('otp')
    .set({
      code: values.code,
      last_sent_at: values.last_sent_at,
    })
    .where('id', '=', id)
    .returningAll()
    .executeTakeFirst()

  return result ? parse(result) : null
}

/**
 * Deletes an OTP record by its ID
 * @param db - The Kysely database instance
 * @param id - The unique identifier of the OTP record to delete
 * @returns The deleted record or null if not found
 */
export const deleteOTPById = async (
  db: Kysely<AppDatabase>,
  id: string,
): Promise<OTP | null> => {
  const result = await db
    .deleteFrom('otp')
    .where('id', '=', id)
    .returningAll()
    .executeTakeFirst()

  return result ? parse(result) : null
}
