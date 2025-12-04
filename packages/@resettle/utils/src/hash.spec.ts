import assert from 'node:assert'
import { describe, it } from 'node:test'

import {
  createObjectHash,
  createPasswordHash,
  createUUIDSetHash,
  verifyPasswordHash,
} from './hash'

describe('hash', () => {
  describe('createHashedPassword', () => {
    it('should hash and verify a password', async () => {
      const password = 'password'
      const passwordHash = await createPasswordHash(password)

      assert.strictEqual(await verifyPasswordHash(password, passwordHash), true)
    })
  })

  describe('createObjectHash', () => {
    it('should hash an object', async () => {
      const a = { a: 1, b: undefined }
      const b = { a: 1, b: null }

      const hashA = await createObjectHash(a)
      const hashB = await createObjectHash(b)

      assert.strictEqual(hashA, hashB)
    })

    it('should hash same objects into same value', async () => {
      const a = { a: 1, b: 2, c: 'hello' }

      const hash1 = await createObjectHash(a)
      const hash2 = await createObjectHash(a)

      assert.strictEqual(hash1, hash2)
    })

    it('should hash an object with nested objects', async () => {
      const a = {
        slug: 'sg-whp',
        title: 'Singapore Work Holiday Program',
        description:
          'The Singapore Work Holiday Program (WHPr) is a program that allows young people from around the world to work and travel in Singapore for a period of up to 12 months.',
        metadata: {},
      }

      const b = {
        slug: 'sp-wh',
        title: 'Spain Working Holiday Visa',
        description:
          'The Spain Working Holiday Visa allows young citizens from Australia, Canada, Japan, South Korea and New Zealand to live, work and travel in Spain for up to 12 months. Applicants must be between 18-30 years old (18-35 for Canadians) and meet minimum savings requirements. This visa enables cultural exchange and allows holders to work to supplement their travel funds.',
        metadata: {},
      }

      const hashA = await createObjectHash(a)
      const hashB = await createObjectHash(b)

      assert.notStrictEqual(hashA, hashB)
    })
  })

  describe('createUUIDSetHash', () => {
    it('should sort UUIDs', async () => {
      const uuid0 = '00000000-0000-0000-0000-000000000000'
      const uuid1 = '00000000-0000-0000-0000-000000000001'
      const hash01 = await createUUIDSetHash([uuid0, uuid1])
      const hash10 = await createUUIDSetHash([uuid1, uuid0])

      assert.strictEqual(hash01, hash10)
    })

    it('should throw with invalid length', () => {
      assert.rejects(async () => await createUUIDSetHash([]), {
        message: 'Invalid UUID',
      })
    })

    it('should throw with invalid format', () => {
      assert.rejects(async () => await createUUIDSetHash(['abc']), {
        message: 'Invalid UUID',
      })
    })
  })
})
