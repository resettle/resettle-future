import * as React from 'react'

import { useIsMounted } from './useIsMounted'
import { useIsomorphicLayoutEffect } from './useIsomorphicLayoutEffect'

/**
 * Custom hook that returns the current window width and updates when the window is resized.
 * Uses a safe approach that works with SSR and handles component mounting state.
 * @returns The current window width in pixels
 * @example
 * ```tsx
 * const width = useWindowWidth();
 * console.log(`The current window width is ${width}px`);
 * ```
 */
export const useWindowWidth = (): number => {
  const isMounted = useIsMounted()

  const [width, setWidth] = React.useState(
    typeof window !== 'undefined' ? window.innerWidth : 0,
  )

  const handleResize = React.useCallback(() => {
    if (!isMounted) return

    setWidth(window.innerWidth)
  }, [isMounted])

  useIsomorphicLayoutEffect(() => {
    if (isMounted) {
      window.addEventListener('resize', handleResize)
      handleResize()
      return () => window.removeEventListener('resize', handleResize)
    }

    return () => {}
  }, [isMounted, handleResize])

  return width
}
