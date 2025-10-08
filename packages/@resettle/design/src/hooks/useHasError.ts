import * as React from 'react'

/**
 * A hook that provides error handling functionality.
 * @returns An object containing the current error state, a function to set the error, and a function to handle async errors.
 */
export const useHasError = () => {
  const [error, setError] = React.useState<string | null>(null)

  /**
   * Executes an async function and handles any errors that occur.
   * @template T - The return type of the async function.
   * @param fn - The async function to execute.
   * @returns The result of the async function if successful.
   * @throws Rethrows the caught error after setting the error state.
   */
  const handleError = React.useCallback(async <T>(fn: () => Promise<T>) => {
    try {
      return await fn()
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message)
      } else {
        setError('An unknown error occurred')
      }

      throw error
    }
  }, [])

  return { error, setError, handleError }
}
