import { createRequestHandler, RouterContextProvider } from 'react-router'

import { cloudflareServerContext } from './common/contexts/cloudflare.server'

declare module 'react-router' {
  export interface AppLoadContext {
    cloudflare: {
      env: Env
      ctx: ExecutionContext
    }
  }
}

const requestHandler = createRequestHandler(
  () => import('virtual:react-router/server-build'),
  import.meta.env.MODE,
)

export default {
  async fetch(request, env, ctx) {
    const context = new RouterContextProvider(
      new Map([[cloudflareServerContext, { env, ctx }]]),
    )

    return requestHandler(request, context)
  },
} satisfies ExportedHandler<Env>
