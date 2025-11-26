import { route } from '@resettle/utils'

export const user = route('user', {
  delete: route('delete'),
})
