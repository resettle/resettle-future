import { z } from 'zod'

import { getHeaders, type Client } from './common'

const userSchema = z.object({
  UserId: z.string(),
  Labels: z.array(z.string()),
  Comment: z.string().optional(),
})

const userPatchSchema = userSchema.omit({
  UserId: true,
})

const userIteratorSchema = z.object({
  Cursor: z.string().optional(),
  Users: z.array(userSchema),
})

export type User = z.infer<typeof userSchema>
export type UserPatch = z.infer<typeof userPatchSchema>
export type UserIterator = z.infer<typeof userIteratorSchema>

export const insertUser = (client: Client, user: User) =>
  fetch(`${client.endpoint}/api/user`, {
    method: 'POST',
    body: JSON.stringify(user),
    headers: getHeaders(client.apiKey),
  })

export const updateUser = (
  client: Client,
  userId: string,
  userPatch: UserPatch,
) =>
  fetch(`${client.endpoint}/api/user/${userId}`, {
    method: 'PATCH',
    body: JSON.stringify(userPatch),
    headers: getHeaders(client.apiKey),
  })

export const getUser = async (client: Client, userId: string) => {
  const resp = await fetch(`${client.endpoint}/api/user/${userId}`, {
    method: 'GET',
    headers: getHeaders(client.apiKey),
  })

  return (await resp.json()) as User
}

export const deleteUser = (client: Client, userId: string) =>
  fetch(`${client.endpoint}/api/user/${userId}`, {
    method: 'DELETE',
    headers: getHeaders(client.apiKey),
  })

export const insertUsers = (client: Client, users: User[]) =>
  fetch(`${client.endpoint}/api/users`, {
    method: 'POST',
    body: JSON.stringify(users),
    headers: getHeaders(client.apiKey),
  })

export const getUsers = async (
  client: Client,
  opts?: { n?: number; cursor?: string },
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
    `${client.endpoint}/api/users${paramsString.length === 0 ? '' : `?${paramsString}`}`,
    {
      method: 'GET',
      headers: getHeaders(client.apiKey),
    },
  )

  return (await resp.json()) as UserIterator
}
