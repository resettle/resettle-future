import assert from 'node:assert'
import { afterEach, beforeEach, describe, it, mock } from 'node:test'

import { promisePlainObject, sleepMs } from './promise'

describe('promise utilities', () => {
  describe('sleepMs', () => {
    beforeEach(() => {
      mock.timers.enable({ apis: ['setTimeout'] })
    })

    afterEach(() => {
      mock.timers.reset()
    })

    it('should resolve after the specified number of milliseconds', async () => {
      const promise = sleepMs(5)
      mock.timers.tick(5)
      await assert.doesNotReject(promise)
      assert.strictEqual(await promise, undefined)
    })

    it('should handle zero milliseconds', async () => {
      const promise = sleepMs(0)
      mock.timers.tick(0)
      await assert.doesNotReject(promise)
      assert.strictEqual(await promise, undefined)
    })
  })

  describe('promisePlainObject', () => {
    it('should resolve all promises and return results in object format', async () => {
      const promises = {
        a: Promise.resolve(1),
        b: Promise.resolve('hello'),
        c: Promise.resolve(true),
      }

      const result = await promisePlainObject(promises)

      assert.deepStrictEqual(result, {
        a: 1,
        b: 'hello',
        c: true,
      })
    })

    it('should handle empty object', async () => {
      const result = await promisePlainObject({})
      assert.deepStrictEqual(result, {})
    })

    it('should handle promises that resolve at different times', async () => {
      mock.timers.enable({ apis: ['setTimeout'] })

      const promises = {
        fast: new Promise(resolve => setTimeout(() => resolve('fast'), 1)),
        slow: new Promise(resolve => setTimeout(() => resolve('slow'), 2)),
      }

      const resultPromise = promisePlainObject(promises)
      mock.timers.tick(2)
      const result = await resultPromise

      assert.deepStrictEqual(result, {
        fast: 'fast',
        slow: 'slow',
      })

      mock.timers.reset()
    })

    it('should reject if any promise rejects', async () => {
      const promises = {
        success: Promise.resolve('ok'),
        failure: Promise.reject(new Error('failed')),
      }

      await assert.rejects(promisePlainObject(promises), { message: 'failed' })
    })
  })
})
