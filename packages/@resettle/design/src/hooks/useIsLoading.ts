import * as React from 'react'

export type HandleLoadingOptions = {
  minElapsedTime?: number
  persistLoadingState?: boolean
}

/**
 * Custom hook that provides loading state management functionality.
 * @param initialState - The initial loading state.
 * @returns An object containing the current loading state, a function to set the loading state, and a function to handle async operations with loading state.
 */
export const useIsLoading = (initialState = false) => {
  const [isLoading, setIsLoading] = React.useState(initialState)

  /**
   * Executes an async function while managing loading state with an optional minimum elapsed time.
   * @template T - The return type of the async function.
   * @param fn - The async function to execute.
   * @param options - Options for controlling loading behavior.
   * @returns The result of the async function.
   */
  const handleLoading = React.useCallback(
    async <T>(fn: () => Promise<T>, options: HandleLoadingOptions = {}) => {
      const { minElapsedTime = 500, persistLoadingState = false } = options

      try {
        setIsLoading(true)

        if (minElapsedTime > 0) {
          const [result] = await Promise.all([
            fn(),
            new Promise(resolve => setTimeout(resolve, minElapsedTime)),
          ])

          return result
        }

        return await fn()
      } catch (error) {
        setIsLoading(false)
        throw error
      } finally {
        if (!persistLoadingState) {
          setIsLoading(false)
        }
      }
    },
    [],
  )

  return { isLoading, setIsLoading, handleLoading }
}
