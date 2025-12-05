import { route } from '@resettle/utils'

export const tag = route('tag', {
  attach: route('attach'),
  detach: route('detach'),
  search: route('search'),
})
