import type { S3Client } from '@3rd-party-clients/s3'
import type {
  GlobalDatabase,
  OccupationCodeCrosswalkTable,
  OccupationCodeTable,
} from '@resettle/database/global'
import { parse } from 'csv-parse/sync'
import type { Insertable, Kysely } from 'kysely'
import { read, type WorkSheet } from 'xlsx'

import { loadFile, refDirToRef, type RefDir } from '../utils'

type Anzsco2013InputDataRow = {
  Code: string
  Descriptor: string
}

type Isco2008InputDataRow = {
  ISCO_version: 'ISCO-08' | 'ISCO-88' | 'ISCO-68' | 'ISCO-58'
  major: string
  major_label: string
  sub_major: string
  sub_major_label: string
  minor: string
  minor_label: string
  unit: string
  description: string
}

type Noc2016InputDataRow = {
  Level: '1' | '2' | '3' | '4'
  'Hierarchical structure': string
  Code: string
  'Class title': string
  'Class definition': string
}

type Noc2021InputDataRow = {
  Level: '1' | '2' | '3' | '4' | '5'
  'Hierarchical structure': string
  'Code - NOC 2021 V1.0': string
  'Class title': string
  'Class definition': string
}

type Nol2024InputDataRow = {
  Code: string
  Descriptor: string
}

type Uksoc2020InputDataRow = {
  'Unique ID': string
  'SOC2020 Major Group': string
  'SOC2020 Sub-Major Group': string
  'SOC2020 Minor Group': string
  'SOC2020 Unit Group': string
  'SOC2020 Group Title': string
  Change: string
  VERSNO: string
}

type AnzscoIscoType1Row = {
  isco_code: string
  anzsco_codes: Set<string>
}

type AnzscoIscoType2Row = {
  anzsco_code: string
  isco_codes: Set<string>
}

type IscoNolInputDataRow = {
  'NOL V1.0.0': string
  'NOL Label': string
  'Map Type': string
  'ISCO08 V1.0.0': string
  'ISCO Label': string
}

type IscoNolType1Row = {
  isco_code: string
  nol_codes: string[]
}

type IscoNolType2Row = {
  nol_code: string
  isco_codes: string[]
}

type IscoOscaType1Row = {
  isco_code: string
  osca_codes: Set<string>
}

type IscoOscaType2Row = {
  osca_code: string
  isco_codes: Set<string>
}

type IscoUksocInputDataRow = {
  'UNIQUE ID': string
  RECNO: string
  D: string
  SOC_90: string
  SOC_2000: string
  SOC_2010: string
  SOC_2020: string
  SOC_2020_ext: string
  INDEXOCC: string
  ADD: string
  IND: string
  SEE: string
  'ISCO-08 code based on SOC2020': string
  VERSNO: string
  CHANGE: string
  SOC90_unit_group_title: string
  SOC2000_unit_group_title: string
  SOC2010_unit_group_title: string
  SOC2020_unit_group_title: string
  SOC2020_ext_SUG_title: string
  ISCO08_unit_group_title: string
  'INDEXOCC_-_natural_word_order': string
}

type IscoUksocType1Row = {
  isco_code: string
  uksoc_codes: Set<string>
}

type IscoUksocType2Row = {
  uksoc_code: string
  isco_codes: Set<string>
}

type IscoUssocType1Row = {
  isco_code: string
  ussoc_codes: Set<string>
}

type IscoUssocType2Row = {
  ussoc_code: string
  isco_codes: Set<string>
}

type NocNocInputDataRow = {
  'NOC 2016 V1.3 Code': string
  'NOC 2016 V1.3 Title': string
  'GSIM Type of Change': string
  'NOC 2021 V1.0 Code': string
  'NOC 2021 V1.0 Title': string
  Notes: string
}

type NocNocType1Row = {
  noc2016_code: string
  noc2021_codes: Set<string>
}

type NocNocType2Row = {
  noc2021_code: string
  noc2016_codes: Set<string>
}

type NocUssocInputDataRow = {
  'SOC 2018 (US) Code': string
  'SOC 2018 (US) Title': string
  Partial: string
  'NOC 2016  Version 1.3 Code': string
  'NOC 2016  Version 1.3 Title': string
  'Explanatory Notes': string
}

type NocUssocType1Row = {
  noc_code: string
  ussoc_codes: Set<string>
}

type NocUssocType2Row = {
  ussoc_code: string
  noc_codes: Set<string>
}

type UssocUssocType1Row = {
  ussoc2010_code: string
  ussoc2018_codes: Set<string>
}

type UssocUssocType2Row = {
  ussoc2018_code: string
  ussoc2010_codes: Set<string>
}

const parseAnzsco2013 = async (ctx: { s3: S3Client }, ref: RefDir) => {
  const result = await loadFile(
    ctx,
    refDirToRef(ref, 'occupation/anzsco2013.csv'),
    {
      stream: false,
    },
  )
  if (!result.success) {
    throw new Error(`Error loading occupation/anzsco2013.csv`)
  }

  const rows = parse(result.data, {
    columns: ['Code', 'Descriptor', null],
    skip_empty_lines: true,
    trim: true,
    from_line: 2,
  }) as Anzsco2013InputDataRow[]

  return rows.map(
    r =>
      ({
        id: `anzsco-2013-${r.Code}`,
        classification: 'anzsco-2013',
        code: r.Code,
        label: r.Descriptor,
      }) as Insertable<OccupationCodeTable>,
  )
}

