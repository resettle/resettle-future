import * as React from 'react'

/**
 * A hook that returns a debounced version of the provided value.
 * The debounced value will only update after the specified delay has passed
 * without the original value changing.
 *
 * @param value The value to debounce
 * @param delay The delay in milliseconds (default: 500ms)
 * @returns The debounced value
 */
export const useDebouncedValue = <T>(value: T, delay = 500): T => {
  // Store the debounced value
  const [debouncedValue, setDebouncedValue] = React.useState<T>(value)

  React.useEffect(() => {
    // Set up a timer to update the debounced value after the specified delay
    const timer = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    // If the value changes before the delay has passed, clear the timeout
    // This is the cleanup function that runs when the dependency array changes
    return () => {
      clearTimeout(timer)
    }
  }, [value, delay])

  return debouncedValue
}
