import { nonNullish } from '@resettle/utils'
import jwt from 'jsonwebtoken'

/**
 * Sign a JWT
 * @param payload - The payload to sign
 * @param secret - The secret to sign the payload with
 * @param opts - The options to sign the payload with
 * @returns The signed JWT
 */
export const signJWT = (
  payload: object,
  secret: string,
  opts: jwt.SignOptions = {},
) => {
  return new Promise<string>((resolve, reject) => {
    jwt.sign(payload, secret, opts, (err, token) => {
      if (err) {
        reject(err)
      } else {
        resolve(nonNullish(token))
      }
    })
  })
}

/**
 * Verify a JWT
 * @param token - The token to verify
 * @param secretOrSecrets - The secret or secrets to verify the token with
 * @param opts - The options to verify the token with
 * @returns The verified JWT
 */
export const verifyJWT = async <T>(
  token: string,
  secretOrSecrets: string | string[],
  opts: jwt.VerifyOptions = {},
) => {
  const verify = (secret: string) =>
    new Promise<T>((resolve, reject) => {
      jwt.verify(token, secret, opts, (err, decoded) => {
        if (err) {
          reject(err)
        } else {
          resolve(nonNullish(decoded) as T)
        }
      })
    })

  const secrets = Array.isArray(secretOrSecrets)
    ? secretOrSecrets
    : [secretOrSecrets]

  for (const secret of secrets) {
    try {
      return await verify(secret)
    } catch (error) {
      continue
    }
  }

  throw new Error('No valid secret found')
}