const parseAnzsco2022 = async (ctx: { s3: S3Client }, ref: RefDir) => {
  const result = await loadFile(
    ctx,
    refDirToRef(ref, 'occupation/anzsco2022.xlsx'),
    {
      stream: false,
    },
  )
  if (!result.success) {
    throw new Error(`Error loading occupation/anzsco2022.xlsx`)
  }

  const tryParseOccupation = (
    sheet: WorkSheet,
    startRow: number,
  ): {
    occupations: {
      occupation_code: string
      occupation_label: string
    }[]
    endRow: number
  } => {
    const occupations: {
      occupation_code: string
      occupation_label: string
    }[] = []
    let current = startRow
    do {
      const labelSlot = sheet[`F${current}`]
      occupations.push({
        occupation_code: sheet[`E${current}`].w,
        occupation_label: labelSlot.w,
      })
      current++
    } while (sheet[`F${current}`])

    return { occupations, endRow: current - 1 }
  }

  const tryParseUnit = (
    sheet: WorkSheet,
    startRow: number,
  ): {
    units: {
      unit_code: string
      unit_label: string
      occupations: {
        occupation_code: string
        occupation_label: string
      }[]
    }[]
    endRow: number
  } => {
    const units: {
      unit_code: string
      unit_label: string
      occupations: {
        occupation_code: string
        occupation_label: string
      }[]
    }[] = []
    let current = startRow
    do {
      const labelSlot = sheet[`E${current}`]
      const { occupations, endRow } = tryParseOccupation(sheet, current + 1)
      units.push({
        unit_code: sheet[`D${current}`].w,
        unit_label: labelSlot.w,
        occupations,
      })
      current = endRow + 1
    } while (sheet[`E${current}`])

    return { units, endRow: current - 1 }
  }

  const tryParseMinor = (
    sheet: WorkSheet,
    startRow: number,
  ): {
    minors: {
      minor_code: string
      minor_label: string
      units: {
        unit_code: string
        unit_label: string
        occupations: {
          occupation_code: string
          occupation_label: string
        }[]
      }[]
    }[]
    endRow: number
  } => {
    const minors: {
      minor_code: string
      minor_label: string
      units: {
        unit_code: string
        unit_label: string
        occupations: {
          occupation_code: string
          occupation_label: string
        }[]
      }[]
    }[] = []
    let current = startRow
    do {
      const labelSlot = sheet[`D${current}`]
      const { units, endRow } = tryParseUnit(sheet, current + 1)
      minors.push({
        minor_code: sheet[`C${current}`].w,
        minor_label: labelSlot.w,
        units,
      })
      current = endRow + 1
    } while (sheet[`D${current}`])

    return { minors, endRow: current - 1 }
  }

  const tryParseSubMajor = (
    sheet: WorkSheet,
    startRow: number,
  ): {
    sub_majors: {
      sub_major_code: string
      sub_major_label: string
      minors: {
        minor_code: string
        minor_label: string
        units: {
          unit_code: string
          unit_label: string
          occupations: {
            occupation_code: string
            occupation_label: string
          }[]
        }[]
      }[]
    }[]
    endRow: number
  } => {
    const sub_majors: {
      sub_major_code: string
      sub_major_label: string
      minors: {
        minor_code: string
        minor_label: string
        units: {
          unit_code: string
          unit_label: string
          occupations: {
            occupation_code: string
            occupation_label: string
          }[]
        }[]
      }[]
    }[] = []
    let current = startRow
    do {
      const labelSlot = sheet[`C${current}`]
      const { minors, endRow } = tryParseMinor(sheet, current + 1)
      sub_majors.push({
        sub_major_code: sheet[`B${current}`].w,
        sub_major_label: labelSlot.w,
        minors,
      })
      current = endRow + 1
    } while (sheet[`C${current}`])

    return { sub_majors, endRow: current - 1 }
  }

  const tryParseMajor = (
    sheet: WorkSheet,
    startRow: number,
    endRow: number,
  ): {
    major_code: string
    major_label: string
    sub_majors: {
      sub_major_code: string
      sub_major_label: string
      minors: {
        minor_code: string
        minor_label: string
        units: {
          unit_code: string
          unit_label: string
          occupations: {
            occupation_code: string
            occupation_label: string
          }[]
        }[]
      }[]
    }[]
  }[] => {
    const majors: {
      major_code: string
      major_label: string
      sub_majors: {
        sub_major_code: string
        sub_major_label: string
        minors: {
          minor_code: string
          minor_label: string
          units: {
            unit_code: string
            unit_label: string
            occupations: {
              occupation_code: string
              occupation_label: string
            }[]
          }[]
        }[]
      }[]
    }[] = []
    let current = startRow
    do {
      const labelSlot = sheet[`B${current}`]
      if (!labelSlot) {
        current++
        continue
      }
      const { sub_majors, endRow } = tryParseSubMajor(sheet, current + 1)
      majors.push({
        major_code: sheet[`A${current}`].w,
        major_label: labelSlot.w,
        sub_majors,
      })
      current = endRow + 1
    } while (current <= endRow)

    return majors
  }

  const wb = read(result.data)
  const completeSheet = wb.Sheets['Table 5']
  const majors = tryParseMajor(completeSheet, 11, 1607)
  const rows: Insertable<OccupationCodeTable>[] = []
  for (const major of majors) {
    rows.push({
      id: `anzsco-2022-${major.major_code}`,
      code: major.major_code,
      label: major.major_label,
      classification: 'anzsco-2022',
    })

    for (const subMajor of major.sub_majors) {
      rows.push({
        id: `anzsco-2022-${subMajor.sub_major_code}`,
        code: subMajor.sub_major_code,
        label: subMajor.sub_major_label,
        classification: 'anzsco-2022',
      })

      for (const minor of subMajor.minors) {
        rows.push({
          id: `anzsco-2022-${minor.minor_code}`,
          code: minor.minor_code,
          label: minor.minor_label,
          classification: 'anzsco-2022',
        })

        for (const unit of minor.units) {
          rows.push({
            id: `anzsco-2022-${unit.unit_code}`,
            code: unit.unit_code,
            label: unit.unit_label,
            classification: 'anzsco-2022',
          })

          for (const occ of unit.occupations) {
            rows.push({
              id: `anzsco-2022-${occ.occupation_code}`,
              code: occ.occupation_code,
              label: occ.occupation_label,
              classification: 'anzsco-2022',
            })
          }
        }
      }
    }
  }

  return rows
}

const parseIsco2008 = async (ctx: { s3: S3Client }, ref: RefDir) => {
  const result = await loadFile(
    ctx,
    refDirToRef(ref, 'occupation/isco2008.csv'),
    {
      stream: false,
    },
  )
  if (!result.success) {
    throw new Error(`Error loading occupation/isco2008.csv`)
  }

  let rows = parse(result.data, {
    columns: [
      'ISCO_version',
      'major',
      'major_label',
      'sub_major',
      'sub_major_label',
      'minor',
      'minor_label',
      'unit',
      'description',
    ],
    skip_empty_lines: true,
    trim: true,
    from_line: 2,
  }) as Isco2008InputDataRow[]
  rows = rows.filter(r => r.ISCO_version === 'ISCO-08')
  const map = new Map<string, Insertable<OccupationCodeTable>>()
  for (const row of rows) {
    let subMajor = row.sub_major
    let minor = row.minor
    let unit = row.unit
    if (row.major === '0') {
      subMajor = '0' + subMajor
      minor = '0' + minor
      unit = '0' + unit
    }
    map.set(row.major, {
      id: `isco-2008-${row.major}`,
      classification: 'isco-2008',
      code: row.major,
      label: row.major_label,
    })

    map.set(subMajor, {
      id: `isco-2008-${subMajor}`,
      classification: 'isco-2008',
      code: subMajor,
      label: row.sub_major_label,
    })

    map.set(minor, {
      id: `isco-2008-${minor}`,
      classification: 'isco-2008',
      code: minor,
      label: row.minor_label,
    })

    map.set(unit, {
      id: `isco-2008-${unit}`,
      classification: 'isco-2008',
      code: unit,
      label: row.description,
    })
  }

  return [...map.values()]
}

const parseNoc2016 = async (ctx: { s3: S3Client }, ref: RefDir) => {
  const result = await loadFile(
    ctx,
    refDirToRef(ref, 'occupation/noc2016.csv'),
    {
      stream: false,
    },
  )
  if (!result.success) {
    throw new Error(`Error loading occupation/noc2016.csv`)
  }

  const rows = parse(result.data, {
    columns: [
      'Level',
      'Hierarchical structure',
      'Code',
      'Class title',
      'Class definition',
    ],
    skip_empty_lines: true,
    trim: true,
    from_line: 2,
  }) as Noc2016InputDataRow[]

  return rows.map(
    r =>
      ({
        id: `noc-2016-${r.Code}`,
        classification: 'noc-2016',
        code: r.Code,
        label: r['Class title'],
      }) as Insertable<OccupationCodeTable>,
  )
}

const parseNoc2021 = async (ctx: { s3: S3Client }, ref: RefDir) => {
  const result = await loadFile(
    ctx,
    refDirToRef(ref, 'occupation/noc2021.csv'),
    {
      stream: false,
    },
  )
  if (!result.success) {
    throw new Error(`Error loading occupation/noc2021.csv`)
  }

  const rows = parse(result.data, {
    columns: [
      'Level',
      'Hierarchical structure',
      'Code - NOC 2021 V1.0',
      'Class title',
      'Class definition',
    ],
    skip_empty_lines: true,
    trim: true,
    from_line: 2,
  }) as Noc2021InputDataRow[]

  return rows.map(
    r =>
      ({
        id: `noc-2021-${r['Code - NOC 2021 V1.0']}`,
        classification: 'noc-2021',
        code: r['Code - NOC 2021 V1.0'],
        label: r['Class title'],
      }) as Insertable<OccupationCodeTable>,
  )
}

