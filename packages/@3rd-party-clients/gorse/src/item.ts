import { z } from 'zod'

import { getHeaders, type Client } from './common'

const itemSchema = z.object({
  ItemId: z.string(),
  IsHidden: z.boolean(),
  Categories: z.array(z.string()),
  Labels: z.array(z.string()),
  Timestamp: z.coerce.date(),
  Comment: z.string().optional(),
})

const itemPatchSchema = itemSchema.omit({
  ItemId: true,
})

const itemIteratorSchema = z.object({
  Cursor: z.string().optional(),
  Items: z.array(itemSchema),
})

export type Item = z.infer<typeof itemSchema>
export type ItemPatch = z.infer<typeof itemPatchSchema>
export type ItemIterator = z.infer<typeof itemIteratorSchema>

export const insertItem = (client: Client, item: Item) =>
  fetch(`${client.endpoint}/api/item`, {
    method: 'POST',
    body: JSON.stringify(item),
    headers: getHeaders(client.apiKey),
  })

export const updateItem = (
  client: Client,
  itemId: string,
  itemPatch: ItemPatch,
) =>
  fetch(`${client.endpoint}/api/item/${itemId}`, {
    method: 'PATCH',
    body: JSON.stringify(itemPatch),
    headers: getHeaders(client.apiKey),
  })

export const getItem = async (client: Client, itemId: string) => {
  const resp = await fetch(`${client.endpoint}/api/item/${itemId}`, {
    method: 'GET',
    headers: getHeaders(client.apiKey),
  })

  return (await resp.json()) as Item
}

export const deleteItem = (client: Client, itemId: string) =>
  fetch(`${client.endpoint}/api/item/${itemId}`, {
    method: 'DELETE',
    headers: getHeaders(client.apiKey),
  })

export const insertItems = (client: Client, items: Item[]) =>
  fetch(`${client.endpoint}/api/items`, {
    method: 'POST',
    body: JSON.stringify(items),
    headers: getHeaders(client.apiKey),
  })

export const getItems = async (
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
    `${client.endpoint}/api/items${paramsString.length === 0 ? '' : `?${paramsString}`}`,
    {
      method: 'GET',
      headers: getHeaders(client.apiKey),
    },
  )

  return (await resp.json()) as ItemIterator
}

export const insertItemCategory = (
  client: Client,
  itemId: string,
  category: string,
) =>
  fetch(`${client.endpoint}/api/item/${itemId}/category/${category}`, {
    method: 'PUT',
    headers: getHeaders(client.apiKey),
  })

export const deleteItemCategory = (
  client: Client,
  itemId: string,
  category: string,
) =>
  fetch(`${client.endpoint}/api/item/${itemId}/category/${category}`, {
    method: 'DELETE',
    headers: getHeaders(client.apiKey),
  })
