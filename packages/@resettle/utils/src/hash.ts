/**
 * Creates a cryptographic hash of the provided string data
 *
 * @param data - The string to hash
 * @param algorithm - The hashing algorithm to use ('SHA-256' or 'SHA-512')
 * @returns A hexadecimal string representation of the hash
 *
 * @example
 * ```ts
 * const hash = await createHash('hello world')
 * // Returns: "b94d27b9934d3e08a52e52d7da7dabfac484efe37a5380ee9088f7ace2efcde9"
 * ```
 */
export const createHash = async (
  data: string,
  algorithm: 'SHA-256' | 'SHA-512' = 'SHA-256',
) => {
  const msgUint8 = new TextEncoder().encode(data)
  const hashBuffer = await crypto.subtle.digest(algorithm, msgUint8)
  const hashArray = Array.from(new Uint8Array(hashBuffer))

  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
}

/**
 * Creates a cryptographic hash of the provided buffer data
 *
 * @param data - The buffer to hash
 * @param algorithm - The hashing algorithm to use ('SHA-256' or 'SHA-512')
 * @returns A hexadecimal string representation of the hash
 */
export const createBufferHash = async (
  data: ArrayBuffer,
  algorithm: 'SHA-256' | 'SHA-512' = 'SHA-256',
) => {
  const hash = await crypto.subtle.digest(algorithm, data)

  return Buffer.from(hash).toString('hex')
}

/**
 * Creates a salted hash of a password for secure storage
 *
 * @param password - The password to hash
 * @returns A string in the format "salt:hash"
 *
 * @example
 * ```ts
 * const hashedPassword = await createPasswordHash('mySecurePassword')
 * // Returns: "abc123:f7d8e9a2b4c6..."
 * ```
 */
export const createPasswordHash = async (password: string) => {
  const salt = Math.random().toString(36).substring(2, 15)
  const hash = await createHash(password + salt)

  return `${salt}:${hash}`
}

/**
 * Verifies a password against a stored password hash
 *
 * @param password - The password to verify
 * @param passwordHash - The stored password hash in "salt:hash" format
 * @returns Boolean indicating if the password matches the hash
 *
 * @example
 * ```ts
 * const isValid = await verifyPasswordHash('myPassword', 'abc123:f7d8e9a2b4c6...')
 * // Returns: true or false
 * ```
 */
export const verifyPasswordHash = async (
  password: string,
  passwordHash: string,
) => {
  const [salt, hash] = passwordHash.split(':')
  const newHash = await createHash(password + salt)

  return newHash === hash
}

/**
 * Recursively sorts an object's properties and optionally filters null values
 *
 * @param obj - The object to sort
 * @param nullable - Whether to include null values in the result
 * @returns A new object with sorted properties
 */
const sortObject = (obj: unknown, nullable: boolean): unknown => {
  if (obj === null || typeof obj !== 'object') {
    return obj
  }

  if (Array.isArray(obj)) {
    return obj.map(o => sortObject(o, nullable))
  }

  return Object.fromEntries(
    Object.entries(obj)
      .filter(([_, value]) =>
        nullable ? value !== undefined : value !== undefined && value !== null,
      )
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([key, value]) => [key, sortObject(value, nullable)]),
  )
}

/**
 * Creates a hash of an object by first sorting its properties
 *
 * @param obj - The object to hash
 * @param options - Configuration options
 * @param options.nullable - Whether to include null values when hashing
 * @param options.algorithm - The hashing algorithm to use
 * @returns A hexadecimal string representation of the object hash
 *
 * @example
 * ```ts
 * const hash = await createObjectHash({ b: 2, a: 1 })
 * // Same hash as createObjectHash({ a: 1, b: 2 })
 * ```
 */
export const createObjectHash = async (
  obj: Record<string, unknown>,
  {
    nullable = false,
    algorithm = 'SHA-256',
  }: {
    nullable?: boolean
    algorithm?: 'SHA-256' | 'SHA-512'
  } = {},
) => {
  return await createHash(JSON.stringify(sortObject(obj, nullable)), algorithm)
}
