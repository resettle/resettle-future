import { z } from 'zod'

import type { Client } from './common'

export const scoreSchema = z.object({
  Id: z.string(),
  Score: z.number(),
})

export type Score = z.infer<typeof scoreSchema>

export const getCollaborativeFilteringRecommendation = async (
  client: Client,
  userId: string,
  opts?: {
    n?: number
    offset?: number
  },
) => {
  const params = new URLSearchParams()
  if (opts && typeof opts.n !== 'undefined') {
    params.set('n', opts.n.toString())
  }

  if (opts && typeof opts.offset !== 'undefined') {
    params.set('offset', opts.offset.toString())
  }

  const paramsString = params.toString()

  const resp = await fetch(
    `${client.endpoint}/api/collaborative-filtering/${userId}${paramsString.length === 0 ? '' : `?${paramsString}`}`,
  )

  return (await resp.json()) as Score[]
}

export const getCollaborativeFilteringRecommendationOfCategory = async (
  client: Client,
  userId: string,
  category: string,
  opts?: {
    n?: number
    offset?: number
  },
) => {
  const params = new URLSearchParams()
  if (opts && typeof opts.n !== 'undefined') {
    params.set('n', opts.n.toString())
  }

  if (opts && typeof opts.offset !== 'undefined') {
    params.set('offset', opts.offset.toString())
  }

  const paramsString = params.toString()

  const resp = await fetch(
    `${client.endpoint}/api/collaborative-filtering/${userId}/${category}${paramsString.length === 0 ? '' : `?${paramsString}`}`,
  )

  return (await resp.json()) as Score[]
}

export const getLatestRecommendation = async (
  client: Client,
  opts?: {
    userId?: string
    category?: string
    n?: number
    offset?: number
  },
) => {
  const params = new URLSearchParams()
  if (opts && typeof opts.n !== 'undefined') {
    params.set('n', opts.n.toString())
  }

  if (opts && typeof opts.offset !== 'undefined') {
    params.set('offset', opts.offset.toString())
  }

  if (opts && typeof opts.userId !== 'undefined') {
    params.set('user-id', opts.userId)
  }

  if (opts && typeof opts.category !== 'undefined') {
    params.set('category', opts.category)
  }

  const paramsString = params.toString()

  const resp = await fetch(
    `${client.endpoint}/api/latest${paramsString.length === 0 ? '' : `?${paramsString}`}`,
  )

  return (await resp.json()) as Score[]
}

export const getItemNeighbors = async (
  client: Client,
  itemId: string,
  opts?: {
    n?: number
    offset?: number
  },
) => {
  const params = new URLSearchParams()
  if (opts && typeof opts.n !== 'undefined') {
    params.set('n', opts.n.toString())
  }

  if (opts && typeof opts.offset !== 'undefined') {
    params.set('offset', opts.offset.toString())
  }

  const paramsString = params.toString()

  const resp = await fetch(
    `${client.endpoint}/api/item/${itemId}/neighbors${paramsString.length === 0 ? '' : `?${paramsString}`}`,
  )

  return (await resp.json()) as Score[]
}

export const getItemNeighborsOfCategory = async (
  client: Client,
  itemId: string,
  category: string,
  opts?: {
    n?: number
    offset?: number
  },
) => {
  const params = new URLSearchParams()
  if (opts && typeof opts.n !== 'undefined') {
    params.set('n', opts.n.toString())
  }

  if (opts && typeof opts.offset !== 'undefined') {
    params.set('offset', opts.offset.toString())
  }

  const paramsString = params.toString()

  const resp = await fetch(
    `${client.endpoint}/api/item/${itemId}/neighbors/${category}${paramsString.length === 0 ? '' : `?${paramsString}`}`,
  )

  return (await resp.json()) as Score[]
}

export const getUserNeighbors = async (
  client: Client,
  userId: string,
  opts?: {
    n?: number
    offset?: number
  },
) => {
  const params = new URLSearchParams()
  if (opts && typeof opts.n !== 'undefined') {
    params.set('n', opts.n.toString())
  }

  if (opts && typeof opts.offset !== 'undefined') {
    params.set('offset', opts.offset.toString())
  }

  const paramsString = params.toString()

  const resp = await fetch(
    `${client.endpoint}/api/user/${userId}/neighbors${paramsString.length === 0 ? '' : `?${paramsString}`}`,
  )

  return (await resp.json()) as Score[]
}

export const getGeneralRecommendation = async (
  client: Client,
  userId: string,
  opts?: {
    category?: string
    n?: number
    offset?: number
  },
) => {
  const params = new URLSearchParams()
  if (opts && typeof opts.n !== 'undefined') {
    params.set('n', opts.n.toString())
  }

  if (opts && typeof opts.offset !== 'undefined') {
    params.set('offset', opts.offset.toString())
  }

  if (opts && typeof opts.category !== 'undefined') {
    params.set('category', opts.category)
  }

  const paramsString = params.toString()

  const resp = await fetch(
    `${client.endpoint}/api/recommend/${userId}${paramsString.length === 0 ? '' : `?${paramsString}`}`,
  )

  return (await resp.json()) as string[]
}
