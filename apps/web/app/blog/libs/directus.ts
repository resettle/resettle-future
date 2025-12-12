import { DirectusClient } from '@3rd-party-clients/directus'

const baseURL =
  import.meta.env.VITE_SERVER_DIRECTUS_API_BASE_URL ||
  process.env.VITE_SERVER_DIRECTUS_API_BASE_URL

const token =
  import.meta.env.VITE_SERVER_DIRECTUS_API_TOKEN ||
  process.env.VITE_SERVER_DIRECTUS_API_TOKEN

export const directusClient = new DirectusClient({
  baseURL,
  token,
})
