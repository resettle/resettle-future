/**
 * Create a map of items by their id
 * @param items - The items to map
 * @returns A map of items by their id
 */
export const idMap = <T extends { id: string }>(items: T[]): Map<string, T> => {
  return items.reduce((acc, item) => {
    acc.set(item.id, item)
    return acc
  }, new Map<string, T>())
}

/**
 * Create a map of items by their index keys
 * @param items - The items to map
 * @param getIndexKeyFn - The function to get the index key from the item
 * @returns A map of items by their index keys
 */
export const indexMap = <T>(
  items: T[],
  indexKeyFn: (item: T) => string,
): Map<string, T> => {
  return items.reduce((acc, item) => {
    acc.set(indexKeyFn(item), item)
    return acc
  }, new Map<string, T>())
}

/**
 * Create a map of items by their index keys asynchronously
 * @param items - The items to map
 * @param indexKeyFn - The function to get the index key from the item
 * @returns A map of items by their index keys
 */
export const indexMapAsync = async <T>(
  items: T[],
  indexKeyFn: (item: T) => Promise<string>,
): Promise<Map<string, T>> => {
  return (
    await Promise.all(
      items.map(async item => [item, await indexKeyFn(item)] as const),
    )
  ).reduce((acc, [item, key]) => {
    acc.set(key, item)
    return acc
  }, new Map<string, T>())
}
