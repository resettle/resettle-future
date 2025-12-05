import { route } from '@resettle/utils'

export const recommend = route('recommend', {
  byUser: route('by-user'),
  byTags: route('by-tags'),
})
