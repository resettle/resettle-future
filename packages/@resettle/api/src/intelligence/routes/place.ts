import { route } from '@resettle/utils'

export const place = route('place', {
  search: route('search'),
  query: route('query', {
    costOfLiving: route('cost-of-living'),
    generalInfo: route('general-info'),
  }),
})
