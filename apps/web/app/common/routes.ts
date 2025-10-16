import { route } from '@resettle/utils'

export const PAGE_ROUTES = {
  index: route(''),
  auth: route('auth', {
    signIn: route('sign-in'),
    signOut: route('sign-out'),
  }),
  blog: route('blog', {
    id: route(':blogId'),
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
