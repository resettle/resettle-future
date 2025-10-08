/**
 * Type utility to check if two types are exactly equal
 *
 * @template T - First type to compare
 * @template U - Second type to compare
 * @returns true if types are exactly equal, false otherwise
 */
export type Equals<T, U> =
  (<G>() => G extends T ? 1 : 2) extends <G>() => G extends U ? 1 : 2
    ? true
    : false

export class AssertionError extends Error {
  constructor(msg: string | undefined) {
    super(`Wrong assertion encountered` + (!msg ? '' : `: "${msg}"`))

    Object.setPrototypeOf(this, new.target.prototype)
  }
}

/**
 * Asserts that a condition is true
 *
 * @param condition - The condition to check
 * @param msg - Optional error message
 * @throws {AssertionError} If the condition is falsy
 *
 * @example
 * ```ts
 * assert(user.isAdmin, 'User must be an admin')
 * ```
 */
export function assert<_T extends true>(
  condition?: any,
  msg?: string,
): asserts condition {
  if (arguments.length === 0) {
    condition = true
  }

  if (!condition) {
    throw new AssertionError(msg)
  }
}

/**
 * Ensures a value is not undefined
 *
 * @param value - The value to check
 * @param msg - Optional error message
 * @returns The value if it's not undefined
 * @throws {AssertionError} If the value is undefined
 *
 * @example
 * ```ts
 * const name = nonUndefined(user.name, 'User name is required')
 * ```
 */
export function nonUndefined<T>(value: T | undefined, msg?: string): T {
  assert(value !== undefined, msg)

  return value as T
}

/**
 * Ensures a value is not null
 *
 * @param value - The value to check
 * @param msg - Optional error message
 * @returns The value if it's not null
 * @throws {AssertionError} If the value is null
 *
 * @example
 * ```ts
 * const email = nonNull(user.email, 'User email is required')
 * ```
 */
export function nonNull<T>(value: T | null, msg?: string): T {
  assert(value !== null, msg)

  return value as T
}

/**
 * Ensures a value is neither null nor undefined
 *
 * @param value - The value to check
 * @param msg - Optional error message
 * @returns The value if it's neither null nor undefined
 * @throws {AssertionError} If the value is null or undefined
 *
 * @example
 * ```ts
 * const id = nonNullish(user.id, 'User ID is required')
 * ```
 */
export function nonNullish<T>(value: T | null | undefined, msg?: string): T {
  assert(value !== null && value !== undefined, msg)

  return value as T
}

/**
 * Type guard to check if a value is undefined
 *
 * @param value - The value to check
 * @returns True if the value is undefined, false otherwise
 *
 * @example
 * ```ts
 * if (isUndefined(user.middleName)) {
 *   // Handle undefined case
 * }
 * ```
 */
export function isUndefined<const T>(value: T | undefined): value is undefined {
  return value === undefined
}

/**
 * Type guard to check if a value is null
 *
 * @param value - The value to check
 * @returns True if the value is null, false otherwise
 *
 * @example
 * ```ts
 * if (isNull(user.deletedAt)) {
 *   // Handle null case
 * }
 * ```
 */
export function isNull<const T>(value: T | null): value is null {
  return value === null
}

/**
 * Type guard to check if a value is null or undefined
 *
 * @param value - The value to check
 * @returns True if the value is null or undefined, false otherwise
 *
 * @example
 * ```ts
 * if (isNullish(user.profile)) {
 *   // Handle null or undefined case
 * }
 * ```
 */
export function isNullish<const T>(
  value: T | null | undefined,
): value is null | undefined {
  return value === null || value === undefined
}

/**
 * Type guard to check if a value is a function
 *
 * @param value - The value to check
 * @returns True if the value is a function, false otherwise
 *
 * @example
 * ```ts
 * if (isFunction(handler)) {
 *   handler()
 * }
 * ```
 */
export function isFunction<const T extends Function, const K>(
  value: T | K,
): value is T {
  return typeof value === 'function'
}