const parseNol2024 = async (ctx: { s3: S3Client }, ref: RefDir) => {
  const majorResult = await loadFile(
    ctx,
    refDirToRef(ref, 'occupation/nol2024-major.csv'),
    { stream: false },
  )
  if (!majorResult.success) {
    throw new Error(`Error loading occupation/nol2024-major.csv`)
  }

  const subMajorResult = await loadFile(
    ctx,
    refDirToRef(ref, 'occupation/nol2024-sub-major.csv'),
    { stream: false },
  )
  if (!subMajorResult.success) {
    throw new Error(`Error loading occupation/nol2024-sub-major.csv`)
  }

  const minorResult = await loadFile(
    ctx,
    refDirToRef(ref, 'occupation/nol2024-minor.csv'),
    { stream: false },
  )
  if (!minorResult.success) {
    throw new Error(`Error loading occupation/nol2024-minor.csv`)
  }

  const unitResult = await loadFile(
    ctx,
    refDirToRef(ref, 'occupation/nol2024-unit.csv'),
    {
      stream: false,
    },
  )
  if (!unitResult.success) {
    throw new Error(`Error loading occupation/nol2024-unit.csv`)
  }

  const majorRows = parse(majorResult.data, {
    columns: ['Code', 'Descriptor', null],
    skip_empty_lines: true,
    trim: true,
    from_line: 2,
  }) as Nol2024InputDataRow[]
  const subMajorRows = parse(subMajorResult.data, {
    columns: ['Code', 'Descriptor', null],
    skip_empty_lines: true,
    trim: true,
    from_line: 2,
  }) as Nol2024InputDataRow[]
  const minorRows = parse(minorResult.data, {
    columns: ['Code', 'Descriptor', null],
    skip_empty_lines: true,
    trim: true,
    from_line: 2,
  }) as Nol2024InputDataRow[]
  const unitRows = parse(unitResult.data, {
    columns: ['Code', 'Descriptor', null],
    skip_empty_lines: true,
    trim: true,
    from_line: 2,
  }) as Nol2024InputDataRow[]
  const map = new Map<string, Insertable<OccupationCodeTable>>()
  for (const row of majorRows) {
    map.set(row.Code, {
      id: `nol-2024-${row.Code}`,
      classification: 'nol-2024',
      code: row.Code,
      label: row.Descriptor,
    })
  }

  for (const row of subMajorRows) {
    map.set(row.Code, {
      id: `nol-2024-${row.Code}`,
      classification: 'nol-2024',
      code: row.Code,
      label: row.Descriptor,
    })
  }

  for (const row of minorRows) {
    map.set(row.Code, {
      id: `nol-2024-${row.Code}`,
      classification: 'nol-2024',
      code: row.Code,
      label: row.Descriptor,
    })
  }

  for (const row of unitRows) {
    map.set(row.Code, {
      id: `nol-2024-${row.Code}`,
      classification: 'nol-2024',
      code: row.Code,
      label: row.Descriptor,
    })
  }

  return [...map.values()]
}

const parseOsca2024 = async (ctx: { s3: S3Client }, ref: RefDir) => {
  const result = await loadFile(
    ctx,
    refDirToRef(ref, 'occupation/osca2024.xlsx'),
    {
      stream: false,
    },
  )
  if (!result.success) {
    throw new Error(`Error loading occupation/osca2024.xlsx`)
  }

  const wb = read(result.data)
  const sheet = wb.Sheets['Table 5']
  const majors: {
    major_code: string
    major_label: string
    sub_majors: {
      sub_major_code: string
      sub_major_label: string
      minors: {
        minor_code: string
        minor_label: string
        units: {
          unit_code: string
          unit_label: string
          occupations: {
            occupation_code: string
            occupation_label: string
          }[]
        }[]
      }[]
    }[]
  }[] = []

  for (let i = 6; i <= 1754; i++) {
    const majorSlot = sheet[`A${i}`]
    const subMajorSlot = sheet[`B${i}`]
    const minorSlot = sheet[`C${i}`]
    const unitSlot = sheet[`D${i}`]
    const occupationSlot = sheet[`E${i}`]
    const labelSlot = sheet[`F${i}`]

    if (majorSlot) {
      majors.push({
        major_code: majorSlot.w,
        major_label: subMajorSlot.w,
        sub_majors: [],
      })
      continue
    }

    if (subMajorSlot) {
      const currentMajor = majors[majors.length - 1]
      currentMajor.sub_majors.push({
        sub_major_code: subMajorSlot.w,
        sub_major_label: minorSlot.w,
        minors: [],
      })
      continue
    }

    if (minorSlot) {
      const currentMajor = majors[majors.length - 1]
      const currentSubMajor =
        currentMajor.sub_majors[currentMajor.sub_majors.length - 1]
      currentSubMajor.minors.push({
        minor_code: minorSlot.w,
        minor_label: unitSlot.w,
        units: [],
      })
      continue
    }

    if (unitSlot) {
      const currentMajor = majors[majors.length - 1]
      const currentSubMajor =
        currentMajor.sub_majors[currentMajor.sub_majors.length - 1]
      const currentMinor =
        currentSubMajor.minors[currentSubMajor.minors.length - 1]
      currentMinor.units.push({
        unit_code: unitSlot.w,
        unit_label: occupationSlot.w,
        occupations: [],
      })
      continue
    }

    if (occupationSlot) {
      const currentMajor = majors[majors.length - 1]
      const currentSubMajor =
        currentMajor.sub_majors[currentMajor.sub_majors.length - 1]
      const currentMinor =
        currentSubMajor.minors[currentSubMajor.minors.length - 1]
      const currentUnit = currentMinor.units[currentMinor.units.length - 1]
      currentUnit.occupations.push({
        occupation_code: occupationSlot.w,
        occupation_label: labelSlot.w,
      })
    }
  }

  const rows: Insertable<OccupationCodeTable>[] = []
  for (const major of majors) {
    rows.push({
      id: `osca-2024-${major.major_code}`,
      code: major.major_code,
      label: major.major_label,
      classification: 'osca-2024',
    })

    for (const subMajor of major.sub_majors) {
      rows.push({
        id: `osca-2024-${subMajor.sub_major_code}`,
        code: subMajor.sub_major_code,
        label: subMajor.sub_major_label,
        classification: 'osca-2024',
      })

      for (const minor of subMajor.minors) {
        rows.push({
          id: `osca-2024-${minor.minor_code}`,
          code: minor.minor_code,
          label: minor.minor_label,
          classification: 'osca-2024',
        })

        for (const unit of minor.units) {
          rows.push({
            id: `osca-2024-${unit.unit_code}`,
            code: unit.unit_code,
            label: unit.unit_label,
            classification: 'osca-2024',
          })

          for (const occ of unit.occupations) {
            rows.push({
              id: `osca-2024-${occ.occupation_code}`,
              code: occ.occupation_code,
              label: occ.occupation_label,
              classification: 'osca-2024',
            })
          }
        }
      }
    }
  }

  return rows
}

