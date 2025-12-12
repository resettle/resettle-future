import { route } from '@resettle/utils'

export const PAGE_ROUTES = {
  index: route(''),
  dev: route('dev'),
  auth: route('auth', {
    signIn: route('sign-in'),
    signOut: route('sign-out'),
  }),
  blog: route('blog', {
    slug: route(':slug'),
    page: route('page', {
      page: route(':page'),
    }),
    tag: route('tag', {
      tag: route(':tag'),
    }),
  }),
  terms: route('terms'),
  privacy: route('privacy'),
} as const
