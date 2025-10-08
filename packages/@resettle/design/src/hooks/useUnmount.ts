import * as React from 'react'

/**
 * Custom hook that runs a cleanup function when the component is unmounted.
 * @param cb - The cleanup function to be executed on unmount.
 */
export const useUnmount = (cb: () => void) => {
  const funcRef = React.useRef(cb)

  funcRef.current = cb

  React.useEffect(
    () => () => {
      funcRef.current()
    },
    [],
  )
}
