import type {
  AustraliaState,
  AustraliaStateInput,
  AustraliaStateOutput,
} from './australia'
import {
  type IsraelState,
  type IsraelStateInput,
  type IsraelStateOutput,
} from './israel'

export * from './australia'
export * from './israel'

export type CountryStateInput = AustraliaStateInput & IsraelStateInput

export type CountryState = AustraliaState | IsraelState

export type CountryStateOutput = AustraliaStateOutput | IsraelStateOutput
