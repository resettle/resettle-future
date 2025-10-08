import * as React from 'react'

import { useIsMounted } from './useIsMounted'
import { useIsomorphicLayoutEffect } from './useIsomorphicLayoutEffect'

/**
 * Custom hook that returns the current window height and updates when the window is resized.
 * Uses a safe approach that works with SSR and handles component mounting state.
 * @returns The current window height in pixels
 * @example
 * ```tsx
 * const height = useWindowHeight();
 * console.log(`The current window height is ${height}px`);
 * ```
 */
export const useWindowHeight = (): number => {
  const isMounted = useIsMounted()

  const [height, setHeight] = React.useState(
    typeof window !== 'undefined' ? window.innerHeight : 0,
  )

  const handleResize = React.useCallback(() => {
    if (!isMounted) return

    setHeight(window.innerHeight)
  }, [isMounted])

  useIsomorphicLayoutEffect(() => {
    if (isMounted) {
      window.addEventListener('resize', handleResize)
      handleResize()
      return () => window.removeEventListener('resize', handleResize)
    }

    return () => {}
  }, [isMounted, handleResize])

  return height
}
