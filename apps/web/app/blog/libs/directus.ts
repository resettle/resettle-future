/**
 * Fetch data from the Directus API
 * @param path - The path to the Directus API
 * @param options - The options for the fetch request
 * @returns The response from the Directus API
 */
export const directusFetch = async <T>(
  path: string,
  options: RequestInit = {},
): Promise<T> => {
  const baseURL =
    import.meta.env.VITE_SERVER_DIRECTUS_API_BASE_URL ||
    process.env.VITE_SERVER_DIRECTUS_API_BASE_URL

  const token =
    import.meta.env.VITE_SERVER_DIRECTUS_API_TOKEN ||
    process.env.VITE_SERVER_DIRECTUS_API_TOKEN

  const response = await fetch(`${baseURL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
      ...options.headers,
    },
  })

  if (!response.ok) {
    throw new Error(
      `Failed to fetch ${path}: ${response.status} ${response.statusText}`,
    )
  }

  return response.json<T>()
}
