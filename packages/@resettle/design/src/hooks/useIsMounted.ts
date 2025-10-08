import * as React from 'react'

import { useIsomorphicLayoutEffect } from './useIsomorphicLayoutEffect'

/**
 * Custom hook that tracks whether a component is mounted.
 * Returns true after the component has mounted.
 * @returns A boolean indicating if the component is mounted.
 */
export const useIsMounted = (): boolean => {
  const [isMounted, setIsMounted] = React.useState(false)

  useIsomorphicLayoutEffect(() => {
    setIsMounted(true)
  }, [])

  return isMounted
}
