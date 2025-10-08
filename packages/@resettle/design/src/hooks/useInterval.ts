import * as React from 'react'

import { useIsomorphicLayoutEffect } from './useIsomorphicLayoutEffect'

/**
 * Custom hook that creates an interval that invokes a callback function at a specified delay
 * @param callback - The function to be invoked at each interval.
 * @param delay - The time, in milliseconds, between each invocation of the callback. Use `null` to clear the interval.
 * @example
 * ```tsx
 * const handleInterval = () => {
 *   // Code to be executed at each interval
 * };
 * useInterval(handleInterval, 1000);
 * ```
 */
export function useInterval(callback: () => void, delay: number | null) {
  const savedCallback = React.useRef(callback)

  // Remember the latest callback if it changes.
  useIsomorphicLayoutEffect(() => {
    savedCallback.current = callback
  }, [callback])

  // Set up the interval.
  React.useEffect(() => {
    // Don't schedule if no delay is specified.
    // Note: 0 is a valid value for delay.
    if (delay === null) {
      return
    }

    const id = setInterval(() => {
      savedCallback.current()
    }, delay)

    return () => {
      clearInterval(id)
    }
  }, [delay])
}