const parseUksoc2020 = async (ctx: { s3: S3Client }, ref: RefDir) => {
  const result = await loadFile(
    ctx,
    refDirToRef(ref, 'occupation/uksoc2020.csv'),
    {
      stream: false,
    },
  )
  if (!result.success) {
    throw new Error(`Error loading occupation/uksoc2020.csv`)
  }

  const rows = parse(result.data, {
    columns: [
      'Unique ID',
      'SOC2020 Major Group',
      'SOC2020 Sub-Major Group',
      'SOC2020 Minor Group',
      'SOC2020 Unit Group',
      'SOC2020 Group Title',
      'Change',
      'VERSNO',
    ],
    skip_empty_lines: true,
    trim: true,
    from_line: 2,
  }) as Uksoc2020InputDataRow[]
  const majors: {
    major_code: string
    major_label: string
    sub_majors: {
      sub_major_code: string
      sub_major_label: string
      minors: {
        minor_code: string
        minor_label: string
        units: {
          unit_code: string
          unit_label: string
        }[]
      }[]
    }[]
  }[] = []

  for (const row of rows) {
    if (row['SOC2020 Major Group'].length > 0) {
      majors.push({
        major_code: row['SOC2020 Major Group'],
        major_label: row['SOC2020 Group Title'],
        sub_majors: [],
      })
    } else if (row['SOC2020 Sub-Major Group'].length > 0) {
      const majorCode = row['SOC2020 Sub-Major Group'].slice(0, 1)
      const majorFound = majors.find(o => o.major_code === majorCode)
      if (!majorFound) {
        throw new Error('File out of order')
      }

      majorFound.sub_majors.push({
        sub_major_code: row['SOC2020 Sub-Major Group'],
        sub_major_label: row['SOC2020 Group Title'],
        minors: [],
      })
    } else if (row['SOC2020 Minor Group'].length > 0) {
      const majorCode = row['SOC2020 Minor Group'].slice(0, 1)
      const subMajorCode = row['SOC2020 Minor Group'].slice(0, 2)

      const majorFound = majors.find(o => o.major_code === majorCode)
      if (!majorFound) {
        throw new Error('File out of order')
      }

      const subMajorFound = majorFound.sub_majors.find(
        o => o.sub_major_code === subMajorCode,
      )
      if (!subMajorFound) {
        throw new Error('File out of order')
      }

      subMajorFound.minors.push({
        minor_code: row['SOC2020 Minor Group'],
        minor_label: row['SOC2020 Group Title'],
        units: [],
      })
    } else if (row['SOC2020 Unit Group'].length > 0) {
      const majorCode = row['SOC2020 Unit Group'].slice(0, 1)
      const subMajorCode = row['SOC2020 Unit Group'].slice(0, 2)
      const minorCode = row['SOC2020 Unit Group'].slice(0, 3)

      const majorFound = majors.find(o => o.major_code === majorCode)
      if (!majorFound) {
        throw new Error('File out of order')
      }

      const subMajorFound = majorFound.sub_majors.find(
        o => o.sub_major_code === subMajorCode,
      )
      if (!subMajorFound) {
        throw new Error('File out of order')
      }

      const minorFound = subMajorFound.minors.find(
        o => o.minor_code === minorCode,
      )
      if (!minorFound) {
        throw new Error('File out of order')
      }

      minorFound.units.push({
        unit_code: row['SOC2020 Unit Group'],
        unit_label: row['SOC2020 Group Title'],
      })
    }
  }

  const results: Insertable<OccupationCodeTable>[] = []
  for (const major of majors) {
    results.push({
      id: `uksoc-2020-${major.major_code}`,
      code: major.major_code,
      label: major.major_label,
      classification: 'uksoc-2020',
    })

    for (const subMajor of major.sub_majors) {
      results.push({
        id: `uksoc-2020-${subMajor.sub_major_code}`,
        code: subMajor.sub_major_code,
        label: subMajor.sub_major_label,
        classification: 'uksoc-2020',
      })

      for (const minor of subMajor.minors) {
        results.push({
          id: `uksoc-2020-${minor.minor_code}`,
          code: minor.minor_code,
          label: minor.minor_label,
          classification: 'uksoc-2020',
        })

        for (const unit of minor.units) {
          results.push({
            id: `uksoc-2020-${unit.unit_code}`,
            code: unit.unit_code,
            label: unit.unit_label,
            classification: 'uksoc-2020',
          })
        }
      }
    }
  }

  return results
}

const parseUssoc2010 = async (ctx: { s3: S3Client }, ref: RefDir) => {
  const result = await loadFile(
    ctx,
    refDirToRef(ref, 'occupation/ussoc2010.xls'),
    {
      stream: false,
    },
  )
  if (!result.success) {
    throw new Error(`Error loading occupation/ussoc2010.xls`)
  }

  const wb = read(result.data)
  const sheet = wb.Sheets['Sheet1']
  const majors: {
    major_code: string
    major_label: string
    minors: {
      minor_code: string
      minor_label: string
      broads: {
        broad_code: string
        broad_label: string
        occupations: {
          occupation_code: string
          occupation_label: string
        }[]
      }[]
    }[]
  }[] = []
  for (let i = 14; i <= 1434; i++) {
    const majorSlot = sheet[`A${i}`]
    const minorSlot = sheet[`B${i}`]
    const broadSlot = sheet[`C${i}`]
    const occupationSlot = sheet[`D${i}`]
    const labelSlot = sheet[`E${i}`]

    if (majorSlot) {
      majors.push({
        major_code: majorSlot.w.trim(),
        major_label: labelSlot.w.trim(),
        minors: [],
      })
      continue
    }

    if (minorSlot) {
      const currentMajor = majors[majors.length - 1]
      currentMajor.minors.push({
        minor_code: minorSlot.w.trim(),
        minor_label: labelSlot.w.trim(),
        broads: [],
      })
      continue
    }

    if (broadSlot) {
      const currentMajor = majors[majors.length - 1]
      const currentMinor = currentMajor.minors[currentMajor.minors.length - 1]
      currentMinor.broads.push({
        broad_code: broadSlot.w.trim(),
        broad_label: labelSlot.w.trim(),
        occupations: [],
      })
      continue
    }

    if (occupationSlot) {
      const currentMajor = majors[majors.length - 1]
      const currentMinor = currentMajor.minors[currentMajor.minors.length - 1]
      const currentBroad = currentMinor.broads[currentMinor.broads.length - 1]
      currentBroad.occupations.push({
        occupation_code: occupationSlot.w.trim(),
        occupation_label: labelSlot.w.trim(),
      })
    }
  }

  const results: Insertable<OccupationCodeTable>[] = []
  for (const major of majors) {
    results.push({
      id: `ussoc-2010-${major.major_code}`,
      code: major.major_code,
      label: major.major_label,
      classification: 'ussoc-2010',
    })

    for (const minor of major.minors) {
      results.push({
        id: `ussoc-2010-${minor.minor_code}`,
        code: minor.minor_code,
        label: minor.minor_label,
        classification: 'ussoc-2010',
      })

      for (const broad of minor.broads) {
        results.push({
          id: `ussoc-2010-${broad.broad_code}`,
          code: broad.broad_code,
          label: broad.broad_label,
          classification: 'ussoc-2010',
        })

        for (const occ of broad.occupations) {
          results.push({
            id: `ussoc-2010-${occ.occupation_code}`,
            code: occ.occupation_code,
            label: occ.occupation_label,
            classification: 'ussoc-2010',
          })
        }
      }
    }
  }

  return results
}

