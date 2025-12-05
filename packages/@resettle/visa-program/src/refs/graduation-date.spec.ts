/*
import type { EducationExperience } from '@resettle/schema'
import assert from 'node:assert'
import { describe, it } from 'node:test'

import {
  getGraduationDateRefValue,
  isGraduationDateRef,
  type GraduationDateRef,
  type GraduationDateRefInput,
} from './graduation-date'

describe('graduation-date', () => {
  const mockEducationExperiences: EducationExperience[] = [
    {
      id: 'high-school-1',
      institution_name: 'High School',
      level: 'high_school',
      start_date: new Date('2016-09-01'),
      end_date: new Date('2020-06-15'),
    },
    {
      id: 'bachelor-1',
      institution_name: 'University A',
      level: 'bachelor',
      start_date: new Date('2020-09-01'),
      end_date: new Date('2024-05-15'),
    },
    {
      id: 'master-1',
      institution_name: 'University B',
      level: 'master',
      start_date: new Date('2024-09-01'),
      end_date: new Date('2026-05-30'),
    },
    {
      id: 'bachelor-2',
      institution_name: 'University C',
      level: 'bachelor',
      start_date: new Date('2021-09-01'),
      end_date: new Date('2023-12-20'), // Earlier than bachelor-1
    },
  ]

  const mockInput: GraduationDateRefInput = {
    education_experiences: mockEducationExperiences,
  }

  describe('isGraduationDateRef', () => {
    it('should return true for valid graduation date refs', () => {
      assert.ok(isGraduationDateRef('graduation_date.bachelor'))
      assert.ok(isGraduationDateRef('graduation_date.master_or_higher'))
      assert.ok(isGraduationDateRef('graduation_date.doctorate.add_years:2'))
    })

    it('should return false for invalid refs', () => {
      assert.ok(!isGraduationDateRef('work_experience.start'))
      assert.ok(!isGraduationDateRef('other_ref'))
      assert.ok(isGraduationDateRef('graduation_date'))
    })
  })

  describe('getGraduationDateRefValue', () => {
    describe('basic degree level filtering', () => {
      it('should return null when no education experiences', () => {
        const emptyInput: GraduationDateRefInput = {
          education_experiences: [],
        }
        const result = getGraduationDateRefValue(
          'graduation_date.bachelor',
          emptyInput,
        )
        assert.ok(result === null)
      })

      it('should return null when education_experiences is undefined', () => {
        const emptyInput: GraduationDateRefInput = {}
        const result = getGraduationDateRefValue(
          'graduation_date.bachelor',
          emptyInput,
        )
        assert.ok(result === null)
      })

      it('should return high school graduation date', () => {
        const result = getGraduationDateRefValue(
          'graduation_date.high_school',
          mockInput,
        )
        assert.deepStrictEqual(result, new Date('2020-06-15'))
      })

      it('should return most recent bachelor graduation date', () => {
        const result = getGraduationDateRefValue(
          'graduation_date.bachelor',
          mockInput,
        )
        // Should return the more recent bachelor's degree (2024-05-15)
        assert.deepStrictEqual(result, new Date('2024-05-15'))
      })

      it('should return master graduation date', () => {
        const result = getGraduationDateRefValue(
          'graduation_date.master',
          mockInput,
        )
        assert.deepStrictEqual(result, new Date('2026-05-30'))
      })

      it('should return null for doctorate when no doctorate degree exists', () => {
        const result = getGraduationDateRefValue(
          'graduation_date.doctorate',
          mockInput,
        )
        assert.ok(result === null).toBeNull()
      })
    })

    describe('"or higher" filtering', () => {
      it('should return most recent graduation date for high_school_or_higher', () => {
        const result = getGraduationDateRefValue(
          'graduation_date.high_school_or_higher',
          mockInput,
        )
        // Should return the highest and most recent degree (master's)
        expect(result).toEqual(new Date('2026-05-30'))
      })

      it('should return most recent graduation date for bachelor_or_higher', () => {
        const result = getGraduationDateRefValue(
          'graduation_date.bachelor_or_higher',
          mockInput,
        )
        // Should return the most recent graduation from bachelor or higher (master's)
        expect(result).toEqual(new Date('2026-05-30'))
      })

      it('should return master graduation date for master_or_higher', () => {
        const result = getGraduationDateRefValue(
          'graduation_date.master_or_higher',
          mockInput,
        )
        expect(result).toEqual(new Date('2026-05-30'))
      })

      it('should return null for doctorate_or_higher when no doctorate exists', () => {
        const result = getGraduationDateRefValue(
          'graduation_date.doctorate_or_higher',
          mockInput,
        )
        expect(result).toBeNull()
      })
    })

    describe('date calculations', () => {
      it('should add years to graduation date', () => {
        const result = getGraduationDateRefValue(
          'graduation_date.bachelor.add_years:2',
          mockInput,
        )
        expect(result).toEqual(new Date('2026-05-15'))
      })

      it('should add months to graduation date', () => {
        const result = getGraduationDateRefValue(
          'graduation_date.bachelor.add_months:6',
          mockInput,
        )
        expect(result).toEqual(new Date('2024-11-15'))
      })

      it('should add days to graduation date', () => {
        const result = getGraduationDateRefValue(
          'graduation_date.bachelor.add_days:30',
          mockInput,
        )
        expect(result).toEqual(new Date('2024-06-14'))
      })

      it('should subtract years from graduation date', () => {
        const result = getGraduationDateRefValue(
          'graduation_date.bachelor.subtract_years:1',
          mockInput,
        )
        expect(result).toEqual(new Date('2023-05-15'))
      })

      it('should subtract months from graduation date', () => {
        const result = getGraduationDateRefValue(
          'graduation_date.bachelor.subtract_months:3',
          mockInput,
        )
        expect(result).toEqual(new Date('2024-02-15'))
      })

      it('should subtract days from graduation date', () => {
        const result = getGraduationDateRefValue(
          'graduation_date.bachelor.subtract_days:15',
          mockInput,
        )
        expect(result).toEqual(new Date('2024-04-30'))
      })

      it('should return original date for invalid calculation', () => {
        const result = getGraduationDateRefValue(
          'graduation_date.bachelor.invalid_operation:5' as GraduationDateRef,
          mockInput,
        )
        expect(result).toEqual(new Date('2024-05-15'))
      })

      it('should return original date for invalid number', () => {
        const result = getGraduationDateRefValue(
          'graduation_date.bachelor.add_years:invalid' as GraduationDateRef,
          mockInput,
        )
        expect(result).toEqual(new Date('2024-05-15'))
      })
    })

    describe('edge cases', () => {
      it('should handle education experience without degrees', () => {
        const inputWithoutDegrees: GraduationDateRefInput = {
          education_experiences: [
            {
              id: 'no-degree',
              institution_name: 'School',
              degrees: undefined,
              start_date: new Date('2020-01-01'),
              end_date: new Date('2024-01-01'),
            },
          ],
        }
        const result = getGraduationDateRefValue(
          'graduation_date.bachelor',
          inputWithoutDegrees,
        )
        expect(result).toBeNull()
      })

      it('should handle education experience with empty degrees array', () => {
        const inputWithEmptyDegrees: GraduationDateRefInput = {
          education_experiences: [
            {
              id: 'empty-degrees',
              institution_name: 'School',
              degrees: [],
              start_date: new Date('2020-01-01'),
              end_date: new Date('2024-01-01'),
            },
          ],
        }
        const result = getGraduationDateRefValue(
          'graduation_date.bachelor',
          inputWithEmptyDegrees,
        )
        expect(result).toBeNull()
      })

      it('should handle education experience without end_date', () => {
        const inputWithoutEndDate: GraduationDateRefInput = {
          education_experiences: [
            {
              id: 'no-end-date',
              institution_name: 'School',
              level: 'bachelor',
              start_date: new Date('2020-01-01'),
              end_date: null,
            },
          ],
        }
        const result = getGraduationDateRefValue(
          'graduation_date.bachelor',
          inputWithoutEndDate,
        )
        expect(result).toBeNull()
      })

      it('should handle multiple education experiences with same degree level', () => {
        const inputWithMultipleBachelors: GraduationDateRefInput = {
          education_experiences: [
            {
              id: 'bachelor-early',
              institution_name: 'University A',
              level: 'bachelor',
              start_date: new Date('2018-09-01'),
              end_date: new Date('2022-05-15'),
            },
            {
              id: 'bachelor-late',
              institution_name: 'University B',
              level: 'bachelor',
              start_date: new Date('2020-09-01'),
              end_date: new Date('2024-05-20'), // Most recent
            },
          ],
        }
        const result = getGraduationDateRefValue(
          'graduation_date.bachelor',
          inputWithMultipleBachelors,
        )
        expect(result).toEqual(new Date('2024-05-20'))
      })
    })

    describe('complex scenarios', () => {
      it('should handle doctorate degree correctly', () => {
        const inputWithDoctorate: GraduationDateRefInput = {
          education_experiences: [
            ...mockEducationExperiences,
            {
              id: 'doctorate-1',
              institution_name: 'University D',
              level: 'doctorate',
              start_date: new Date('2026-09-01'),
              end_date: new Date('2030-05-15'),
            },
          ],
        }

        const result = getGraduationDateRefValue(
          'graduation_date.doctorate',
          inputWithDoctorate,
        )
        expect(result).toEqual(new Date('2030-05-15'))

        const resultOrHigher = getGraduationDateRefValue(
          'graduation_date.master_or_higher',
          inputWithDoctorate,
        )
        expect(resultOrHigher).toEqual(new Date('2030-05-15'))
      })
    })
  })
})
*/
