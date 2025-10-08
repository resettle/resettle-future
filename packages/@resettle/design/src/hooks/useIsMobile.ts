import * as React from 'react'

const MOBILE_BREAKPOINT = 768

/**
 * Custom hook that detects if the current viewport width is below the mobile breakpoint.
 * Uses media queries to track viewport changes.
 * @returns A boolean indicating if the current viewport is mobile-sized.
 */
export const useIsMobile = (): boolean => {
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined)

  React.useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)

    const onChange = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    }

    mql.addEventListener('change', onChange)

    setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)

    return () => mql.removeEventListener('change', onChange)
  }, [])

  return !!isMobile
}
