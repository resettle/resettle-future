import type { CountryAlpha2Code } from '@resettle/schema'

import { getBooleanSimilarity } from '../utils/similarity'

export const DEFAULT_COUNTRY_OF_BIRTH_SIMILARITY = 0.2

export type CountryOfBirthStateInput = {
  country_of_birth?: CountryAlpha2Code
}

export type CountryOfBirthState = {
  kind: 'country_of_birth'
  op: 'in' | 'not_in'
  expected: CountryAlpha2Code[]
}

export type CountryOfBirthStateOutput = {
  kind: 'country_of_birth'
  op: 'in' | 'not_in'
  expected: CountryAlpha2Code[]
  actual?: CountryAlpha2Code
  similarity: number
}

export const getCountryOfBirthStateOutput = (
  state: CountryOfBirthState,
  { country_of_birth }: CountryOfBirthStateInput,
): CountryOfBirthStateOutput => {
  switch (state.op) {
    case 'in':
      return {
        kind: state.kind,
        op: state.op,
        expected: state.expected,
        actual: country_of_birth,
        similarity: country_of_birth
          ? getBooleanSimilarity(state.expected.includes(country_of_birth))
          : DEFAULT_COUNTRY_OF_BIRTH_SIMILARITY,
      }
    case 'not_in':
      return {
        kind: state.kind,
        op: state.op,
        expected: state.expected,
        actual: country_of_birth,
        similarity: country_of_birth
          ? getBooleanSimilarity(!state.expected.includes(country_of_birth))
          : DEFAULT_COUNTRY_OF_BIRTH_SIMILARITY,
      }
  }
}
