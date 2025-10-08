import { z } from 'zod'

const SELECT_OPTIONS = ['date', 'entity', 'variable', 'value', 'facet'] as const

const selectOptionsSchema = z.enum(SELECT_OPTIONS)

type SelectOptions = z.infer<typeof selectOptionsSchema>

const BASE_URL = 'https://api.datacommons.org/v2/'

const HEADER_API_KEY = 'X-API-Key'

type ObservationBody = {
  date: string
  variable?: {
    dcids: string[]
  }
  entity:
    | {
        dcids: string[]
      }
    | {
        expression: string
      }
  select: SelectOptions[]
  filter?: {
    domains?: string[]
    facet_ids?: string[]
  }
}

export const observationRespSchema = z.object({
  byVariable: z.record(
    z.string(),
    z.object({
      byEntity: z.record(
        z.string(),
        z.object({
          orderedFacets: z
            .array(
              z.object({
                facetId: z.string(),
                earliestDate: z.string(),
                latestDate: z.string(),
                obsCount: z.int(),
                observations: z.array(
                  z.object({
                    date: z.string(),
                    value: z.union([z.string(), z.number()]),
                  }),
                ),
              }),
            )
            .optional(),
        }),
      ),
    }),
  ),
  facets: z
    .record(
      z.string(),
      z.object({
        importName: z.string(),
        provenanceUrl: z.string(),
        measurementMethod: z.string().optional(),
        observationPeriod: z.string().optional(),
        unit: z.string().optional(),
      }),
    )
    .optional(),
})

type ObservationResp = z.infer<typeof observationRespSchema>

type NodeBody = {
  nodes: string[]
  property: string
}

export const nodeRespSchema = z.object({
  data: z.record(
    z.string(),
    z.object({
      arcs: z.record(z.string(), z.any()).optional(),
      properties: z.array(z.string()).optional(),
    }),
  ),
  nextToken: z.string().optional(),
})

type NodeResp = z.infer<typeof nodeRespSchema>

type ResolveBody = {
  nodes: string[]
  property: string
}

export const resolveRespSchema = z.object({
  entities: z.array(
    z.object({
      node: z.string(),
      candidates: z.object({
        dcid: z.string(),
        dominantType: z.string().optional(),
      }),
    }),
  ),
})

type ResolveResp = z.infer<typeof resolveRespSchema>

type ObservationReq = {
  type: 'observation'
  body: ObservationBody
}

type NodeReq = {
  type: 'node'
  body: NodeBody
}

type ResolveReq = {
  type: 'resolve'
  body: ResolveBody
}

export type DataCommonsReq = ObservationReq | NodeReq | ResolveReq
export type DataCommonsResp = ObservationResp | NodeResp | ResolveResp

export async function buildDataCommonsRequest(
  request: ObservationReq,
  apiKey: string,
): Promise<ObservationResp>
export async function buildDataCommonsRequest(
  request: NodeReq,
  apiKey: string,
): Promise<NodeResp>
export async function buildDataCommonsRequest(
  request: ResolveReq,
  apiKey: string,
): Promise<ResolveResp>
export async function buildDataCommonsRequest(
  request: DataCommonsReq,
  apiKey: string,
): Promise<DataCommonsResp> {
  const resp = await fetch(`${BASE_URL}/${request.type}`, {
    method: 'POST',
    body: JSON.stringify(request.body),
    headers: {
      [HEADER_API_KEY]: apiKey,
    },
  })

  return (await resp.json()) as DataCommonsResp
}
