import assert from 'node:assert'
import { describe, it } from 'node:test'

import { idMap, indexMap, indexMapAsync } from './item-map'

describe('item-map', () => {
  describe('idMap', () => {
    it('should create an empty map for empty array', () => {
      const result = idMap([])
      assert.strictEqual(result.size, 0)
    })

    it('should map items by their id', () => {
      const items = [
        { id: 'a', name: 'Alice' },
        { id: 'b', name: 'Bob' },
        { id: 'c', name: 'Charlie' },
      ]

      const result = idMap(items)

      assert.strictEqual(result.size, 3)
      assert.deepStrictEqual(result.get('a'), { id: 'a', name: 'Alice' })
      assert.deepStrictEqual(result.get('b'), { id: 'b', name: 'Bob' })
      assert.deepStrictEqual(result.get('c'), { id: 'c', name: 'Charlie' })
    })

    it('should handle duplicate ids by overwriting previous entries', () => {
      const items = [
        { id: 'a', name: 'Alice' },
        { id: 'a', name: 'Andrew' },
      ]

      const result = idMap(items)

      assert.strictEqual(result.size, 1)
      assert.deepStrictEqual(result.get('a'), { id: 'a', name: 'Andrew' })
    })

    it('should work with objects having additional properties', () => {
      const items = [{ id: '1', name: 'Test', active: true, count: 42 }]

      const result = idMap(items)

      assert.deepStrictEqual(result.get('1'), {
        id: '1',
        name: 'Test',
        active: true,
        count: 42,
      })
    })
  })

  describe('indexMap', () => {
    it('should create an empty map for empty array', () => {
      const result = indexMap([], (item: any) => item.key)
      assert.strictEqual(result.size, 0)
    })

    it('should map items by index key function', () => {
      const items = [
        { name: 'Alice', age: 25 },
        { name: 'Bob', age: 30 },
        { name: 'Charlie', age: 35 },
      ]

      const result = indexMap(items, item => item.name)

      assert.strictEqual(result.size, 3)
      assert.deepStrictEqual(result.get('Alice'), { name: 'Alice', age: 25 })
      assert.deepStrictEqual(result.get('Bob'), { name: 'Bob', age: 30 })
      assert.deepStrictEqual(result.get('Charlie'), {
        name: 'Charlie',
        age: 35,
      })
    })

    it('should handle complex index key functions', () => {
      const items = [
        { firstName: 'John', lastName: 'Doe', age: 25 },
        { firstName: 'Jane', lastName: 'Smith', age: 30 },
      ]

      const result = indexMap(
        items,
        item => `${item.firstName}-${item.lastName}`,
      )

      assert.strictEqual(result.size, 2)
      assert.deepStrictEqual(result.get('John-Doe'), {
        firstName: 'John',
        lastName: 'Doe',
        age: 25,
      })
      assert.deepStrictEqual(result.get('Jane-Smith'), {
        firstName: 'Jane',
        lastName: 'Smith',
        age: 30,
      })
    })

    it('should handle duplicate keys by overwriting previous entries', () => {
      const items = [
        { name: 'Alice', version: 1 },
        { name: 'Alice', version: 2 },
      ]

      const result = indexMap(items, item => item.name)

      assert.strictEqual(result.size, 1)
      assert.deepStrictEqual(result.get('Alice'), { name: 'Alice', version: 2 })
    })

    it('should work with numeric keys', () => {
      const items = [
        { value: 'first', priority: 1 },
        { value: 'second', priority: 2 },
      ]

      const result = indexMap(items, item => item.priority.toString())

      assert.deepStrictEqual(result.get('1'), { value: 'first', priority: 1 })
      assert.deepStrictEqual(result.get('2'), { value: 'second', priority: 2 })
    })
  })

  describe('indexMapAsync', () => {
    it('should create an empty map for empty array', async () => {
      const result = await indexMapAsync([], async (item: any) => item.key)
      assert.strictEqual(result.size, 0)
    })

    it('should map items by async index key function', async () => {
      const items = [
        { name: 'Alice', age: 25 },
        { name: 'Bob', age: 30 },
        { name: 'Charlie', age: 35 },
      ]

      const result = await indexMapAsync(items, async item =>
        Promise.resolve(item.name),
      )

      assert.strictEqual(result.size, 3)
      assert.deepStrictEqual(result.get('Alice'), { name: 'Alice', age: 25 })
      assert.deepStrictEqual(result.get('Bob'), { name: 'Bob', age: 30 })
      assert.deepStrictEqual(result.get('Charlie'), {
        name: 'Charlie',
        age: 35,
      })
    })

    it('should handle complex async index key functions', async () => {
      const items = [
        { firstName: 'John', lastName: 'Doe', age: 25 },
        { firstName: 'Jane', lastName: 'Smith', age: 30 },
      ]

      const result = await indexMapAsync(items, async item =>
        Promise.resolve(`${item.firstName}-${item.lastName}`),
      )

      assert.strictEqual(result.size, 2)
      assert.deepStrictEqual(result.get('John-Doe'), {
        firstName: 'John',
        lastName: 'Doe',
        age: 25,
      })
      assert.deepStrictEqual(result.get('Jane-Smith'), {
        firstName: 'Jane',
        lastName: 'Smith',
        age: 30,
      })
    })

    it('should handle duplicate keys by overwriting previous entries', async () => {
      const items = [
        { name: 'Alice', version: 1 },
        { name: 'Alice', version: 2 },
      ]

      const result = await indexMapAsync(items, async item =>
        Promise.resolve(item.name),
      )

      assert.strictEqual(result.size, 1)
      assert.deepStrictEqual(result.get('Alice'), { name: 'Alice', version: 2 })
    })

    it('should work with async operations that have delays', async () => {
      const items = [
        { id: 1, data: 'first' },
        { id: 2, data: 'second' },
      ]

      const result = await indexMapAsync(items, async item => {
        // Simulate async operation with delay
        await new Promise(resolve => setTimeout(resolve, 10))
        return `item-${item.id}`
      })

      assert.strictEqual(result.size, 2)
      assert.deepStrictEqual(result.get('item-1'), { id: 1, data: 'first' })
      assert.deepStrictEqual(result.get('item-2'), { id: 2, data: 'second' })
    })

    it('should handle async key functions that return numeric strings', async () => {
      const items = [
        { value: 'first', priority: 1 },
        { value: 'second', priority: 2 },
      ]

      const result = await indexMapAsync(items, async item =>
        Promise.resolve(item.priority.toString()),
      )

      assert.deepStrictEqual(result.get('1'), { value: 'first', priority: 1 })
      assert.deepStrictEqual(result.get('2'), { value: 'second', priority: 2 })
    })

    it('should handle async key functions that might reject', async () => {
      const items = [
        { name: 'valid', shouldFail: false },
        { name: 'invalid', shouldFail: true },
      ]

      const asyncKeyFn = async (item: (typeof items)[0]) => {
        if (item.shouldFail) {
          throw new Error('Key generation failed')
        }
        return Promise.resolve(item.name)
      }

      await assert.rejects(indexMapAsync(items, asyncKeyFn), {
        message: 'Key generation failed',
      })
    })

    it('should process all items concurrently', async () => {
      const items = [
        { id: 1, delay: 50 },
        { id: 2, delay: 30 },
        { id: 3, delay: 40 },
      ]

      const startTime = Date.now()

      const result = await indexMapAsync(items, async item => {
        await new Promise(resolve => setTimeout(resolve, item.delay))
        return `id-${item.id}`
      })

      const endTime = Date.now()
      const totalTime = endTime - startTime

      // Should complete in roughly the time of the longest delay (50ms)
      // rather than the sum of all delays (120ms), proving concurrency
      assert.ok(totalTime < 100) // Allow some buffer for test execution
      assert.strictEqual(result.size, 3)
      assert.deepStrictEqual(result.get('id-1'), { id: 1, delay: 50 })
      assert.deepStrictEqual(result.get('id-2'), { id: 2, delay: 30 })
      assert.deepStrictEqual(result.get('id-3'), { id: 3, delay: 40 })
    })
  })
})
