import * as React from 'react'

import type { HandleLoadingOptions } from './useIsLoading'
import { usePromiseFn } from './usePromiseFn'

type UsePromiseValueResult<T> =
  | { isLoading: true }
  | {
      isLoading: false
      value: T
    }
  | {
      isLoading: false
      error: string
    }

export const usePromiseValue = <T>(
  promiseFn: () => Promise<T>,
  options: HandleLoadingOptions = {},
) => {
  const [value, setValue] = React.useState<T>()

  const { handlePromiseFn, isLoading, error } = usePromiseFn(promiseFn)

  const trigger = React.useCallback(async () => {
    const result = await handlePromiseFn(options)

    setValue(result)
  }, [handlePromiseFn, options])

  React.useEffect(() => {
    trigger()
  }, [trigger])

  return {
    isLoading,
    value,
    error,
  } as UsePromiseValueResult<T>
}
