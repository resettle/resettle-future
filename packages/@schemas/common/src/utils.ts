import { z } from 'zod'

export const stringSchema = z.string()
export const stringOptionalSchema = stringSchema.optional()
export const stringNullableSchema = stringSchema.nullable()
export const stringNullishSchema = stringSchema.nullish()

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
