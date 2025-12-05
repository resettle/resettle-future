import {
  type EducationExperience,
  type EducationLevel,
  EDUCATION_LEVEL_OPTIONS,
} from '@resettle/schema'

export type GraduationDateRefInput = {
  education_experiences?: EducationExperience[]
}

export type GraduationDateFilter =
  | 'high_school'
  | 'high_school_or_higher'
  | 'bachelor'
  | 'bachelor_or_higher'
  | 'master'
  | 'master_or_higher'
  | 'doctorate'
  | 'doctorate_or_higher'

export type GraduationDateCalculation =
  | `add_years:${number}`
  | `add_months:${number}`
  | `add_days:${number}`
  | `subtract_years:${number}`
  | `subtract_months:${number}`
  | `subtract_days:${number}`

export type GraduationDateRef =
  | `graduation_date.${GraduationDateFilter}.${GraduationDateCalculation}`
  | `graduation_date.${GraduationDateFilter}`

export const isGraduationDateRef = (ref: string): ref is GraduationDateRef => {
  return ref.startsWith('graduation_date')
}

export const getGraduationDateRefValue = (
  ref: GraduationDateRef,
  input: GraduationDateRefInput,
): Date | null => {
  const parts = ref.split('.')
  const filter = parts[1] as GraduationDateFilter
  const calculation = parts[2] as GraduationDateCalculation | undefined

  // Return null if no education experiences
  if (
    !input.education_experiences ||
    input.education_experiences.length === 0
  ) {
    return null
  }

  // Parse the filter
  const isOrHigher = filter.endsWith('_or_higher')
  const targetDegreeLevel = isOrHigher
    ? filter.replace('_or_higher', '')
    : filter

  // Filter education experiences based on degree level
  const filteredExperiences = input.education_experiences.filter(experience => {
    if (!experience.level) {
      return false
    }

    const experienceDegreeLevelIndex = EDUCATION_LEVEL_OPTIONS.indexOf(
      experience.level,
    )
    const targetDegreeLevelIndex = EDUCATION_LEVEL_OPTIONS.indexOf(
      targetDegreeLevel as EducationLevel,
    )

    if (isOrHigher) {
      return experienceDegreeLevelIndex >= targetDegreeLevelIndex
    } else {
      return experienceDegreeLevelIndex === targetDegreeLevelIndex
    }
  })

  // Find the most recent graduation date from filtered experiences
  let mostRecentGraduationDate: Date | null = null

  for (const experience of filteredExperiences) {
    if (experience.end_date) {
      const graduationDate = new Date(experience.end_date)
      if (
        !mostRecentGraduationDate ||
        graduationDate > mostRecentGraduationDate
      ) {
        mostRecentGraduationDate = graduationDate
      }
    }
  }

  // Return null if no graduation date found
  if (!mostRecentGraduationDate) {
    return null
  }

  // Apply calculation if provided
  if (calculation) {
    const [operation, valueStr] = calculation.split(':')
    const value = parseInt(valueStr, 10)

    if (isNaN(value)) {
      return mostRecentGraduationDate
    }

    const resultDate = new Date(mostRecentGraduationDate)

    switch (operation) {
      case 'add_years':
        resultDate.setUTCFullYear(resultDate.getUTCFullYear() + value)
        break
      case 'add_months':
        resultDate.setUTCMonth(resultDate.getUTCMonth() + value)
        break
      case 'add_days':
        resultDate.setUTCDate(resultDate.getUTCDate() + value)
        break
      case 'subtract_years':
        resultDate.setUTCFullYear(resultDate.getUTCFullYear() - value)
        break
      case 'subtract_months':
        resultDate.setUTCMonth(resultDate.getUTCMonth() - value)
        break
      case 'subtract_days':
        resultDate.setUTCDate(resultDate.getUTCDate() - value)
        break
      default:
        return mostRecentGraduationDate
    }

    return resultDate
  }

  return mostRecentGraduationDate
}
