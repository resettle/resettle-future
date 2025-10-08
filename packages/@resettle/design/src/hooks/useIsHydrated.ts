import * as React from 'react'

/**
 * Custom hook that tracks whether a component is hydrated.
 * Returns true after the component has mounted.
 * @returns A boolean indicating if the component is hydrated.
 */
export const useIsHydrated = () => {
  return React.useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  )
}
