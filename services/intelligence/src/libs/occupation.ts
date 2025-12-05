import type { OccupationCodeClassification } from '@resettle/schema/intelligence'

/**
 * Get the crosswalk path
 * @param from - The from classification
 * @param to - The to classification
 * @returns The crosswalk path
 */
export const getCrosswalkPath = (
  from: OccupationCodeClassification,
  to: OccupationCodeClassification,
): OccupationCodeClassification[] => {
  switch (from) {
    case 'anzsco-2013':
      switch (to) {
        case 'anzsco-2022':
        case 'nol-2024':
        case 'osca-2024':
        case 'uksoc-2020':
        case 'ussoc-2010':
          return ['isco-2008', to]
        case 'noc-2016':
          return ['isco-2008', 'ussoc-2010', 'ussoc-2018', to]
        case 'noc-2021':
          return ['isco-2008', 'ussoc-2010', 'ussoc-2018', 'noc-2016', to]
        case 'ussoc-2018':
          return ['isco-2008', 'ussoc-2010', to]
        case 'isco-2008':
          return [to]
      }

      return []
    case 'anzsco-2022':
      switch (to) {
        case 'anzsco-2013':
        case 'nol-2024':
        case 'osca-2024':
        case 'uksoc-2020':
        case 'ussoc-2010':
          return ['isco-2008', to]
        case 'noc-2016':
          return ['isco-2008', 'ussoc-2010', 'ussoc-2018', to]
        case 'noc-2021':
          return ['isco-2008', 'ussoc-2010', 'ussoc-2018', 'noc-2016', to]
        case 'ussoc-2018':
          return ['isco-2008', 'ussoc-2010', to]
        case 'isco-2008':
          return [to]
      }

      return []
    case 'isco-2008':
      switch (to) {
        case 'noc-2016':
          return ['ussoc-2010', 'ussoc-2018', to]
        case 'noc-2021':
          return ['ussoc-2010', 'ussoc-2018', 'noc-2016', to]
        case 'ussoc-2018':
          return ['ussoc-2010', to]
        case 'anzsco-2013':
        case 'anzsco-2022':
        case 'nol-2024':
        case 'osca-2024':
        case 'uksoc-2020':
        case 'ussoc-2010':
          return [to]
      }

      return []
    case 'noc-2016':
      switch (to) {
        case 'anzsco-2013':
        case 'anzsco-2022':
        case 'nol-2024':
        case 'osca-2024':
        case 'uksoc-2020':
          return ['ussoc-2018', 'ussoc-2010', 'isco-2008', to]
        case 'isco-2008':
          return ['ussoc-2018', 'ussoc-2010', to]
        case 'ussoc-2010':
          return ['ussoc-2018', to]
        case 'noc-2021':
        case 'ussoc-2018':
          return [to]
      }

      return []
    case 'noc-2021':
      switch (to) {
        case 'anzsco-2013':
        case 'anzsco-2022':
        case 'nol-2024':
        case 'osca-2024':
        case 'uksoc-2020':
          return ['noc-2016', 'ussoc-2018', 'ussoc-2010', 'isco-2008', to]
        case 'isco-2008':
          return ['noc-2016', 'ussoc-2018', 'ussoc-2010', to]
        case 'ussoc-2010':
          return ['noc-2016', 'ussoc-2018', to]
        case 'ussoc-2018':
          return ['noc-2016', to]
        case 'noc-2016':
          return [to]
      }

      return []
    case 'nol-2024':
      switch (to) {
        case 'anzsco-2013':
        case 'anzsco-2022':
        case 'osca-2024':
        case 'uksoc-2020':
        case 'ussoc-2010':
          return ['isco-2008', to]
        case 'noc-2016':
          return ['isco-2008', 'ussoc-2010', 'ussoc-2018', to]
        case 'noc-2021':
          return ['isco-2008', 'ussoc-2010', 'ussoc-2018', 'noc-2016', to]
        case 'ussoc-2018':
          return ['isco-2008', 'ussoc-2010', to]
        case 'isco-2008':
          return [to]
      }

      return []
    case 'osca-2024':
      switch (to) {
        case 'anzsco-2013':
        case 'anzsco-2022':
        case 'nol-2024':
        case 'uksoc-2020':
        case 'ussoc-2010':
          return ['isco-2008', to]
        case 'noc-2016':
          return ['isco-2008', 'ussoc-2010', 'ussoc-2018', to]
        case 'noc-2021':
          return ['isco-2008', 'ussoc-2010', 'ussoc-2018', 'noc-2016', to]
        case 'ussoc-2018':
          return ['isco-2008', 'ussoc-2010', to]
        case 'isco-2008':
          return [to]
      }

      return []
    case 'uksoc-2020':
      switch (to) {
        case 'anzsco-2013':
        case 'anzsco-2022':
        case 'nol-2024':
        case 'osca-2024':
        case 'ussoc-2010':
          return ['isco-2008', to]
        case 'noc-2016':
          return ['isco-2008', 'ussoc-2010', 'ussoc-2018', to]
        case 'noc-2021':
          return ['isco-2008', 'ussoc-2010', 'ussoc-2018', 'noc-2016', to]
        case 'ussoc-2018':
          return ['isco-2008', 'ussoc-2010', to]
        case 'isco-2008':
          return [to]
      }

      return []
    case 'ussoc-2010':
      switch (to) {
        case 'anzsco-2013':
        case 'anzsco-2022':
        case 'nol-2024':
        case 'osca-2024':
        case 'uksoc-2020':
          return ['isco-2008', to]
        case 'noc-2016':
          return ['ussoc-2018', to]
        case 'noc-2021':
          return ['ussoc-2018', 'noc-2016', to]
        case 'isco-2008':
        case 'ussoc-2018':
          return [to]
      }

      return []
    case 'ussoc-2018':
      switch (to) {
        case 'anzsco-2013':
        case 'anzsco-2022':
        case 'nol-2024':
        case 'osca-2024':
        case 'uksoc-2020':
          return ['ussoc-2010', 'isco-2008', to]
        case 'noc-2021':
          return ['noc-2016', to]
        case 'isco-2008':
          return ['ussoc-2010', to]
        case 'noc-2016':
        case 'ussoc-2010':
          return [to]
      }

      return []
  }
}

/**
 * Get the crosswalk pairs
 * @param from - The from classification
 * @param to - The to classification
 * @returns The crosswalk pairs
 */
export const getCrosswalkPairs = (
  from: OccupationCodeClassification,
  to: OccupationCodeClassification,
): [OccupationCodeClassification, OccupationCodeClassification][] => {
  if (from === to) return []

  const path = getCrosswalkPath(from, to)
  const pairs: [OccupationCodeClassification, OccupationCodeClassification][] =
    []

  for (let i = 0; i < path.length; i++) {
    if (i === 0) {
      pairs.push([from, path[i]])
      continue
    }

    pairs.push([path[i - 1], path[i]])
  }

  return pairs
}
