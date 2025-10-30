import { Hono } from 'hono'

const app = new Hono<{ Bindings: Cloudflare.Env }>()

app.get('/', c => {
  return c.json({ message: 'Hello, world!' })
})

export default app