const parseUssoc2018 = async (ctx: { s3: S3Client }, ref: RefDir) => {
  const result = await loadFile(
    ctx,
    refDirToRef(ref, 'occupation/ussoc2018.xlsx'),
    {
      stream: false,
    },
  )
  if (!result.success) {
    throw new Error(`Error loading occupation/ussoc2018.xlsx`)
  }

  const wb = read(result.data)
  const sheet = wb.Sheets['2018 Structure']
  const majors: {
    major_code: string
    major_label: string
    minors: {
      minor_code: string
      minor_label: string
      broads: {
        broad_code: string
        broad_label: string
        occupations: {
          occupation_code: string
          occupation_label: string
        }[]
      }[]
    }[]
  }[] = []
  for (let i = 9; i <= 1455; i++) {
    const majorSlot = sheet[`A${i}`]
    const minorSlot = sheet[`B${i}`]
    const broadSlot = sheet[`C${i}`]
    const occupationSlot = sheet[`D${i}`]
    const labelSlot = sheet[`E${i}`]

    if (majorSlot) {
      majors.push({
        major_code: majorSlot.w,
        major_label: labelSlot.w,
        minors: [],
      })
      continue
    }

    if (minorSlot) {
      const currentMajor = majors[majors.length - 1]
      currentMajor.minors.push({
        minor_code: minorSlot.w,
        minor_label: labelSlot.w,
        broads: [],
      })
      continue
    }

    if (broadSlot) {
      const currentMajor = majors[majors.length - 1]
      const currentMinor = currentMajor.minors[currentMajor.minors.length - 1]
      currentMinor.broads.push({
        broad_code: broadSlot.w,
        broad_label: labelSlot.w,
        occupations: [],
      })
      continue
    }

    if (occupationSlot) {
      const currentMajor = majors[majors.length - 1]
      const currentMinor = currentMajor.minors[currentMajor.minors.length - 1]
      const currentBroad = currentMinor.broads[currentMinor.broads.length - 1]
      currentBroad.occupations.push({
        occupation_code: occupationSlot.w,
        occupation_label: labelSlot.w,
      })
    }
  }

  const results: Insertable<OccupationCodeTable>[] = []
  for (const major of majors) {
    results.push({
      id: `ussoc-2018-${major.major_code}`,
      code: major.major_code,
      label: major.major_label,
      classification: 'ussoc-2018',
    })

    for (const minor of major.minors) {
      results.push({
        id: `ussoc-2018-${minor.minor_code}`,
        code: minor.minor_code,
        label: minor.minor_label,
        classification: 'ussoc-2018',
      })

      for (const broad of minor.broads) {
        results.push({
          id: `ussoc-2018-${broad.broad_code}`,
          code: broad.broad_code,
          label: broad.broad_label,
          classification: 'ussoc-2018',
        })

        for (const occ of broad.occupations) {
          results.push({
            id: `ussoc-2018-${occ.occupation_code}`,
            code: occ.occupation_code,
            label: occ.occupation_label,
            classification: 'ussoc-2018',
          })
        }
      }
    }
  }

  return results
}

const parseAnzsco2013Isco2008 = async (ctx: { s3: S3Client }, ref: RefDir) => {
  const result = await loadFile(
    ctx,
    refDirToRef(ref, 'occupation/anzsco2013-isco2008.xlsx'),
    {
      stream: false,
    },
  )
  if (!result.success) {
    throw new Error(`Error loading occupation/anzsco2013-isco2008.xlsx`)
  }

  const wb = read(result.data)
  const sheet = wb.Sheets['ISCO-08 to ANZSCO Version 1.3']
  const type1Rows: AnzscoIscoType1Row[] = []
  const type2Rows: AnzscoIscoType2Row[] = []
  for (let i = 9; i <= 1300; i++) {
    const iscoSlot = sheet[`A${i}`]
    const anzscoSlot = sheet[`C${i}`]
    if (iscoSlot) {
      if (anzscoSlot && anzscoSlot.w !== '0') {
        type1Rows.push({
          isco_code: iscoSlot.w,
          anzsco_codes: new Set([anzscoSlot.w]),
        })

        const found = type2Rows.find(r => r.anzsco_code === anzscoSlot.w)
        if (!found) {
          type2Rows.push({
            anzsco_code: anzscoSlot.w,
            isco_codes: new Set([iscoSlot.w]),
          })
        } else {
          found.isco_codes.add(iscoSlot.w)
        }
      }
    } else {
      if (anzscoSlot && anzscoSlot.w !== '0') {
        const lastRow = type1Rows[type1Rows.length - 1]
        lastRow.anzsco_codes.add(anzscoSlot.w)
        const found = type2Rows.find(r => r.anzsco_code === anzscoSlot.w)
        if (!found) {
          type2Rows.push({
            anzsco_code: anzscoSlot.w,
            isco_codes: new Set([lastRow.isco_code]),
          })
        } else {
          found.isco_codes.add(lastRow.isco_code)
        }
      }
    }
  }

  return [
    ...type1Rows
      .map(r =>
        [...r.anzsco_codes.keys()].map(c => ({
          source_id: `isco-2008-${r.isco_code}`,
          target_id: `anzsco-2013-${c}`,
        })),
      )
      .flat(),
    ...type2Rows
      .map(r =>
        [...r.isco_codes.keys()].map(c => ({
          source_id: `anzsco-2013-${r.anzsco_code}`,
          target_id: `isco-2008-${c}`,
        })),
      )
      .flat(),
  ] as Insertable<OccupationCodeCrosswalkTable>[]
}

const parseAnzsco2022Isco2008 = async (ctx: { s3: S3Client }, ref: RefDir) => {
  const result = await loadFile(
    ctx,
    refDirToRef(ref, 'occupation/anzsco2022-isco2008.xlsx'),
    {
      stream: false,
    },
  )
  if (!result.success) {
    throw new Error(`Error loading occupation/anzsco2022-isco2008.xlsx`)
  }

  const wb = read(result.data)
  const isco2AnzscoSheet = wb.Sheets['Table 3']
  const anzsco2IscoSheet = wb.Sheets['Table 4']
  const type1Rows: AnzscoIscoType1Row[] = []
  const type2Rows: AnzscoIscoType2Row[] = []
  for (let i = 7; i <= 1351; i++) {
    const iscoSlot = isco2AnzscoSheet[`A${i}`]
    const anzscoSlot = isco2AnzscoSheet[`C${i}`]
    if (anzscoSlot && anzscoSlot.w === 'xxxxxx') {
      continue
    }
    if (iscoSlot && iscoSlot.w.length > 0) {
      type1Rows.push({
        isco_code: iscoSlot.w,
        anzsco_codes: new Set([anzscoSlot.w]),
      })
    } else {
      type1Rows[type1Rows.length - 1].anzsco_codes.add(anzscoSlot.w)
    }
  }

  for (let i = 7; i <= 1346; i++) {
    const anzscoSlot = anzsco2IscoSheet[`A${i}`]
    const iscoSlot = anzsco2IscoSheet[`C${i}`]
    if (anzscoSlot && anzscoSlot.w.length > 0) {
      type2Rows.push({
        anzsco_code: anzscoSlot.w,
        isco_codes: new Set([iscoSlot.w]),
      })
    } else {
      type2Rows[type2Rows.length - 1].isco_codes.add(iscoSlot.w)
    }
  }

  return [
    ...type1Rows
      .map(r =>
        [...r.anzsco_codes.keys()].map(c => ({
          source_id: `isco-2008-${r.isco_code}`,
          target_id: `anzsco-2022-${c}`,
        })),
      )
      .flat(),
    ...type2Rows
      .map(r =>
        [...r.isco_codes.keys()].map(c => ({
          source_id: `anzsco-2022-${r.anzsco_code}`,
          target_id: `isco-2008-${c}`,
        })),
      )
      .flat(),
  ] as Insertable<OccupationCodeCrosswalkTable>[]
}

