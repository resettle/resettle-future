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

const convertOccupationClassification = (
  crosswalk: OccupationCodeCrosswalk[],
  code: string,
  sourceType: OccupationClassification,
  targetType: OccupationClassification,
): string[] => {
  switch (sourceType) {
    case 'anzsco-2013':
      switch (targetType) {
        case 'anzsco-2013':
          return [code]
        case 'anzsco-2022':
        case 'nol-2024':
        case 'osca-2024':
        case 'uksoc-2020':
        case 'ussoc-2010':
          const foundIsco2008 = crosswalk
            .filter(
              c => c.source_id === code && c.target_id.startsWith('isco-2008'),
            )
            .map(c => c.target_id)
          return foundIsco2008
            .map(c =>
              crosswalk
                .filter(
                  s => s.source_id === c && s.target_id.startsWith(targetType),
                )
                .map(c => c.target_id),
            )
            .flat()
        case 'isco-2008': {
          return crosswalk
            .filter(
              c => c.source_id === code && c.target_id.startsWith('isco-2008'),
            )
            .map(c => c.target_id)
        }
        case 'noc-2016': {
          const foundIsco2008 = crosswalk
            .filter(
              c => c.source_id === code && c.target_id.startsWith('isco-2008'),
            )
            .map(c => c.target_id)
          const foundUssoc2010 = foundIsco2008
            .map(c =>
              crosswalk
                .filter(
                  s =>
                    s.source_id === c && s.target_id.startsWith('ussoc-2010'),
                )
                .map(c => c.target_id),
            )
            .flat()
          const foundUssoc2018 = foundUssoc2010
            .map(c =>
              crosswalk
                .filter(
                  s =>
                    s.source_id === c && s.target_id.startsWith('ussoc-2018'),
                )
                .map(c => c.target_id),
            )
            .flat()
          return foundUssoc2018
            .map(c =>
              crosswalk
                .filter(
                  s => s.source_id === c && s.target_id.startsWith('noc-2016'),
                )
                .map(c => c.target_id),
            )
            .flat()
        }
        case 'noc-2021': {
          const foundIsco2008 = crosswalk
            .filter(
              c => c.source_id === code && c.target_id.startsWith('isco-2008'),
            )
            .map(c => c.target_id)
          const foundUssoc2010 = foundIsco2008
            .map(c =>
              crosswalk
                .filter(
                  s =>
                    s.source_id === c && s.target_id.startsWith('ussoc-2010'),
                )
                .map(c => c.target_id),
            )
            .flat()
          const foundUssoc2018 = foundUssoc2010
            .map(c =>
              crosswalk
                .filter(
                  s =>
                    s.source_id === c && s.target_id.startsWith('ussoc-2018'),
                )
                .map(c => c.target_id),
            )
            .flat()
          const foundNoc2016 = foundUssoc2018
            .map(c =>
              crosswalk
                .filter(
                  s => s.source_id === c && s.target_id.startsWith('noc-2016'),
                )
                .map(c => c.target_id),
            )
            .flat()
          return foundNoc2016
            .map(c =>
              crosswalk
                .filter(
                  s => s.source_id === c && s.target_id.startsWith('noc-2021'),
                )
                .map(c => c.target_id),
            )
            .flat()
        }
        case 'ussoc-2018': {
          const foundIsco2008 = crosswalk
            .filter(
              c => c.source_id === code && c.target_id.startsWith('isco-2008'),
            )
            .map(c => c.target_id)
          const foundUssoc2010 = foundIsco2008
            .map(c =>
              crosswalk
                .filter(
                  s =>
                    s.source_id === c && s.target_id.startsWith('ussoc-2010'),
                )
                .map(c => c.target_id),
            )
            .flat()
          return foundUssoc2010
            .map(c =>
              crosswalk
                .filter(
                  s =>
                    s.source_id === c && s.target_id.startsWith('ussoc-2018'),
                )
                .map(c => c.target_id),
            )
            .flat()
        }
      }
    case 'anzsco-2022':
      switch (targetType) {
        case 'anzsco-2013':
        case 'nol-2024':
        case 'osca-2024':
        case 'uksoc-2020':
        case 'ussoc-2010':
          const foundIsco2008 = crosswalk
            .filter(
              c => c.source_id === code && c.target_id.startsWith('isco-2008'),
            )
            .map(c => c.target_id)
          return foundIsco2008
            .map(c =>
              crosswalk
                .filter(
                  s => s.source_id === c && s.target_id.startsWith(targetType),
                )
                .map(c => c.target_id),
            )
            .flat()
        case 'anzsco-2022':
          return [code]
        case 'isco-2008': {
          return crosswalk
            .filter(
              c => c.source_id === code && c.target_id.startsWith('isco-2008'),
            )
            .map(c => c.target_id)
        }
        case 'noc-2016': {
          const foundIsco2008 = crosswalk
            .filter(
              c => c.source_id === code && c.target_id.startsWith('isco-2008'),
            )
            .map(c => c.target_id)
          const foundUssoc2010 = foundIsco2008
            .map(c =>
              crosswalk
                .filter(
                  s =>
                    s.source_id === c && s.target_id.startsWith('ussoc-2010'),
                )
                .map(c => c.target_id),
            )
            .flat()
          const foundUssoc2018 = foundUssoc2010
            .map(c =>
              crosswalk
                .filter(
                  s =>
                    s.source_id === c && s.target_id.startsWith('ussoc-2018'),
                )
                .map(c => c.target_id),
            )
            .flat()
          return foundUssoc2018
            .map(c =>
              crosswalk
                .filter(
                  s => s.source_id === c && s.target_id.startsWith('noc-2016'),
                )
                .map(c => c.target_id),
            )
            .flat()
        }
        case 'noc-2021': {
          const foundIsco2008 = crosswalk
            .filter(
              c => c.source_id === code && c.target_id.startsWith('isco-2008'),
            )
            .map(c => c.target_id)
          const foundUssoc2010 = foundIsco2008
            .map(c =>
              crosswalk
                .filter(
                  s =>
                    s.source_id === c && s.target_id.startsWith('ussoc-2010'),
                )
                .map(c => c.target_id),
            )
            .flat()
          const foundUssoc2018 = foundUssoc2010
            .map(c =>
              crosswalk
                .filter(
                  s =>
                    s.source_id === c && s.target_id.startsWith('ussoc-2018'),
                )
                .map(c => c.target_id),
            )
            .flat()
          const foundNoc2016 = foundUssoc2018
            .map(c =>
              crosswalk
                .filter(
                  s => s.source_id === c && s.target_id.startsWith('noc-2016'),
                )
                .map(c => c.target_id),
            )
            .flat()
          return foundNoc2016
            .map(c =>
              crosswalk
                .filter(
                  s => s.source_id === c && s.target_id.startsWith('noc-2021'),
                )
                .map(c => c.target_id),
            )
            .flat()
        }
        case 'ussoc-2018': {
          const foundIsco2008 = crosswalk
            .filter(
              c => c.source_id === code && c.target_id.startsWith('isco-2008'),
            )
            .map(c => c.target_id)
          const foundUssoc2010 = foundIsco2008
            .map(c =>
              crosswalk
                .filter(
                  s =>
                    s.source_id === c && s.target_id.startsWith('ussoc-2010'),
                )
                .map(c => c.target_id),
            )
            .flat()
          return foundUssoc2010
            .map(c =>
              crosswalk
                .filter(
                  s =>
                    s.source_id === c && s.target_id.startsWith('ussoc-2018'),
                )
                .map(c => c.target_id),
            )
            .flat()
        }
      }
    case 'isco-2008':
      switch (targetType) {
        case 'anzsco-2013':
        case 'anzsco-2022':
        case 'nol-2024':
        case 'osca-2024':
        case 'uksoc-2020':
        case 'ussoc-2010':
          return crosswalk
            .filter(
              c => c.source_id === code && c.target_id.startsWith(targetType),
            )
            .map(c => c.target_id)
        case 'isco-2008':
          return [code]
        case 'noc-2016': {
          const foundUssoc2010 = crosswalk
            .filter(
              c => c.source_id === code && c.target_id.startsWith('ussoc-2010'),
            )
            .map(c => c.target_id)
          const foundUssoc2018 = foundUssoc2010
            .map(c =>
              crosswalk
                .filter(
                  s =>
                    s.source_id === c && s.target_id.startsWith('ussoc-2018'),
                )
                .map(c => c.target_id),
            )
            .flat()
          return foundUssoc2018
            .map(c =>
              crosswalk
                .filter(
                  s => s.source_id === c && s.target_id.startsWith('noc-2016'),
                )
                .map(c => c.target_id),
            )
            .flat()
        }
        case 'noc-2021': {
          const foundUssoc2010 = crosswalk
            .filter(
              c => c.source_id === code && c.target_id.startsWith('ussoc-2010'),
            )
            .map(c => c.target_id)
          const foundUssoc2018 = foundUssoc2010
            .map(c =>
              crosswalk
                .filter(
                  s =>
                    s.source_id === c && s.target_id.startsWith('ussoc-2018'),
                )
                .map(c => c.target_id),
            )
            .flat()
          const foundNoc2016 = foundUssoc2018
            .map(c =>
              crosswalk
                .filter(
                  s => s.source_id === c && s.target_id.startsWith('noc-2016'),
                )
                .map(c => c.target_id),
            )
            .flat()
          return foundNoc2016
            .map(c =>
              crosswalk
                .filter(
                  s => s.source_id === c && s.target_id.startsWith('noc-2021'),
                )
                .map(c => c.target_id),
            )
            .flat()
        }
        case 'ussoc-2018': {
          const foundUssoc2010 = crosswalk
            .filter(
              c => c.source_id === code && c.target_id.startsWith('ussoc-2010'),
            )
            .map(c => c.target_id)
          return foundUssoc2010
            .map(c =>
              crosswalk
                .filter(
                  s =>
                    s.source_id === c && s.target_id.startsWith('ussoc-2018'),
                )
                .map(c => c.target_id),
            )
            .flat()
        }
      }
    case 'noc-2016':
      switch (targetType) {
        case 'anzsco-2013':
        case 'anzsco-2022':
        case 'nol-2024':
        case 'osca-2024':
        case 'uksoc-2020': {
          const foundUssoc2018 = crosswalk
            .filter(
              c => c.source_id === code && c.target_id.startsWith('ussoc-2018'),
            )
            .map(c => c.target_id)
          const foundUssoc2010 = foundUssoc2018
            .map(c =>
              crosswalk
                .filter(
                  s =>
                    s.source_id === c && s.target_id.startsWith('ussoc-2010'),
                )
                .map(c => c.target_id),
            )
            .flat()
          const foundIsco2008 = foundUssoc2010
            .map(c =>
              crosswalk
                .filter(
                  s => s.source_id === c && s.target_id.startsWith('isco-2008'),
                )
                .map(c => c.target_id),
            )
            .flat()
          return foundIsco2008
            .map(c =>
              crosswalk
                .filter(
                  s => s.source_id === c && s.target_id.startsWith(targetType),
                )
                .map(c => c.target_id),
            )
            .flat()
        }
        case 'isco-2008': {
          const foundUssoc2018 = crosswalk
            .filter(
              c => c.source_id === code && c.target_id.startsWith('ussoc-2018'),
            )
            .map(c => c.target_id)
          const foundUssoc2010 = foundUssoc2018
            .map(c =>
              crosswalk
                .filter(
                  s =>
                    s.source_id === c && s.target_id.startsWith('ussoc-2010'),
                )
                .map(c => c.target_id),
            )
            .flat()
          return foundUssoc2010
            .map(c =>
              crosswalk
                .filter(
                  s => s.source_id === c && s.target_id.startsWith('isco-2008'),
                )
                .map(c => c.target_id),
            )
            .flat()
        }
        case 'noc-2016':
          return [code]
        case 'noc-2021':
          return crosswalk
            .filter(
              c => c.source_id === code && c.target_id.startsWith('noc-2021'),
            )
            .map(c => c.target_id)
        case 'ussoc-2010': {
          const foundUssoc2018 = crosswalk
            .filter(
              c => c.source_id === code && c.target_id.startsWith('ussoc-2018'),
            )
            .map(c => c.target_id)
          return foundUssoc2018
            .map(c =>
              crosswalk
                .filter(
                  s =>
                    s.source_id === c && s.target_id.startsWith('ussoc-2010'),
                )
                .map(c => c.target_id),
            )
            .flat()
        }
        case 'ussoc-2018':
          return crosswalk
            .filter(
              c => c.source_id === code && c.target_id.startsWith('ussoc-2018'),
            )
            .map(c => c.target_id)
      }
    case 'noc-2021':
      switch (targetType) {
        case 'anzsco-2013':
        case 'anzsco-2022':
        case 'nol-2024':
        case 'osca-2024':
        case 'uksoc-2020': {
          const foundNoc2016 = crosswalk
            .filter(
              c => c.source_id === code && c.target_id.startsWith('noc-2016'),
            )
            .map(c => c.target_id)
          const foundUssoc2018 = foundNoc2016
            .map(c =>
              crosswalk
                .filter(
                  s =>
                    s.source_id === c && s.target_id.startsWith('ussoc-2018'),
                )
                .map(c => c.target_id),
            )
            .flat()
          const foundUssoc2010 = foundUssoc2018
            .map(c =>
              crosswalk
                .filter(
                  s =>
                    s.source_id === c && s.target_id.startsWith('ussoc-2010'),
                )
                .map(c => c.target_id),
            )
            .flat()
          const foundIsco2008 = foundUssoc2010
            .map(c =>
              crosswalk
                .filter(
                  s => s.source_id === c && s.target_id.startsWith('isco-2008'),
                )
                .map(c => c.target_id),
            )
            .flat()
          return foundIsco2008
            .map(c =>
              crosswalk
                .filter(
                  s => s.source_id === c && s.target_id.startsWith(targetType),
                )
                .map(c => c.target_id),
            )
            .flat()
        }
        case 'isco-2008': {
          const foundNoc2016 = crosswalk
            .filter(
              c => c.source_id === code && c.target_id.startsWith('noc-2016'),
            )
            .map(c => c.target_id)
          const foundUssoc2018 = foundNoc2016
            .map(c =>
              crosswalk
                .filter(
                  s =>
                    s.source_id === c && s.target_id.startsWith('ussoc-2018'),
                )
                .map(c => c.target_id),
            )
            .flat()
          const foundUssoc2010 = foundUssoc2018
            .map(c =>
              crosswalk
                .filter(
                  s =>
                    s.source_id === c && s.target_id.startsWith('ussoc-2010'),
                )
                .map(c => c.target_id),
            )
            .flat()
          return foundUssoc2010
            .map(c =>
              crosswalk
                .filter(
                  s => s.source_id === c && s.target_id.startsWith('isco-2008'),
                )
                .map(c => c.target_id),
            )
            .flat()
        }
        case 'noc-2016':
          return crosswalk
            .filter(
              c => c.source_id === code && c.target_id.startsWith('noc-2016'),
            )
            .map(c => c.target_id)
        case 'noc-2021':
          return [code]
        case 'ussoc-2010': {
          const foundNoc2016 = crosswalk
            .filter(
              c => c.source_id === code && c.target_id.startsWith('noc-2016'),
            )
            .map(c => c.target_id)
          const foundUssoc2018 = foundNoc2016
            .map(c =>
              crosswalk
                .filter(
                  s =>
                    s.source_id === c && s.target_id.startsWith('ussoc-2018'),
                )
                .map(c => c.target_id),
            )
            .flat()
          return foundUssoc2018
            .map(c =>
              crosswalk
                .filter(
                  s =>
                    s.source_id === c && s.target_id.startsWith('ussoc-2010'),
                )
                .map(c => c.target_id),
            )
            .flat()
        }
        case 'ussoc-2018': {
          const foundNoc2016 = crosswalk
            .filter(
              c => c.source_id === code && c.target_id.startsWith('noc-2016'),
            )
            .map(c => c.target_id)
          return foundNoc2016
            .map(c =>
              crosswalk
                .filter(
                  s =>
                    s.source_id === c && s.target_id.startsWith('ussoc-2018'),
                )
                .map(c => c.target_id),
            )
            .flat()
        }
      }
    case 'nol-2024':
      switch (targetType) {
        case 'anzsco-2013':
        case 'anzsco-2022':
        case 'osca-2024':
        case 'uksoc-2020':
        case 'ussoc-2010': {
          const foundIsco2008 = crosswalk
            .filter(
              c => c.source_id === code && c.target_id.startsWith('isco-2008'),
            )
            .map(c => c.target_id)
          return foundIsco2008
            .map(c =>
              crosswalk
                .filter(
                  s => s.source_id === c && s.target_id.startsWith(targetType),
                )
                .map(c => c.target_id),
            )
            .flat()
        }
        case 'isco-2008':
          return crosswalk
            .filter(
              c => c.source_id === code && c.target_id.startsWith('isco-2008'),
            )
            .map(c => c.target_id)
        case 'noc-2016': {
          const foundIsco2008 = crosswalk
            .filter(
              c => c.source_id === code && c.target_id.startsWith('isco-2008'),
            )
            .map(c => c.target_id)
          const foundUssoc2010 = foundIsco2008
            .map(c =>
              crosswalk
                .filter(
                  s =>
                    s.source_id === c && s.target_id.startsWith('ussoc-2010'),
                )
                .map(c => c.target_id),
            )
            .flat()
          const foundUssoc2018 = foundUssoc2010
            .map(c =>
              crosswalk
                .filter(
                  s =>
                    s.source_id === c && s.target_id.startsWith('ussoc-2018'),
                )
                .map(c => c.target_id),
            )
            .flat()
          return foundUssoc2018
            .map(c =>
              crosswalk
                .filter(
                  s => s.source_id === c && s.target_id.startsWith('noc-2016'),
                )
                .map(c => c.target_id),
            )
            .flat()
        }
        case 'noc-2021': {
          const foundIsco2008 = crosswalk
            .filter(
              c => c.source_id === code && c.target_id.startsWith('isco-2008'),
            )
            .map(c => c.target_id)
          const foundUssoc2010 = foundIsco2008
            .map(c =>
              crosswalk
                .filter(
                  s =>
                    s.source_id === c && s.target_id.startsWith('ussoc-2010'),
                )
                .map(c => c.target_id),
            )
            .flat()
          const foundUssoc2018 = foundUssoc2010
            .map(c =>
              crosswalk
                .filter(
                  s =>
                    s.source_id === c && s.target_id.startsWith('ussoc-2018'),
                )
                .map(c => c.target_id),
            )
            .flat()
          const foundNoc2016 = foundUssoc2018
            .map(c =>
              crosswalk
                .filter(
                  s => s.source_id === c && s.target_id.startsWith('noc-2016'),
                )
                .map(c => c.target_id),
            )
            .flat()
          return foundNoc2016
            .map(c =>
              crosswalk
                .filter(
                  s => s.source_id === c && s.target_id.startsWith('noc-2021'),
                )
                .map(c => c.target_id),
            )
            .flat()
        }
        case 'nol-2024':
          return [code]
        case 'ussoc-2018': {
          const foundIsco2008 = crosswalk
            .filter(
              c => c.source_id === code && c.target_id.startsWith('isco-2008'),
            )
            .map(c => c.target_id)
          const foundUssoc2010 = foundIsco2008
            .map(c =>
              crosswalk
                .filter(
                  s =>
                    s.source_id === c && s.target_id.startsWith('ussoc-2010'),
                )
                .map(c => c.target_id),
            )
            .flat()
          return foundUssoc2010
            .map(c =>
              crosswalk
                .filter(
                  s =>
                    s.source_id === c && s.target_id.startsWith('ussoc-2018'),
                )
                .map(c => c.target_id),
            )
            .flat()
        }
      }
    case 'osca-2024':
      switch (targetType) {
        case 'anzsco-2013':
        case 'anzsco-2022':
        case 'nol-2024':
        case 'uksoc-2020':
        case 'ussoc-2010': {
          const foundIsco2008 = crosswalk
            .filter(
              c => c.source_id === code && c.target_id.startsWith('isco-2008'),
            )
            .map(c => c.target_id)
          return foundIsco2008
            .map(c =>
              crosswalk
                .filter(
                  s => s.source_id === c && s.target_id.startsWith(targetType),
                )
                .map(c => c.target_id),
            )
            .flat()
        }
        case 'isco-2008':
          return crosswalk
            .filter(
              c => c.source_id === code && c.target_id.startsWith('isco-2008'),
            )
            .map(c => c.target_id)
        case 'noc-2016': {
          const foundIsco2008 = crosswalk
            .filter(
              c => c.source_id === code && c.target_id.startsWith('isco-2008'),
            )
            .map(c => c.target_id)
          const foundUssoc2010 = foundIsco2008
            .map(c =>
              crosswalk
                .filter(
                  s =>
                    s.source_id === c && s.target_id.startsWith('ussoc-2010'),
                )
                .map(c => c.target_id),
            )
            .flat()
          const foundUssoc2018 = foundUssoc2010
            .map(c =>
              crosswalk
                .filter(
                  s =>
                    s.source_id === c && s.target_id.startsWith('ussoc-2018'),
                )
                .map(c => c.target_id),
            )
            .flat()
          return foundUssoc2018
            .map(c =>
              crosswalk
                .filter(
                  s => s.source_id === c && s.target_id.startsWith('noc-2016'),
                )
                .map(c => c.target_id),
            )
            .flat()
        }
        case 'noc-2021': {
          const foundIsco2008 = crosswalk
            .filter(
              c => c.source_id === code && c.target_id.startsWith('isco-2008'),
            )
            .map(c => c.target_id)
          const foundUssoc2010 = foundIsco2008
            .map(c =>
              crosswalk
                .filter(
                  s =>
                    s.source_id === c && s.target_id.startsWith('ussoc-2010'),
                )
                .map(c => c.target_id),
            )
            .flat()
          const foundUssoc2018 = foundUssoc2010
            .map(c =>
              crosswalk
                .filter(
                  s =>
                    s.source_id === c && s.target_id.startsWith('ussoc-2018'),
                )
                .map(c => c.target_id),
            )
            .flat()
          const foundNoc2016 = foundUssoc2018
            .map(c =>
              crosswalk
                .filter(
                  s => s.source_id === c && s.target_id.startsWith('noc-2016'),
                )
                .map(c => c.target_id),
            )
            .flat()
          return foundNoc2016
            .map(c =>
              crosswalk
                .filter(
                  s => s.source_id === c && s.target_id.startsWith('noc-2021'),
                )
                .map(c => c.target_id),
            )
            .flat()
        }
        case 'osca-2024':
          return [code]
        case 'ussoc-2018': {
          const foundIsco2008 = crosswalk
            .filter(
              c => c.source_id === code && c.target_id.startsWith('isco-2008'),
            )
            .map(c => c.target_id)
          const foundUssoc2010 = foundIsco2008
            .map(c =>
              crosswalk
                .filter(
                  s =>
                    s.source_id === c && s.target_id.startsWith('ussoc-2010'),
                )
                .map(c => c.target_id),
            )
            .flat()
          return foundUssoc2010
            .map(c =>
              crosswalk
                .filter(
                  s =>
                    s.source_id === c && s.target_id.startsWith('ussoc-2018'),
                )
                .map(c => c.target_id),
            )
            .flat()
        }
      }
    case 'uksoc-2020':
      switch (targetType) {
        case 'anzsco-2013':
        case 'anzsco-2022':
        case 'nol-2024':
        case 'osca-2024':
        case 'ussoc-2010': {
          const foundIsco2008 = crosswalk
            .filter(
              c => c.source_id === code && c.target_id.startsWith('isco-2008'),
            )
            .map(c => c.target_id)
          return foundIsco2008
            .map(c =>
              crosswalk
                .filter(
                  s => s.source_id === c && s.target_id.startsWith(targetType),
                )
                .map(c => c.target_id),
            )
            .flat()
        }
        case 'isco-2008':
          return crosswalk
            .filter(
              c => c.source_id === code && c.target_id.startsWith('isco-2008'),
            )
            .map(c => c.target_id)
        case 'noc-2016': {
          const foundIsco2008 = crosswalk
            .filter(
              c => c.source_id === code && c.target_id.startsWith('isco-2008'),
            )
            .map(c => c.target_id)
          const foundUssoc2010 = foundIsco2008
            .map(c =>
              crosswalk
                .filter(
                  s =>
                    s.source_id === c && s.target_id.startsWith('ussoc-2010'),
                )
                .map(c => c.target_id),
            )
            .flat()
          const foundUssoc2018 = foundUssoc2010
            .map(c =>
              crosswalk
                .filter(
                  s =>
                    s.source_id === c && s.target_id.startsWith('ussoc-2018'),
                )
                .map(c => c.target_id),
            )
            .flat()
          return foundUssoc2018
            .map(c =>
              crosswalk
                .filter(
                  s => s.source_id === c && s.target_id.startsWith('noc-2016'),
                )
                .map(c => c.target_id),
            )
            .flat()
        }
        case 'noc-2021': {
          const foundIsco2008 = crosswalk
            .filter(
              c => c.source_id === code && c.target_id.startsWith('isco-2008'),
            )
            .map(c => c.target_id)
          const foundUssoc2010 = foundIsco2008
            .map(c =>
              crosswalk
                .filter(
                  s =>
                    s.source_id === c && s.target_id.startsWith('ussoc-2010'),
                )
                .map(c => c.target_id),
            )
            .flat()
          const foundUssoc2018 = foundUssoc2010
            .map(c =>
              crosswalk
                .filter(
                  s =>
                    s.source_id === c && s.target_id.startsWith('ussoc-2018'),
                )
                .map(c => c.target_id),
            )
            .flat()
          const foundNoc2016 = foundUssoc2018
            .map(c =>
              crosswalk
                .filter(
                  s => s.source_id === c && s.target_id.startsWith('noc-2016'),
                )
                .map(c => c.target_id),
            )
            .flat()
          return foundNoc2016
            .map(c =>
              crosswalk
                .filter(
                  s => s.source_id === c && s.target_id.startsWith('noc-2021'),
                )
                .map(c => c.target_id),
            )
            .flat()
        }
        case 'uksoc-2020':
          return [code]
        case 'ussoc-2018': {
          const foundIsco2008 = crosswalk
            .filter(
              c => c.source_id === code && c.target_id.startsWith('isco-2008'),
            )
            .map(c => c.target_id)
          const foundUssoc2010 = foundIsco2008
            .map(c =>
              crosswalk
                .filter(
                  s =>
                    s.source_id === c && s.target_id.startsWith('ussoc-2010'),
                )
                .map(c => c.target_id),
            )
            .flat()
          return foundUssoc2010
            .map(c =>
              crosswalk
                .filter(
                  s =>
                    s.source_id === c && s.target_id.startsWith('ussoc-2018'),
                )
                .map(c => c.target_id),
            )
            .flat()
        }
      }
    case 'ussoc-2010':
      switch (targetType) {
        case 'anzsco-2013':
        case 'anzsco-2022':
        case 'nol-2024':
        case 'osca-2024':
        case 'uksoc-2020': {
          const foundIsco2008 = crosswalk
            .filter(
              c => c.source_id === code && c.target_id.startsWith('isco-2008'),
            )
            .map(c => c.target_id)
          return foundIsco2008
            .map(c =>
              crosswalk
                .filter(
                  s => s.source_id === c && s.target_id.startsWith(targetType),
                )
                .map(c => c.target_id),
            )
            .flat()
        }
        case 'isco-2008':
          return crosswalk
            .filter(
              c => c.source_id === code && c.target_id.startsWith('isco-2008'),
            )
            .map(c => c.target_id)
        case 'noc-2016': {
          const foundUssoc2018 = crosswalk
            .filter(
              c => c.source_id === code && c.target_id.startsWith('ussoc-2018'),
            )
            .map(c => c.target_id)
          return foundUssoc2018
            .map(c =>
              crosswalk
                .filter(
                  s => s.source_id === c && s.target_id.startsWith('noc-2016'),
                )
                .map(c => c.target_id),
            )
            .flat()
        }
        case 'noc-2021': {
          const foundUssoc2018 = crosswalk
            .filter(
              c => c.source_id === code && c.target_id.startsWith('ussoc-2018'),
            )
            .map(c => c.target_id)
          const foundNoc2016 = foundUssoc2018
            .map(c =>
              crosswalk
                .filter(
                  s => s.source_id === c && s.target_id.startsWith('noc-2016'),
                )
                .map(c => c.target_id),
            )
            .flat()
          return foundNoc2016
            .map(c =>
              crosswalk
                .filter(
                  s => s.source_id === c && s.target_id.startsWith('noc-2021'),
                )
                .map(c => c.target_id),
            )
            .flat()
        }
        case 'ussoc-2010':
          return [code]
        case 'ussoc-2018':
          return crosswalk
            .filter(
              c => c.source_id === code && c.target_id.startsWith('ussoc-2018'),
            )
            .map(c => c.target_id)
      }
    case 'ussoc-2018':
      switch (targetType) {
        case 'anzsco-2013':
        case 'anzsco-2022':
        case 'nol-2024':
        case 'osca-2024':
        case 'uksoc-2020': {
          const foundUssoc2010 = crosswalk
            .filter(
              c => c.source_id === code && c.target_id.startsWith('ussoc-2018'),
            )
            .map(c => c.target_id)
          const foundIsco2008 = foundUssoc2010
            .map(c =>
              crosswalk
                .filter(
                  s => s.source_id === c && s.target_id.startsWith('isco-2008'),
                )
                .map(c => c.target_id),
            )
            .flat()
          return foundIsco2008
            .map(c =>
              crosswalk
                .filter(
                  s => s.source_id === c && s.target_id.startsWith(targetType),
                )
                .map(c => c.target_id),
            )
            .flat()
        }
        case 'isco-2008': {
          const foundUssoc2010 = crosswalk
            .filter(
              c => c.source_id === code && c.target_id.startsWith('ussoc-2018'),
            )
            .map(c => c.target_id)
          return foundUssoc2010
            .map(c =>
              crosswalk
                .filter(
                  s => s.source_id === c && s.target_id.startsWith('isco-2008'),
                )
                .map(c => c.target_id),
            )
            .flat()
        }
        case 'noc-2016':
          return crosswalk
            .filter(
              c => c.source_id === code && c.target_id.startsWith('noc-2016'),
            )
            .map(c => c.target_id)
        case 'noc-2021': {
          const foundNoc2016 = crosswalk
            .filter(
              c => c.source_id === code && c.target_id.startsWith('noc-2016'),
            )
            .map(c => c.target_id)
          return foundNoc2016
            .map(c =>
              crosswalk
                .filter(
                  s => s.source_id === c && s.target_id.startsWith('noc-2021'),
                )
                .map(c => c.target_id),
            )
            .flat()
        }
        case 'ussoc-2010':
          return crosswalk
            .filter(
              c => c.source_id === code && c.target_id.startsWith('ussoc-2010'),
            )
            .map(c => c.target_id)
        case 'ussoc-2018':
          return [code]
      }
  }
}

export const getOccupationCodesSimilarity = (
  crosswalk: OccupationCodeCrosswalk[],
  expected: OccupationCodesFilter,
  actual: OccupationCodes,
) => {
  const sourceCodes = convertOccupationClassification(
    crosswalk,
    actual.primary.code,
    actual.primary.kind,
    expected.kind,
  )

  for (const sourceCode of sourceCodes) {
    for (const targetCode of expected.codes) {
      if (occupationMatches(expected.kind, sourceCode, targetCode)) {
        return 1
      }
    }
  }

  return 0
}
