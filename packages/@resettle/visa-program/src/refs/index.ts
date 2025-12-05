import {
  getGraduationDateRefValue,
  isGraduationDateRef,
  type GraduationDateRef,
  type GraduationDateRefInput,
} from './graduation-date'

export type RefInput = GraduationDateRefInput

export type Ref = GraduationDateRef

export const getRefValue = <T>(ref: Ref, input: RefInput): T => {
  if (isGraduationDateRef(ref)) {
    return getGraduationDateRefValue(ref, input) as T
  }

  throw new EvalError(`Unsupported ref: ${ref}`)
}
