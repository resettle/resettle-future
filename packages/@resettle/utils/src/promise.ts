/**
 * Sleep for a given number of milliseconds
 * @param ms - The number of milliseconds to sleep
 * @returns A promise that resolves after the given number of milliseconds
 */
export const sleepMs = (ms: number): Promise<void> => {
  return new Promise(resolve => setTimeout(resolve, ms))
}

/**
 * Wait for all promises to resolve and return the results in a plain object
 * @param promises - The promises to wait for
 * @returns A promise that resolves to the results of the promises
 */
export const promisePlainObject = async <
  T extends Record<string, Promise<unknown>>,
>(
  promises: T,
): Promise<{ [K in keyof T]: Awaited<T[K]> }> => {
  const result = await Promise.all(Object.values(promises))

  return Object.fromEntries(
    Object.entries(promises).map(([key], index) => [key, result[index]]),
  ) as { [K in keyof T]: Awaited<T[K]> }
}
