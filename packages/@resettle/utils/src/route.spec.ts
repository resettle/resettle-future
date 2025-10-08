import assert from 'node:assert'
import { describe, it } from 'node:test'

import { route } from './route'

describe('route', () => {
  const routes = route('', {
    users: route('users', {
      id: route(':userId', {
        posts: route('posts'),
      }),
    }),
    countries: route('countries', {
      code: route(':countryCode'),
    }),
  })

  it('get paths', () => {
    assert.strictEqual(routes.path, '')
    assert.strictEqual(routes.slashedPath, '/')
    assert.strictEqual(routes.users.id.path, 'users/:userId')
    assert.strictEqual(routes.users.id.relativePath, ':userId')
    assert.strictEqual(routes.users.id.posts.path, 'users/:userId/posts')
    assert.strictEqual(routes.users.id.posts.relativePath, 'posts')
  })

  it('build paths', () => {
    assert.strictEqual(
      routes.users.id.posts.buildPath({ userId: '1' }),
      'users/1/posts',
    )

    assert.strictEqual(
      routes.users.id.posts.buildPrefix({ userId: '1' }),
      'users/1/posts/*',
    )

    assert.strictEqual(
      routes.users.id.posts.buildSlashedPath({ userId: '1' }),
      '/users/1/posts',
    )

    assert.strictEqual(
      routes.users.id.posts.buildSlashedPrefix({ userId: '1' }),
      '/users/1/posts/*',
    )

    assert.strictEqual(
      routes.countries.code.buildPath({ countryCode: 'us' }),
      'countries/us',
    )

    assert.strictEqual(
      routes.countries.code.buildPrefix({ countryCode: 'us' }),
      'countries/us/*',
    )

    assert.strictEqual(
      routes.countries.buildSlashedPath({
        variant: 'visa',
      }),
      '/countries?variant=visa',
    )

    assert.strictEqual(
      routes.countries.code.buildSlashedPath(
        { countryCode: 'us' },
        { variant: 'visa' },
      ),
      '/countries/us?variant=visa',
    )
  })
})
