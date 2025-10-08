import * as React from 'react'

/**
 * Custom hook that runs a function when the component is mounted.
 * The callback will only execute once when the component mounts,
 * regardless of dependency changes.
 * @param fn - The function to be executed on mount.
 */
export const useMount = (fn: () => void) => {
  const hasRun = React.useRef(false)

  React.useEffect(() => {
    if (!hasRun.current) {
      fn()
      hasRun.current = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
}
