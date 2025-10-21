import useCurrentUser from './useCurrentUser'

export default function useCurrentUserRequired() {
  const currentUser = useCurrentUser()

  if (!currentUser) {
    throw new Error('Current user not found')
  }

  return currentUser
}
