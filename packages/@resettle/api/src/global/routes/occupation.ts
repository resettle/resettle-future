import { route } from '@resettle/utils'

export const occupation = route('occupation', {
  crosswalk: route('crosswalk'),
  query: route('query'),
  search: route('search'),
})
