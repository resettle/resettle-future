import assert from 'node:assert'
import { describe, it } from 'node:test'

import { cursorPaginated, offsetPaginated } from './pagination'

describe('offsetPaginated', () => {
  it('should return the correct offset pagination', () => {
    const pagination = offsetPaginated([], {
      limit: 10,
      orderBy: 'id',
      orderByDirection: 'asc',
      totalResults: 100,
      page: 2,
    })

    assert.deepStrictEqual(pagination, {
      metadata: {
        limit: 10,
        order_by: 'id',
        order_by_direction: 'asc',
        total_pages: 10,
        page: 2,
        next_page: 3,
        previous_page: 1,
      },
      data: [],
    })
  })
})

describe('cursorPaginated', () => {
  it('should return the correct cursor pagination', () => {
    const pagination = cursorPaginated(
      [
        { id: 1, name: 'John' },
        { id: 2, name: 'Jane' },
        { id: 3, name: 'Jim' },
        { id: 4, name: 'Jill' },
        { id: 5, name: 'Jack' },
        { id: 6, name: 'Jill' },
        { id: 7, name: 'Jim' },
        { id: 8, name: 'Jill' },
        { id: 9, name: 'Jim' },
        { id: 10, name: 'Jack' },
      ],
      {
        limit: 10,
        orderBy: 'id',
        orderByDirection: 'asc',
        cursor: null,
      },
    )

    assert.deepStrictEqual(pagination, {
      metadata: {
        limit: 10,
        order_by: 'id',
        order_by_direction: 'asc',
        cursor: null,
        next_cursor: 10,
      },
      data: [
        { id: 1, name: 'John' },
        { id: 2, name: 'Jane' },
        { id: 3, name: 'Jim' },
        { id: 4, name: 'Jill' },
        { id: 5, name: 'Jack' },
        { id: 6, name: 'Jill' },
        { id: 7, name: 'Jim' },
        { id: 8, name: 'Jill' },
        { id: 9, name: 'Jim' },
        { id: 10, name: 'Jack' },
      ],
    })
  })
})