const parseIsco2008Nol2024 = async (ctx: { s3: S3Client }, ref: RefDir) => {
  const result = await loadFile(
    ctx,
    refDirToRef(ref, 'occupation/isco2008-nol2024.csv'),
    {
      stream: false,
    },
  )
  if (!result.success) {
    throw new Error(`Error loading occupation/isco2008-nol2024.csv`)
  }

  const records = parse(result.data, {
    columns: [
      'NOL V1.0.0',
      'NOL Label',
      'Map Type',
      'ISCO08 V1.0.0',
      'ISCO Label',
      null,
    ],
    skip_empty_lines: true,
    trim: true,
    from_line: 2,
  }) as IscoNolInputDataRow[]

  const type1Rows: IscoNolType1Row[] = []
  const type2Rows: IscoNolType2Row[] = []

  for (const record of records) {
    if (record['ISCO08 V1.0.0'] === 'n/a') continue
    const nolUnitCode = record['NOL V1.0.0']
    const iscoUnitCode = record['ISCO08 V1.0.0']
    const rowInType1 = type1Rows.find(r => r.isco_code === iscoUnitCode)
    if (!rowInType1) {
      type1Rows.push({ isco_code: iscoUnitCode, nol_codes: [nolUnitCode] })
    } else {
      rowInType1.nol_codes.push(nolUnitCode)
    }

    const rowInType2 = type2Rows.find(r => r.nol_code === nolUnitCode)
    if (!rowInType2) {
      type2Rows.push({ nol_code: nolUnitCode, isco_codes: [iscoUnitCode] })
    } else {
      rowInType2.isco_codes.push(iscoUnitCode)
    }
  }

  return [
    ...type1Rows
      .map(r =>
        r.nol_codes.map(c => ({
          source_id: `isco-2008-${r.isco_code}`,
          target_id: `nol-2024-${c}`,
        })),
      )
      .flat(),
    ...type2Rows
      .map(r =>
        r.isco_codes.map(c => ({
          source_id: `nol-2024-${r.nol_code}`,
          target_id: `isco-2008-${c}`,
        })),
      )
      .flat(),
  ] as Insertable<OccupationCodeCrosswalkTable>[]
}

const parseIsco2008Osca2024 = async (ctx: { s3: S3Client }, ref: RefDir) => {
  const result = await loadFile(
    ctx,
    refDirToRef(ref, 'occupation/isco2008-osca2024.xlsx'),
    {
      stream: false,
    },
  )
  if (!result.success) {
    throw new Error(`Error loading occupation/isco2008-osca2024.xlsx`)
  }

  const wb = read(result.data)
  const sheet = wb.Sheets['Table 7']
  const type1Rows: IscoOscaType1Row[] = []
  const type2Rows: IscoOscaType2Row[] = []
  for (let i = 6; i <= 1453; i++) {
    const iscoCodeSlot = sheet[`A${i}`]
    const oscaCodeSlot = sheet[`C${i}`]
    if (iscoCodeSlot) {
      if (oscaCodeSlot && oscaCodeSlot.w !== 'xxxxxx') {
        type1Rows.push({
          isco_code: iscoCodeSlot.w,
          osca_codes: new Set([oscaCodeSlot.w]),
        })

        const found = type2Rows.find(o => o.osca_code === oscaCodeSlot.w)
        if (!found) {
          type2Rows.push({
            osca_code: oscaCodeSlot.w,
            isco_codes: new Set([iscoCodeSlot.w]),
          })
        } else {
          found.isco_codes.add(iscoCodeSlot.w)
        }
      }
    } else {
      if (oscaCodeSlot && oscaCodeSlot.w !== 'xxxxxx') {
        const lastestRow = type1Rows[type1Rows.length - 1]
        lastestRow.osca_codes.add(oscaCodeSlot.w)

        const found = type2Rows.find(o => o.osca_code === oscaCodeSlot.w)
        if (!found) {
          type2Rows.push({
            osca_code: oscaCodeSlot.w,
            isco_codes: new Set([lastestRow.isco_code]),
          })
        } else {
          found.isco_codes.add(lastestRow.isco_code)
        }
      }
    }
  }

  return [
    ...type1Rows
      .map(r =>
        [...r.osca_codes.keys()].map(c => ({
          source_id: `isco-2008-${r.isco_code}`,
          target_id: `osca-2024-${c}`,
        })),
      )
      .flat(),
    ...type2Rows
      .map(r =>
        [...r.isco_codes.keys()].map(c => ({
          source_id: `osca-2024-${r.osca_code}`,
          target_id: `isco-2008-${c}`,
        })),
      )
      .flat(),
  ] as Insertable<OccupationCodeCrosswalkTable>[]
}

const parseIsco2008Uksoc2020 = async (ctx: { s3: S3Client }, ref: RefDir) => {
  const result = await loadFile(
    ctx,
    refDirToRef(ref, 'occupation/isco2008-uksoc2020.csv'),
    {
      stream: false,
    },
  )
  if (!result.success) {
    throw new Error(`Error loading occupation/isco2008-uksoc2020.csv`)
  }

  const records = parse(result.data, {
    columns: [
      'UNIQUE ID',
      'RECNO',
      'D',
      'SOC_90',
      'SOC_2000',
      'SOC_2010',
      'SOC_2020',
      'SOC_2020_ext',
      'INDEXOCC',
      'ADD',
      'IND',
      'SEE',
      'ISCO-08 code based on SOC2020',
      'VERSNO',
      'CHANGE',
      'SOC90_unit_group_title',
      'SOC2000_unit_group_title',
      'SOC2010_unit_group_title',
      'SOC2020_unit_group_title',
      'SOC2020_ext_SUG_title',
      'ISCO08_unit_group_title',
      'INDEXOCC_-_natural_word_order',
    ],
    skip_empty_lines: true,
    trim: true,
    from_line: 2,
  }) as IscoUksocInputDataRow[]

  const type1Rows: IscoUksocType1Row[] = []
  const type2Rows: IscoUksocType2Row[] = []

  for (const record of records) {
    const uksocUnitCode = record.SOC_2020
    if (uksocUnitCode === '}}}}') continue
    const iscoUnitCode = record['ISCO-08 code based on SOC2020']
    const rowInType1 = type1Rows.find(r => r.isco_code === iscoUnitCode)
    if (!rowInType1) {
      type1Rows.push({
        isco_code: iscoUnitCode,
        uksoc_codes: new Set([uksocUnitCode]),
      })
    } else {
      rowInType1.uksoc_codes.add(uksocUnitCode)
    }

    const rowInType2 = type2Rows.find(r => r.uksoc_code === uksocUnitCode)
    if (!rowInType2) {
      type2Rows.push({
        uksoc_code: uksocUnitCode,
        isco_codes: new Set([iscoUnitCode]),
      })
    } else {
      rowInType2.isco_codes.add(iscoUnitCode)
    }
  }

  return [
    ...type1Rows
      .map(r =>
        [...r.uksoc_codes.keys()].map(c => ({
          source_id: `isco-2008-${r.isco_code}`,
          target_id: `uksoc-2020-${c}`,
        })),
      )
      .flat(),
    ...type2Rows
      .map(r =>
        [...r.isco_codes.keys()].map(c => ({
          source_id: `uksoc-2020-${r.uksoc_code}`,
          target_id: `isco-2008-${c}`,
        })),
      )
      .flat(),
  ] as Insertable<OccupationCodeCrosswalkTable>[]
}

