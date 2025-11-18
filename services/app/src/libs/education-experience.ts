import { booleanSchema, type EducationExperience } from '@resettle/schema'
import type { OpenAI } from 'openai'
import { toJSONSchema, z } from 'zod'

const isSTEMResponseSchema = z.object({ is_stem: booleanSchema })
const isSTEMResponseSchemaJSONSchema = toJSONSchema(isSTEMResponseSchema, {
  reused: 'ref',
  cycles: 'throw',
})

/**
 * Determines if an education experience is in a STEM field
 * @param openai - The OpenAI client
 * @param experience - The education experience to evaluate
 * @returns True if the education experience is in a STEM field, false otherwise
 */
export const determineIsSTEM = async (
  openai: OpenAI,
  experience: EducationExperience,
) => {
  const systemPrompt = `Given an education experience, determine if it is in a STEM (Science, Technology, Engineering, Mathematics) field.`
  const userPrompt = `Education Experience:
  - Institution: ${experience.institution_name || 'Unknown'}
  - Major/Field of Study: ${experience.field_of_study || 'Unknown'}
  - Level: ${experience.level || 'Unknown'}
`

  const response = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt },
    ],
    response_format: {
      type: 'json_schema',
      json_schema: {
        name: 'IsSTEM',
        schema: isSTEMResponseSchemaJSONSchema,
      },
    },
  })

  const payload = response.choices[0]?.message?.content

  if (!payload) {
    throw new Error('No payload received from OpenAI')
  }

  return isSTEMResponseSchema.parse(JSON.parse(payload)).is_stem
}
