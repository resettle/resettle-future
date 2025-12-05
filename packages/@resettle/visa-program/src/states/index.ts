import type { Context } from '../types'
import {
  getAgeStateOutput,
  type AgeState,
  type AgeStateInput,
  type AgeStateOutput,
} from './age'
import {
  getCitizenshipStateOutput,
  type CitizenshipState,
  type CitizenshipStateInput,
  type CitizenshipStateOutput,
} from './citizenship'
import type {
  CountryState,
  CountryStateInput,
  CountryStateOutput,
} from './countries'
import { getAustraliaStateOutput, getIsraelStateOutput } from './countries'
import {
  getCountryOfBirthStateOutput,
  type CountryOfBirthState,
  type CountryOfBirthStateInput,
  type CountryOfBirthStateOutput,
} from './country-of-birth'
import {
  getEducationExperiencesStateOutput,
  type EducationExperiencesState,
  type EducationExperiencesStateInput,
  type EducationExperiencesStateOutput,
} from './education-experiences'
import {
  getFamilyMembersStateOutput,
  type FamilyMembersState,
  type FamilyMembersStateInput,
  type FamilyMembersStateOutput,
} from './family-members'
import {
  getFundingStateOutput,
  type FundingState,
  type FundingStateInput,
  type FundingStateOutput,
} from './funding'
/*
import {
  getLanguageCertificatesStateOutput,
  type LanguageCertificatesState,
  type LanguageCertificatesStateInput,
  type LanguageCertificatesStateOutput,
} from './language-certificates'
*/
import {
  getPermanentResidencyStateOutput,
  type PermanentResidencyState,
  type PermanentResidencyStateInput,
  type PermanentResidencyStateOutput,
} from './permanent-residency'
import {
  getPointsStateOutput,
  type PointsState,
  type PointsStateInput,
  type PointsStateOutput,
} from './points'
import {
  getWorkExperiencesStateOutput,
  type WorkExperiencesState,
  type WorkExperiencesStateInput,
  type WorkExperiencesStateOutput,
} from './work-experiences'

export * from './age'
export * from './citizenship'
export * from './countries'
export * from './country-of-birth'
export * from './education-experiences'
export * from './family-members'
export * from './funding'
// export * from './language-certificates'
export * from './permanent-residency'
export * from './points'
export * from './work-experiences'

export type StateInput = AgeStateInput &
  CitizenshipStateInput &
  CountryOfBirthStateInput &
  CountryStateInput &
  EducationExperiencesStateInput &
  FamilyMembersStateInput &
  FundingStateInput &
  // LanguageCertificatesStateInput &
  PermanentResidencyStateInput &
  PointsStateInput &
  WorkExperiencesStateInput

export type StateInputKey = keyof StateInput

export type State =
  | AndState
  | OrState
  | AgeState
  | CitizenshipState
  | CountryState
  | CountryOfBirthState
  | EducationExperiencesState
  | FamilyMembersState
  | FundingState
  // | LanguageCertificatesState
  | PermanentResidencyState
  | PointsState
  | WorkExperiencesState

export type StateOutput =
  | AndStateOutput
  | OrStateOutput
  | AgeStateOutput
  | CitizenshipStateOutput
  | CountryStateOutput
  | CountryOfBirthStateOutput
  | EducationExperiencesStateOutput
  | FamilyMembersStateOutput
  | FundingStateOutput
  // | LanguageCertificatesStateOutput
  | PermanentResidencyStateOutput
  | PointsStateOutput
  | WorkExperiencesStateOutput

export type AndState = {
  kind: 'and'
  children: State[]
}

export type AndStateOutput = {
  kind: 'and'
  children: StateOutput[]
  similarity: number // the average of the similarity of the children
}

export type OrState = {
  kind: 'or'
  children: State[]
}

export type OrStateOutput = {
  kind: 'or'
  children: StateOutput[]
  similarity: number // the greatest similarity of the children
}

export const getAndStateOutput = (
  context: Context,
  state: AndState,
  stateInput: StateInput,
): AndStateOutput => {
  const children = state.children.map(child =>
    getStateOutput(context, child, stateInput),
  )

  const similarities = children.map(child => child.similarity)
  const lowestSimilarity =
    similarities.length > 0 ? Math.min(...similarities) : 0

  return {
    kind: 'and',
    children,
    similarity: lowestSimilarity,
  } as const
}

export const getOrStateOutput = (
  context: Context,
  state: OrState,
  stateInput: StateInput,
): OrStateOutput => {
  const children = state.children.map(child =>
    getStateOutput(context, child, stateInput),
  )

  const similarities = children.map(child => child.similarity)
  const greatestSimilarity =
    similarities.length > 0 ? Math.max(...similarities) : 0

  return {
    kind: 'or',
    children,
    similarity: greatestSimilarity,
  } as const
}

export const getStateOutput = (
  context: Context,
  state: State,
  stateInput: StateInput,
): StateOutput => {
  switch (state.kind) {
    case 'age':
      return getAgeStateOutput(state, stateInput)
    case 'australia':
      return getAustraliaStateOutput(context, state, stateInput)
    case 'citizenship':
      return getCitizenshipStateOutput(state, stateInput)
    case 'country_of_birth':
      return getCountryOfBirthStateOutput(state, stateInput)
    case 'education_experiences':
      return getEducationExperiencesStateOutput(context, state, stateInput)
    case 'family_members':
      return getFamilyMembersStateOutput(context, state, stateInput)
    case 'funding':
      return getFundingStateOutput(context, state, stateInput)
    case 'israel':
      return getIsraelStateOutput(state, stateInput)
    /*
    case 'language_certificates':
      return getLanguageCertificatesStateOutput(context, state, stateInput)
      */
    case 'permanent_residency':
      return getPermanentResidencyStateOutput(state, stateInput)
    case 'points':
      return getPointsStateOutput(state, stateInput)
    case 'work_experiences':
      return getWorkExperiencesStateOutput(context, state, stateInput)
    case 'and':
      return getAndStateOutput(context, state, stateInput)
    case 'or':
      return getOrStateOutput(context, state, stateInput)
  }
}
