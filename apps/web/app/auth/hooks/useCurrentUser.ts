import { unstable_useRoute } from 'react-router'

export default function useCurrentUser() {
  const { loaderData } = unstable_useRoute('root')
  const { currentUser } = loaderData || {}

  return currentUser
}
