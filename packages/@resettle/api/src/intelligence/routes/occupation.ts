import { route } from '@resettle/utils'

export const occupation = route('occupation', {
  openapi: route('openapi'),
  crosswalk: route('crosswalk'),
  query: route('query'),
  search: route('search'),
})