const parseIsco2008Ussoc2010 = async (ctx: { s3: S3Client }, ref: RefDir) => {
  const result = await loadFile(
    ctx,
    refDirToRef(ref, 'occupation/isco2008-ussoc2010.xls'),
    {
      stream: false,
    },
  )
  if (!result.success) {
    throw new Error(`Error loading occupation/isco2008-ussoc2010.xls`)
  }

  const wb = read(result.data)
  const sheet = wb.Sheets['ISCO-08 to 2010 SOC']
  const type1Rows: IscoUssocType1Row[] = []
  const type2Rows: IscoUssocType2Row[] = []
  for (let i = 8; i <= 1132; i++) {
    const iscoCodeSlot = sheet[`A${i}`]
    const ussocCodeSlot = sheet[`D${i}`]
    const foundType1 = type1Rows.find(
      o => o.isco_code === iscoCodeSlot.w.trim(),
    )
    const foundType2 = type2Rows.find(
      o => o.ussoc_code === ussocCodeSlot.w.trim(),
    )
    if (!foundType1) {
      type1Rows.push({
        isco_code: iscoCodeSlot.w.trim(),
        ussoc_codes: new Set([ussocCodeSlot.w.trim()]),
      })
    } else {
      foundType1.ussoc_codes.add(ussocCodeSlot.w.trim())
    }

    if (!foundType2) {
      type2Rows.push({
        ussoc_code: ussocCodeSlot.w.trim(),
        isco_codes: new Set([iscoCodeSlot.w.trim()]),
      })
    } else {
      foundType2.isco_codes.add(iscoCodeSlot.w.trim())
    }
  }

  return [
    ...type1Rows
      .map(r =>
        [...r.ussoc_codes.keys()].map(c => ({
          source_id: `isco-2008-${r.isco_code}`,
          target_id: `ussoc-2010-${c}`,
        })),
      )
      .flat(),
    ...type2Rows
      .map(r =>
        [...r.isco_codes.keys()].map(c => ({
          source_id: `ussoc-2010-${r.ussoc_code}`,
          target_id: `isco-2008-${c}`,
        })),
      )
      .flat(),
  ] as Insertable<OccupationCodeCrosswalkTable>[]
}

const parseNoc2016Noc2021 = async (ctx: { s3: S3Client }, ref: RefDir) => {
  const result = await loadFile(
    ctx,
    refDirToRef(ref, 'occupation/noc2016-noc2021.csv'),
    {
      stream: false,
    },
  )
  if (!result.success) {
    throw new Error(`Error loading occupation/noc2016-noc2021.csv`)
  }

  const records = parse(result.data, {
    columns: [
      'NOC 2016 V1.3 Code',
      'NOC 2016 V1.3 Title',
      'GSIM Type of Change',
      'NOC 2021 V1.0 Code',
      'NOC 2021 V1.0 Title',
      'Notes',
      null,
    ],
    skip_empty_lines: true,
    trim: true,
    from_line: 2,
  }) as NocNocInputDataRow[]

  const type1Rows: NocNocType1Row[] = []
  const type2Rows: NocNocType2Row[] = []

  for (const record of records) {
    const noc16UnitCode = record['NOC 2016 V1.3 Code']
    const noc21UnitCode = record['NOC 2021 V1.0 Code']
    const rowInType1 = type1Rows.find(r => r.noc2016_code === noc16UnitCode)
    if (!rowInType1) {
      type1Rows.push({
        noc2016_code: noc16UnitCode,
        noc2021_codes: new Set([noc21UnitCode]),
      })
    } else {
      rowInType1.noc2021_codes.add(noc21UnitCode)
    }

    const rowInType2 = type2Rows.find(r => r.noc2021_code === noc21UnitCode)
    if (!rowInType2) {
      type2Rows.push({
        noc2021_code: noc21UnitCode,
        noc2016_codes: new Set([noc16UnitCode]),
      })
    } else {
      rowInType2.noc2016_codes.add(noc16UnitCode)
    }
  }

  return [
    ...type1Rows
      .map(r =>
        [...r.noc2021_codes.keys()].map(c => ({
          source_id: `noc-2016-${r.noc2016_code}`,
          target_id: `noc-2021-${c}`,
        })),
      )
      .flat(),
    ...type2Rows
      .map(r =>
        [...r.noc2016_codes.keys()].map(c => ({
          source_id: `noc-2021-${r.noc2021_code}`,
          target_id: `noc-2016-${c}`,
        })),
      )
      .flat(),
  ] as Insertable<OccupationCodeCrosswalkTable>[]
}

const parseNoc2016Ussoc2018 = async (ctx: { s3: S3Client }, ref: RefDir) => {
  const result = await loadFile(
    ctx,
    refDirToRef(ref, 'occupation/noc2016-ussoc2018.csv'),
    {
      stream: false,
    },
  )
  if (!result.success) {
    throw new Error(`Error loading occupation/noc2016-ussoc2018.csv`)
  }

  const records = parse(result.data, {
    columns: [
      'SOC 2018 (US) Code',
      'SOC 2018 (US) Title',
      'Partial',
      'NOC 2016  Version 1.3 Code',
      'NOC 2016  Version 1.3 Title',
      'Explanatory Notes',
    ],
    skip_empty_lines: true,
    trim: true,
    from_line: 2,
  }) as NocUssocInputDataRow[]

  const type1Rows: NocUssocType1Row[] = []
  const type2Rows: NocUssocType2Row[] = []

  for (const record of records) {
    const noc16UnitCode = record['NOC 2016  Version 1.3 Code']
    const ussoc18UnitCode = record['SOC 2018 (US) Code']
    const rowInType1 = type1Rows.find(r => r.noc_code === noc16UnitCode)
    if (!rowInType1) {
      type1Rows.push({
        noc_code: noc16UnitCode,
        ussoc_codes: new Set([ussoc18UnitCode]),
      })
    } else {
      rowInType1.ussoc_codes.add(ussoc18UnitCode)
    }

    const rowInType2 = type2Rows.find(r => r.ussoc_code === ussoc18UnitCode)
    if (!rowInType2) {
      type2Rows.push({
        ussoc_code: ussoc18UnitCode,
        noc_codes: new Set([noc16UnitCode]),
      })
    } else {
      rowInType2.noc_codes.add(noc16UnitCode)
    }
  }

  return [
    ...type1Rows
      .map(r =>
        [...r.ussoc_codes.keys()].map(c => ({
          source_id: `noc-2016-${r.noc_code}`,
          target_id: `ussoc-2018-${c}`,
        })),
      )
      .flat(),
    ...type2Rows
      .map(r =>
        [...r.noc_codes.keys()].map(c => ({
          source_id: `ussoc-2018-${r.ussoc_code}`,
          target_id: `noc-2016-${c}`,
        })),
      )
      .flat(),
  ] as Insertable<OccupationCodeCrosswalkTable>[]
}

