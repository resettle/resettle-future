import type { IntelligenceDatabase } from '@resettle/database/intelligence'
import type { Kysely } from 'kysely'
import type { OpenAI } from 'openai'
import { cosineDistance } from 'pgvector/kysely'

export const getJobTagCandidates = async (
  ctx: { db: Kysely<IntelligenceDatabase>; openai: OpenAI },
  description: string,
  limit: number,
) => {
  const resp = await ctx.openai.embeddings.create({
    model: 'text-embedding-3-small',
    input: description,
  })

  const embedding = resp.data.map(d => d.embedding)[0]

  return await ctx.db
    .selectFrom('tag_template')
    .selectAll()
    .where('namespace', '=', 'skill')
    .orderBy(cosineDistance('embedding', embedding))
    .limit(limit)
    .execute()
}

export const getJobTags = async (
  ctx: { db: Kysely<IntelligenceDatabase>; openai: OpenAI },
  description: string,
) => {
  const candidates = await getJobTagCandidates(ctx, description, 100)

  const prompt = `You are an AI assistant for a job platform. Your task is to analyze a job description and extract all the skills that are included in the requirements, for each skill, output \`true\` if the exact skill or its clear meaning is present in the job description, otherwise output \`false\`. Only use skills provided below.
Skills:
${candidates.map(c => `- ${c.name}`).join('\n')}

The job description is:
"""
${description}
"""

`
  const response = await ctx.openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      {
        role: 'user',
        content: prompt,
      },
    ],
    temperature: 0.2,
    response_format: {
      type: 'json_schema',
      json_schema: {
        name: 'tag_results',
        schema: {
          type: 'object',
          properties: Object.fromEntries(
            candidates.map(c => [
              c.name,
              {
                type: 'boolean',
              },
            ]),
          ),
        },
      },
    },
  })

  if (!response.choices[0].message.content) {
    throw new Error()
  }

  const results = JSON.parse(response.choices[0].message.content) as Record<
    string,
    boolean
  >
  return candidates.filter(c => results[c.name])
}
