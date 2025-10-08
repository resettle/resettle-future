import * as React from 'react'

/**
 * Custom hook that uses useLayoutEffect when running in the browser,
 * and falls back to useEffect when running on the server.
 * This prevents warnings when using useLayoutEffect in SSR environments.
 * @returns A React effect hook that works isomorphically in both browser and server environments.
 */
export const useIsomorphicLayoutEffect =
  typeof window !== 'undefined' ? React.useLayoutEffect : React.useEffect
