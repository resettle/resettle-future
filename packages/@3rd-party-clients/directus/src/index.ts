export class DirectusClient {
  private readonly baseURL: string
  private readonly token: string

  /**
   * Creates a new Directus client
   * @param opts - The options for the client
   * @param opts.baseURL - The base URL of the Directus API
   * @param opts.token - The token for the Directus API
   */
  constructor(opts: { baseURL: string; token: string }) {
    this.baseURL = opts.baseURL
    this.token = opts.token
  }

  /**
   *
   * @param path - The path to the Directus API
   * @param options - The options for the request
   * @returns The response from the Directus API
   */
  async request<T>(path: string, options: RequestInit = {}): Promise<T> {
    console.log('[directus-client] requesting', `${this.baseURL}${path}`)
    console.log('[directus-client] token', this.token)
    console.log()

    const response = await fetch(`${this.baseURL}${path}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.token}`,
        ...options.headers,
      },
    })

    if (!response.ok) {
      throw new Error(
        `[directus-client] Failed to request ${path}: ${response.status} ${response.statusText}`,
      )
    }

    return response.json()
  }
}
