import * as React from 'react'

import { useHasError } from './useHasError'
import { useIsLoading, type HandleLoadingOptions } from './useIsLoading'

export const usePromiseFn = <T>(promiseFn: () => Promise<T>) => {
  const { error, handleError } = useHasError()
  const { isLoading, handleLoading } = useIsLoading()

  const handlePromiseFn = React.useCallback(
    async (options: HandleLoadingOptions = {}) => {
      return handleError(() => handleLoading(promiseFn, options))
    },
    [handleLoading, handleError, promiseFn],
  )

  return {
    handlePromiseFn,
    isLoading,
    error,
  }
}