const parseUssoc2010Ussoc2018 = async (ctx: { s3: S3Client }, ref: RefDir) => {
  const result = await loadFile(
    ctx,
    refDirToRef(ref, 'occupation/ussoc2010-ussoc2018.xlsx'),
    {
      stream: false,
    },
  )
  if (!result.success) {
    throw new Error(`Error loading occupation/ussoc2010-ussoc2018.xlsx`)
  }

  const wb = read(result.data)
  const sheet = wb.Sheets['Sorted by 2010']
  const type1Rows: UssocUssocType1Row[] = []
  const type2Rows: UssocUssocType2Row[] = []
  for (let i = 10; i <= 909; i++) {
    const ussoc2010CodeSlot = sheet[`A${i}`]
    const ussoc2018CodeSlot = sheet[`C${i}`]
    const foundType1 = type1Rows.find(
      o => o.ussoc2010_code === ussoc2010CodeSlot.w,
    )
    const foundType2 = type2Rows.find(
      o => o.ussoc2018_code === ussoc2018CodeSlot.w,
    )
    if (!foundType1) {
      type1Rows.push({
        ussoc2010_code: ussoc2010CodeSlot.w,
        ussoc2018_codes: new Set([ussoc2018CodeSlot.w]),
      })
    } else {
      foundType1.ussoc2018_codes.add(ussoc2018CodeSlot.w)
    }

    if (!foundType2) {
      type2Rows.push({
        ussoc2018_code: ussoc2018CodeSlot.w,
        ussoc2010_codes: new Set([ussoc2010CodeSlot.w]),
      })
    } else {
      foundType2.ussoc2010_codes.add(ussoc2010CodeSlot.w)
    }
  }

  return [
    ...type1Rows
      .map(r =>
        [...r.ussoc2018_codes.keys()].map(c => ({
          source_id: `ussoc-2010-${r.ussoc2010_code}`,
          target_id: `ussoc-2018-${c}`,
        })),
      )
      .flat(),
    ...type2Rows
      .map(r =>
        [...r.ussoc2010_codes.keys()].map(c => ({
          source_id: `ussoc-2018-${r.ussoc2018_code}`,
          target_id: `ussoc-2010-${c}`,
        })),
      )
      .flat(),
  ] as Insertable<OccupationCodeCrosswalkTable>[]
}

/**
 * Process occupation
 * @param ctx - The context
 * @param ctx.s3 - The S3 client
 * @param ctx.db - The global database
 * @param ref - The reference directory
 */
export async function processOccupation(
  ctx: {
    s3: S3Client
    db: Kysely<GlobalDatabase>
  },
  ref: RefDir,
): Promise<void> {
  await ctx.db
    .insertInto('occupation_code')
    .values(await parseAnzsco2013(ctx, ref))
    .onConflict(oc =>
      oc.column('id').doUpdateSet(eb => ({ label: eb.ref('excluded.label') })),
    )
    .execute()
  console.log('anzsco2013 processed.')
  await ctx.db
    .insertInto('occupation_code')
    .values(await parseAnzsco2022(ctx, ref))
    .onConflict(oc =>
      oc.column('id').doUpdateSet(eb => ({ label: eb.ref('excluded.label') })),
    )
    .execute()
  console.log('anzsco2022 processed.')
  await ctx.db
    .insertInto('occupation_code')
    .values(await parseIsco2008(ctx, ref))
    .onConflict(oc =>
      oc.column('id').doUpdateSet(eb => ({ label: eb.ref('excluded.label') })),
    )
    .execute()
  console.log('isco2008 processed.')
  await ctx.db
    .insertInto('occupation_code')
    .values(await parseNoc2016(ctx, ref))
    .onConflict(oc =>
      oc.column('id').doUpdateSet(eb => ({ label: eb.ref('excluded.label') })),
    )
    .execute()
  console.log('noc2016 processed.')
  await ctx.db
    .insertInto('occupation_code')
    .values(await parseNoc2021(ctx, ref))
    .onConflict(oc =>
      oc.column('id').doUpdateSet(eb => ({ label: eb.ref('excluded.label') })),
    )
    .execute()
  console.log('noc2021 processed.')
  await ctx.db
    .insertInto('occupation_code')
    .values(await parseNol2024(ctx, ref))
    .onConflict(oc =>
      oc.column('id').doUpdateSet(eb => ({ label: eb.ref('excluded.label') })),
    )
    .execute()
  console.log('nol2024 processed.')
  await ctx.db
    .insertInto('occupation_code')
    .values(await parseOsca2024(ctx, ref))
    .onConflict(oc =>
      oc.column('id').doUpdateSet(eb => ({ label: eb.ref('excluded.label') })),
    )
    .execute()
  console.log('osca2024 processed.')
  await ctx.db
    .insertInto('occupation_code')
    .values(await parseUksoc2020(ctx, ref))
    .onConflict(oc =>
      oc.column('id').doUpdateSet(eb => ({ label: eb.ref('excluded.label') })),
    )
    .execute()
  console.log('uksoc2020 processed.')
  await ctx.db
    .insertInto('occupation_code')
    .values(await parseUssoc2010(ctx, ref))
    .onConflict(oc =>
      oc.column('id').doUpdateSet(eb => ({ label: eb.ref('excluded.label') })),
    )
    .execute()
  console.log('ussoc2010 processed.')
  await ctx.db
    .insertInto('occupation_code')
    .values(await parseUssoc2018(ctx, ref))
    .onConflict(oc =>
      oc.column('id').doUpdateSet(eb => ({ label: eb.ref('excluded.label') })),
    )
    .execute()
  console.log('ussoc2018 processed.')

  await ctx.db
    .insertInto('occupation_code_crosswalk')
    .values(await parseAnzsco2013Isco2008(ctx, ref))
    .onConflict(oc => oc.columns(['source_id', 'target_id']).doNothing())
    .execute()
  console.log('anzsco2013-isco2008 processed.')
  await ctx.db
    .insertInto('occupation_code_crosswalk')
    .values(await parseAnzsco2022Isco2008(ctx, ref))
    .onConflict(oc => oc.columns(['source_id', 'target_id']).doNothing())
    .execute()
  console.log('anzsco2022-isco2008 processed.')
  await ctx.db
    .insertInto('occupation_code_crosswalk')
    .values(await parseIsco2008Nol2024(ctx, ref))
    .onConflict(oc => oc.columns(['source_id', 'target_id']).doNothing())
    .execute()
  console.log('isco2008-nol2024 processed.')
  await ctx.db
    .insertInto('occupation_code_crosswalk')
    .values(await parseIsco2008Osca2024(ctx, ref))
    .onConflict(oc => oc.columns(['source_id', 'target_id']).doNothing())
    .execute()
  console.log('isco2008-osca2024 processed.')
  await ctx.db
    .insertInto('occupation_code_crosswalk')
    .values(await parseIsco2008Uksoc2020(ctx, ref))
    .onConflict(oc => oc.columns(['source_id', 'target_id']).doNothing())
    .execute()
  console.log('isco2008-uksoc2020 processed.')
  await ctx.db
    .insertInto('occupation_code_crosswalk')
    .values(await parseIsco2008Ussoc2010(ctx, ref))
    .onConflict(oc => oc.columns(['source_id', 'target_id']).doNothing())
    .execute()
  console.log('isco2008-ussoc2010 processed.')
  await ctx.db
    .insertInto('occupation_code_crosswalk')
    .values(await parseNoc2016Noc2021(ctx, ref))
    .onConflict(oc => oc.columns(['source_id', 'target_id']).doNothing())
    .execute()
  console.log('noc2016-noc2021 processed.')
  await ctx.db
    .insertInto('occupation_code_crosswalk')
    .values(await parseNoc2016Ussoc2018(ctx, ref))
    .onConflict(oc => oc.columns(['source_id', 'target_id']).doNothing())
    .execute()
  console.log('noc2016-ussoc2018 processed.')
  await ctx.db
    .insertInto('occupation_code_crosswalk')
    .values(await parseUssoc2010Ussoc2018(ctx, ref))
    .onConflict(oc => oc.columns(['source_id', 'target_id']).doNothing())
    .execute()
  console.log('ussoc2010-ussoc2018 processed.')
}
