import { z } from 'zod'

export const stringSchema = z.string()
export const stringOptionalSchema = stringSchema.optional()
export const stringNullableSchema = stringSchema.nullable()
export const stringNullishSchema = stringSchema.nullish()

export const stringArraySchema = z.array(stringSchema)
export const stringArrayOptionalSchema = stringArraySchema.optional()
export const stringArrayNullableSchema = stringArraySchema.nullable()
export const stringArrayNullishSchema = stringArraySchema.nullish()

export const stringBoolSchema = z.stringbool()
export const stringBoolOptionalSchema = stringBoolSchema.optional()
export const stringBoolNullableSchema = stringBoolSchema.nullable()
export const stringBoolNullishSchema = stringBoolSchema.nullish()

export const emailSchema = z.email()
export const emailOptionalSchema = emailSchema.optional()
export const emailNullableSchema = emailSchema.nullable()
export const emailNullishSchema = emailSchema.nullish()

export const urlSchema = z.url()
export const urlOptionalSchema = urlSchema.optional()
export const urlNullableSchema = urlSchema.nullable()
export const urlNullishSchema = urlSchema.nullish()

export const uuidSchema = z.uuid()
export const uuidOptionalSchema = uuidSchema.optional()
export const uuidNullableSchema = uuidSchema.nullable()
export const uuidNullishSchema = uuidSchema.nullish()

export const numberSchema = z.number()
export const numberOptionalSchema = numberSchema.optional()
export const numberNullableSchema = numberSchema.nullable()
export const numberNullishSchema = numberSchema.nullish()

export const intSchema = numberSchema.int()
export const intOptionalSchema = intSchema.optional()
export const intNullableSchema = intSchema.nullable()
export const intNullishSchema = intSchema.nullish()

export const intPositiveSchema = intSchema.positive()
export const intPositiveOptionalSchema = intPositiveSchema.optional()
export const intPositiveNullableSchema = intPositiveSchema.nullable()
export const intPositiveNullishSchema = intPositiveSchema.nullish()

export const booleanSchema = z.boolean()
export const booleanOptionalSchema = booleanSchema.optional()
export const booleanNullableSchema = booleanSchema.nullable()
export const booleanNullishSchema = booleanSchema.nullish()

export const dateSchema = z.coerce.date<Date | string>()
export const dateOptionalSchema = dateSchema.optional()
export const dateNullableSchema = dateSchema.nullable()
export const dateNullishSchema = dateSchema.nullish()

export const jsonObjectSchema = z.looseObject({})
export const jsonObjectOptionalSchema = jsonObjectSchema.optional()
export const jsonObjectNullableSchema = jsonObjectSchema.nullable()
export const jsonObjectNullishSchema = jsonObjectSchema.nullish()

export const anySchema = z.any()
export const recordSchema = z.record(stringSchema, z.any())
export const recordWithLimit100Schema = z
  .record(stringSchema, z.any())
  .refine(v => Object.entries(v).length <= 100)
