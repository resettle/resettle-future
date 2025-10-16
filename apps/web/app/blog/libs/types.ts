export type BlogPost = {
  id: string
  title: string
  content: string
  date_created: string
  date_updated: string
}

export type BlogTag = {
  id: string
  name: string
  description?: string | null
}
