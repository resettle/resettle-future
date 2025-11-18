import { route } from '@resettle/utils'

export const users = route('users', {
  id: route(':userId', {
    username: route('username'),
    metadata: route('metadata'),
    profile: route('profile'),
  }),
})
