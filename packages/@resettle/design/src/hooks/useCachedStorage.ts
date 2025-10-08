import * as React from 'react'

const IS_SERVER = typeof window === 'undefined'

type StorageType = 'localStorage' | 'sessionStorage'

interface CachedStorageItem<T> {
  value: T
  expiry?: number // Timestamp in milliseconds
}

/**
 * Retrieves an item from the specified storage.
 * Handles server-side rendering, JSON parsing, base64 decoding, and TTL expiry.
 */
const getItem = <T>(
  key: string,
  defaultValue: T,
  storageType: StorageType,
  base64: boolean,
): T => {
  if (IS_SERVER) {
    return defaultValue
  }

  const storage =
    storageType === 'localStorage' ? window.localStorage : window.sessionStorage

  const rawItem = storage.getItem(key)

  if (rawItem === null) {
    return defaultValue
  }

  try {
    const decodedItem = base64 ? atob(rawItem) : rawItem
    const parsedItem: CachedStorageItem<T> = JSON.parse(decodedItem)

    // Check TTL
    if (parsedItem.expiry && parsedItem.expiry < Date.now()) {
      storage.removeItem(key) // Remove expired item
      return defaultValue
    }

    return parsedItem.value
  } catch (error) {
    console.error(`Error reading ${storageType} key "${key}":`, error)
    storage.removeItem(key) // Remove corrupted item
    return defaultValue
  }
}

/**
 * Stores an item in the specified storage.
 * Handles server-side rendering, JSON stringifying, base64 encoding, and setting TTL.
 */
const setItem = <T>(
  key: string,
  value: T,
  storageType: StorageType,
  ttl: number | undefined, // TTL in milliseconds
  base64: boolean,
) => {
  if (IS_SERVER) {
    return
  }

  const storage =
    storageType === 'localStorage' ? window.localStorage : window.sessionStorage

  const itemToStore: CachedStorageItem<T> = {
    value,
    expiry: ttl ? Date.now() + ttl : undefined,
  }

  try {
    const stringifiedItem = JSON.stringify(itemToStore)
    const encodedItem = base64 ? btoa(stringifiedItem) : stringifiedItem

    storage.setItem(key, encodedItem)
  } catch (error) {
    console.error(`Error setting ${storageType} key "${key}":`, error)
  }
}

export interface UseCachedStorageOptions<T> {
  /** Storage type: 'localStorage' or 'sessionStorage'. Defaults to 'localStorage'. */
  storageType?: StorageType
  /** Time-to-live in milliseconds. Item will expire after this duration. */
  ttl?: number
  /** Whether to encode/decode the value using Base64. Defaults to false. */
  base64?: boolean
  /**
   * Whether to initialize the value from storage on first render.
   * Defaults to false (initializes with initialValue, then loads from storage).
   * Set to true only in non-SSR environments if immediate initialization is needed.
   */
  initializeWithValue?: boolean
  /** Callback function executed after the value is loaded from storage. */
  onLoad?: (value: T) => void
}

/**
 * Custom hook for managing state in localStorage or sessionStorage with TTL and Base64 options.
 * @template T - The type of the value to be stored.
 * @param key - The key to store the value under.
 * @param initialValue - The initial value to use if no valid value exists in storage.
 * @param options - Configuration options for the hook.
 * @returns A tuple containing the current value and a setter function.
 */
export const useCachedStorage = <T>(
  key: string,
  initialValue: T,
  options: UseCachedStorageOptions<T> = {},
) => {
  const {
    storageType = 'localStorage',
    ttl,
    base64 = false,
    initializeWithValue = false,
    onLoad,
  } = options

  const [isInitialized, setIsInitialized] = React.useState(false)
  const [value, _setValue] = React.useState<T>(() =>
    initializeWithValue
      ? getItem(key, initialValue, storageType, base64)
      : initialValue,
  )

  // Effect to load value from storage after initial render if not initializedWithValue
  React.useEffect(() => {
    if (!initializeWithValue) {
      const loadedValue = getItem(key, initialValue, storageType, base64)

      _setValue(loadedValue)
      onLoad?.(loadedValue)
      setIsInitialized(true)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    key,
    storageType,
    base64,
    initializeWithValue /* initialValue, onLoad not needed */,
  ])

  /**
   * Updates the value in state and the specified storage.
   * @param valueOrFn - The new value or a function that returns the new value based on the previous state.
   */
  const setValue = React.useCallback(
    (valueOrFn: T | ((prev: T) => T)) => {
      const nextValue =
        valueOrFn instanceof Function ? valueOrFn(value) : valueOrFn

      _setValue(nextValue)
      setItem(key, nextValue, storageType, ttl, base64)
    },
    [key, storageType, ttl, base64, value], // Include value in dependencies for the function variant
  )

  // Add event listener to sync state across tabs/windows for the same key
  React.useEffect(() => {
    if (IS_SERVER) return

    const handleStorageChange = (event: StorageEvent) => {
      if (
        event.key === key &&
        event.storageArea ===
          (storageType === 'localStorage'
            ? window.localStorage
            : window.sessionStorage)
      ) {
        // When storage changes in another tab/window, reload the value here
        const newValue = getItem(key, initialValue, storageType, base64)

        if (value !== newValue) {
          // Only update if the value actually changed
          _setValue(newValue)
        }
      }
    }

    window.addEventListener('storage', handleStorageChange)

    return () => {
      window.removeEventListener('storage', handleStorageChange)
    }
  }, [key, storageType, initialValue, base64, value]) // include value to re-attach listener if setter changes comparison behavior

  return [value, setValue, isInitialized] as const
}
