import { createContext } from 'react-router'

export type CloudflareServerContextValue = {
  env: Env
  ctx: ExecutionContext
}

export const cloudflareServerContext =
  createContext<CloudflareServerContextValue>()
