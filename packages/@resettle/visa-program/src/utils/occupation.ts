import type {
  OccupationClassification,
  OccupationCodes,
} from '@resettle/schema'
import type { OccupationCodeCrosswalk } from '@resettle/schema/intelligence'

type RequiredOccupationCode = {
  level: 'category' | 'major' | 'sub_major' | 'minor' | 'broad' | 'unit'
  code: string
}

export type OccupationCodesFilter = {
  kind: OccupationClassification
  codes: RequiredOccupationCode[]
}

const occupationMatches = (
  kind: OccupationClassification,
  source: string,
  target: RequiredOccupationCode,
) => {
  if (target.level === 'unit') return source === target.code

  if (kind === 'isco-2008') {
    if (target.level === 'major' && target.code === '0') {
      return source.length === 3
    }

    return source.startsWith(target.code)
  }

  if (kind === 'ussoc-2010' || kind === 'ussoc-2018') {
    if (target.level === 'major') {
      return source.substring(0, 2) === target.code.substring(0, 2)
    }

    if (target.level === 'minor') {
      return source.substring(0, 4) === target.code.substring(0, 4)
    }

    if (target.level === 'broad') {
      return source.substring(0, 5) === target.code.substring(0, 5)
    }
  }

  return source.startsWith(target.code)
}

export const getOccupationCodesSimilarity = (
  crosswalk: OccupationCodeCrosswalk[],
  expected: OccupationCodesFilter,
  actual: OccupationCodes,
) => {
  const sourceCodes = crosswalk
    .filter(
      c =>
        c.source_id === `${actual.primary.kind}-${actual.primary.code}` &&
        c.target_id.startsWith(expected.kind),
    )
    .map(c => c.target_id)

  for (const sourceCode of sourceCodes) {
    for (const targetCode of expected.codes) {
      if (occupationMatches(expected.kind, sourceCode, targetCode)) {
        return 1
      }
    }
  }

  return 0
}
