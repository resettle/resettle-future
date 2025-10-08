import { round2 } from './number'

/**
 * Safely converts a value to an integer
 * @param value - The value to convert (string, number, or bigint)
 * @throws If the value is not a valid integer
 * @returns The parsed integer value
 */
export function safeParseInt(value: string | number | bigint): number
export function safeParseInt(
  value: string | number | bigint | null,
): number | null
export function safeParseInt(
  value: string | number | bigint | undefined,
): number | undefined
export function safeParseInt(
  value: string | number | bigint | null | undefined,
): number | null | undefined
export function safeParseInt(
  value: string | number | bigint | null | undefined,
) {
  if (value == undefined || value === null) {
    return value
  }

  switch (typeof value) {
    case 'string':
      return parseInt(value)
    case 'number':
      return Math.trunc(value)
    case 'bigint':
      return Math.trunc(Number(value))
    default:
      throw new Error(`Invalid integer value: ${value}`)
  }
}

/**
 * Safely converts a value to a floating point number
 * @param value - The value to convert (string, number, or bigint)
 * @throws If the value is not a valid float
 * @returns The parsed float value
 */
export function safeParseFloat(value: string | number | bigint): number
export function safeParseFloat(
  value: string | number | bigint | null,
): number | null
export function safeParseFloat(
  value: string | number | bigint | undefined,
): number | undefined
export function safeParseFloat(
  value: string | number | bigint | null | undefined,
): number | null | undefined
export function safeParseFloat(
  value: string | number | bigint | null | undefined,
) {
  if (value == undefined || value === null) {
    return value
  }

  switch (typeof value) {
    case 'string':
      return parseFloat(value)
    case 'number':
      return value
    case 'bigint':
      return Number(value)
    default:
      throw new Error(`Invalid float value: ${value}`)
  }
}

/**
 * Safely converts a value to a date
 * @param value - The value to convert (string, number, or date)
 * @throws If the value is not a valid date
 * @returns The parsed date value
 */
export function safeParseDate(value: string | number | Date): Date
export function safeParseDate(value: string | number | Date | null): Date | null
export function safeParseDate(
  value: string | number | Date | undefined,
): Date | undefined
export function safeParseDate(
  value: string | number | Date | null | undefined,
): Date | null | undefined
export function safeParseDate(
  value: string | number | Date | null | undefined,
) {
  if (value == undefined || value === null) {
    return value
  }

  switch (typeof value) {
    case 'string':
      return new Date(value)
    case 'number':
      return new Date(value)
    case 'object':
      if (value instanceof Date) {
        return value
      }
      throw new Error(`Invalid date value: ${value}`)
    default:
      throw new Error(`Invalid date value: ${value}`)
  }
}

/**
 * Safely converts a value to a currency
 * @param value - The value to convert (string, number, or bigint)
 * @throws If the value is not a valid currency
 * @returns The parsed currency value
 */
export function safeParseCurrency(value: string | number | bigint): number
export function safeParseCurrency(
  value: string | number | bigint | null,
): number | null
export function safeParseCurrency(
  value: string | number | bigint | undefined,
): number | undefined
export function safeParseCurrency(
  value: string | number | bigint | null | undefined,
): number | null | undefined
export function safeParseCurrency(
  value: string | number | bigint | null | undefined,
) {
  if (value == undefined || value === null) {
    return value
  }

  switch (typeof value) {
    case 'string':
      return round2(parseFloat(value.replace(/[$,]/g, '')))
    case 'number':
      return round2(value)
    case 'bigint':
      return round2(Number(value))
    default:
      throw new Error(`Invalid currency value: ${value}`)
  }
}
