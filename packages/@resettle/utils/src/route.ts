export type Route<
  P extends string,
  RP extends string,
  Children extends Record<string, any>,
> = RoutePaths<P, RP> & RouteChildren<P, Children> & RouteApi<P>

type RoutePaths<P extends string, RP extends string> = {
  path: P
  prefix: P extends '' ? '*' : `${P}/*`
  relativePath: RP
  relativePrefix: RP extends '' ? '*' : `${RP}/*`
  slashedPath: P extends '' ? '/' : `/${P}`
  slashedPrefix: P extends '' ? '/*' : `/${P}/*`
}

type RouteChildren<P extends string, Children extends Record<string, any>> = {
  [K in keyof Children]: Children[K] extends Route<
    infer P2 extends string,
    infer RP2 extends string,
    infer Children2 extends Record<string, any>
  >
    ? Route<
        P2 extends '' ? P : P extends '' ? P2 : `${P}/${P2}`,
        RP2,
        Children2
      >
    : unknown
}

type SearchParamsInit = URLSearchParams | Record<string, string>

type RouteApi<P extends string> = P extends
  | `:${string}`
  | `${string}/:${string}`
  ? {
      params: readonly [...ExtractPathParamArray<P>]
      buildPath: (
        params: PathParams<P>,
        searchParams?: SearchParamsInit,
      ) => string
      buildPrefix: (params: PathParams<P>) => string
      buildSlashedPath: (
        params: PathParams<P>,
        searchParams?: SearchParamsInit,
      ) => string
      buildSlashedPrefix: (params: PathParams<P>) => string
    }
  : {
      buildPath: (searchParams: SearchParamsInit) => string
      buildSlashedPath: (searchParams: SearchParamsInit) => string
    }

type ExtractPathParams<T extends string> =
  T extends `${string}:${infer Param}/${infer Rest}`
    ? Param | ExtractPathParams<Rest>
    : T extends `${string}:${infer Param}`
      ? Param
      : never

type ExtractPathParamArray<T extends string> =
  T extends `${string}:${infer Param}/${infer Rest}`
    ? [Param, ...ExtractPathParamArray<Rest>]
    : T extends `${string}:${infer Param}`
      ? [Param]
      : []

type PathParams<T extends string> = {
  [K in ExtractPathParams<T>]: string
}

const createRouteProxy = (
  path: string,
  relativePath: string,
  children: Record<string, any> = {},
) => {
  return new Proxy(
    { path, relativePath, children },
    {
      get(target, key) {
        if (key === 'children') {
          return target.children
        }

        if (key === 'path') {
          return target.path
        }

        if (key === 'prefix') {
          return target.path === '' ? '*' : `${target.path}/*`
        }

        if (key === 'relativePath') {
          return target.relativePath
        }

        if (key === 'relativePrefix') {
          return target.relativePath === '' ? '*' : `${target.relativePath}/*`
        }

        if (key === 'slashedPath') {
          return `/${target.path}`
        }

        if (key === 'slashedPrefix') {
          return target.path === '' ? '/*' : `/${target.path}/*`
        }

        if (key === 'params') {
          return target.path.match(/:\w+/g)?.map(param => param.slice(1)) ?? []
        }

        if (key === 'buildPath') {
          if (!target.path.includes(':')) {
            return (searchParams: SearchParamsInit) =>
              target.path + `?${new URLSearchParams(searchParams).toString()}`
          }

          return (
            params: Record<string, string>,
            searchParams?: SearchParamsInit,
          ) => {
            let result = target.path

            for (const [key, value] of Object.entries(params)) {
              result = result.replace(`:${key}`, value)
            }

            if (searchParams) {
              result += `?${new URLSearchParams(searchParams).toString()}`
            }

            return result
          }
        }

        if (key === 'buildPrefix') {
          return (params: Record<string, string>) => {
            let result = target.path === '' ? '*' : `${target.path}/*`

            for (const [key, value] of Object.entries(params)) {
              result = result.replace(`:${key}`, value)
            }

            return result
          }
        }

        if (key === 'buildSlashedPath') {
          if (!target.path.includes(':')) {
            return (searchParams: SearchParamsInit) =>
              `/${target.path}?${new URLSearchParams(searchParams).toString()}`
          }

          return (
            params: Record<string, string>,
            searchParams?: SearchParamsInit,
          ) => {
            let result = target.path

            for (const [key, value] of Object.entries(params)) {
              result = result.replace(`:${key}`, value)
            }

            if (searchParams) {
              result += `?${new URLSearchParams(searchParams).toString()}`
            }

            return `/${result}`
          }
        }

        if (key === 'buildSlashedPrefix') {
          return (params: Record<string, string>) => {
            let result = target.path === '' ? '*' : `${target.path}/*`

            for (const [key, value] of Object.entries(params)) {
              result = result.replace(`:${key}`, value)
            }

            return `/${result}`
          }
        }

        if (typeof key === 'string' && key in target.children) {
          return createRouteProxy(
            target.children[key].path.length > 0
              ? target.path === ''
                ? target.children[key].path
                : `${target.path}/${target.children[key].path}`
              : target.path,
            target.children[key].path,
            target.children[key].children,
          )
        }

        throw new Error(`Unknown route key: ${String(key)}`)
      },
    },
  )
}

/**
 * Creates a route object with path information and nested children
 *
 * @param path - The route path, can include parameters like `:id`
 * @param children - Nested routes as child properties
 * @returns A route object with path utilities and nested children
 *
 * @example
 * ```ts
 * const routes = {
 *   users: route('users', {
 *     user: route(':id')
 *   })
 * } as const
 *
 * // Access nested routes
 * routes.users.user.path // 'users/:id'
 *
 * // Build paths with parameters
 * routes.users.user.buildPath({ id: '123' }) // 'users/123'
 * ```
 */
export const route = <
  const P extends string,
  const Children extends Record<string, any>,
>(
  path: P,
  children: Children = {} as Children,
) => {
  return createRouteProxy(path, path, children) as unknown as Route<
    P,
    P,
    Children
  >
}
