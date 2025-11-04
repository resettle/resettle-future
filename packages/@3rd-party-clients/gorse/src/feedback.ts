import { z } from 'zod'

import { getHeaders, type Client } from './common'

const feedbackSchema = z.object({
  FeedbackType: z.string(),
  UserId: z.string(),
  ItemId: z.string(),
  Value: z.number(),
  Timestamp: z.coerce.date(),
  Comment: z.string().optional(),
})

const feedbackIteratorSchema = z.object({
  Cursor: z.string().optional(),
  feedback: z.array(feedbackSchema),
})

export type Feedback = z.infer<typeof feedbackSchema>
export type FeedbackIterator = z.infer<typeof feedbackIteratorSchema>

export const insertFeedback = (client: Client, feedback: Feedback[]) =>
  fetch(`${client.endpoint}/api/feedback`, {
    method: 'POST',
    body: JSON.stringify(feedback),
    headers: getHeaders(client.apiKey),
  })

export const getFeedback = async (
  client: Client,
  n?: number,
  cursor?: string,
) => {
  const params = new URLSearchParams()
  if (typeof n !== 'undefined') {
    params.set('n', n.toString())
  }

  if (typeof cursor !== 'undefined') {
    params.set('cursor', cursor)
  }

  const paramsString = params.toString()

  const resp = await fetch(
    `${client.endpoint}/api/feedback${paramsString.length === 0 ? '' : `?${paramsString}`}`,
    {
      method: 'GET',
      headers: getHeaders(client.apiKey),
    },
  )

  return (await resp.json()) as FeedbackIterator
}

export const updateFeedback = (client: Client, feedback: Feedback[]) =>
  fetch(`${client.endpoint}/api/feedback`, {
    method: 'PUT',
    body: JSON.stringify(feedback),
    headers: getHeaders(client.apiKey),
  })

export const getFeedbackBetweenUserItem = async (
  client: Client,
  userId: string,
  itemId: string,
) => {
  const resp = await fetch(
    `${client.endpoint}/api/feedback/${userId}/${itemId}`,
    {
      method: 'GET',
      headers: getHeaders(client.apiKey),
    },
  )

  return (await resp.json()) as Feedback[]
}

export const getFeedbackOfType = async (
  client: Client,
  type: string,
  opts?: {
    n?: number
    cursor?: string
  },
) => {
  const params = new URLSearchParams()
  if (opts && typeof opts.n !== 'undefined') {
    params.set('n', opts.n.toString())
  }

  if (opts && typeof opts.cursor !== 'undefined') {
    params.set('cursor', opts.cursor)
  }

  const paramsString = params.toString()

  const resp = await fetch(
    `${client.endpoint}/api/feedback/${type}${paramsString.length === 0 ? '' : `?${paramsString}`}`,
    {
      method: 'GET',
      headers: getHeaders(client.apiKey),
    },
  )

  return (await resp.json()) as Feedback[]
}

export const getFeedbackBetweenUserItemOfType = async (
  client: Client,
  type: string,
  userId: string,
  itemId: string,
) => {
  const resp = await fetch(
    `${client.endpoint}/api/feedback/${type}/${userId}/${itemId}`,
    {
      method: 'GET',
      headers: getHeaders(client.apiKey),
    },
  )

  return (await resp.json()) as Feedback
}

export const deleteFeedbackBetweenUserItem = (
  client: Client,
  userId: string,
  itemId: string,
) =>
  fetch(`${client.endpoint}/api/feedback/${userId}/${itemId}`, {
    method: 'DELETE',
    headers: getHeaders(client.apiKey),
  })

export const deleteFeedbackBetweenUserItemOfType = (
  client: Client,
  type: string,
  userId: string,
  itemId: string,
) =>
  fetch(`${client.endpoint}/api/feedback/${type}/${userId}/${itemId}`, {
    method: 'DELETE',
    headers: getHeaders(client.apiKey),
  })

export const getFeedbackOfUser = async (client: Client, userId: string) => {
  const resp = await fetch(`${client.endpoint}/api/user/${userId}/feedback`, {
    method: 'GET',
    headers: getHeaders(client.apiKey),
  })

  return (await resp.json()) as Feedback[]
}

export const getFeedbackOfUserOfType = async (
  client: Client,
  userId: string,
  type: string,
) => {
  const resp = await fetch(
    `${client.endpoint}/api/user/${userId}/feedback/${type}`,
    {
      method: 'GET',
      headers: getHeaders(client.apiKey),
    },
  )

  return (await resp.json()) as Feedback[]
}

export const getFeedbackOfItem = async (client: Client, itemId: string) => {
  const resp = await fetch(`${client.endpoint}/api/item/${itemId}/feedback`, {
    method: 'GET',
    headers: getHeaders(client.apiKey),
  })

  return (await resp.json()) as Feedback[]
}

export const getFeedbackOfItemOfType = async (
  client: Client,
  itemId: string,
  type: string,
) => {
  const resp = await fetch(
    `${client.endpoint}/api/item/${itemId}/feedback/${type}`,
    {
      method: 'GET',
      headers: getHeaders(client.apiKey),
    },
  )

  return (await resp.json()) as Feedback[]
}
