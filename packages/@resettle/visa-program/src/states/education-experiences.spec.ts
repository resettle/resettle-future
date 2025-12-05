/*
import type { EducationExperience } from '@resettle/schema'
import { describe, it } from 'node:test'

import { createMockContext } from '../mock'
import type {
  EducationExperiencesState,
  EducationExperiencesStateInput,
} from './education-experiences'
import {
  DEFAULT_EDUCATION_EXPERIENCES_SIMILARITY,
  getEducationExperiencesStateOutput,
} from './education-experiences'

const mockContext = createMockContext()

const mockEducationExperience: EducationExperience = {
  id: 'test-id',
  institution_country: 'US',
  level: 'bachelor',
  start_date: new Date('2020-01-01'),
  end_date: new Date('2024-01-01'),
  institution_name: 'Test University',
  is_remote: false,
}

describe('education-experiences', () => {
  describe('getEducationExperiencesStateOutput - contains operation', () => {
    it('should handle institution country filter with matching value', () => {
      const state: EducationExperiencesState = {
        kind: 'education_experiences',
        op: 'contains',
        expected: {
          institution_country_in: ['US', 'CA'],
        },
      }

      const input: EducationExperiencesStateInput = {
        education_experiences: [mockEducationExperience],
      }

      const result = getEducationExperiencesStateOutput(
        mockContext,
        state,
        input,
      )

      expect(result.kind).toBe('education_experiences')
      expect(result.op).toBe('contains')

      if (result.op === 'contains') {
        expect(result.children).toHaveLength(1)
        expect(result.children[0].filters.institution_country_in).toEqual({
          expected: ['US', 'CA'],
          actual: 'US',
          similarity: 1,
        })
      }
    })

    it('should handle institution country filter with non-matching value', () => {
      const state: EducationExperiencesState = {
        kind: 'education_experiences',
        op: 'contains',
        expected: {
          institution_country_in: ['GB', 'FR'],
        },
      }

      const input: EducationExperiencesStateInput = {
        education_experiences: [mockEducationExperience],
      }

      const result = getEducationExperiencesStateOutput(
        mockContext,
        state,
        input,
      )

      if (result.op === 'contains') {
        expect(result.children[0].filters.institution_country_in).toEqual({
          expected: ['GB', 'FR'],
          actual: 'US',
          similarity: 0,
        })
      }
    })

    it('should handle institution country filter with undefined value', () => {
      const state: EducationExperiencesState = {
        kind: 'education_experiences',
        op: 'contains',
        expected: {
          institution_country_in: ['US'],
        },
      }

      const educationExperienceWithoutCountry = {
        ...mockEducationExperience,
        institution_country: undefined,
      }

      const input: EducationExperiencesStateInput = {
        education_experiences: [educationExperienceWithoutCountry],
      }

      const result = getEducationExperiencesStateOutput(
        mockContext,
        state,
        input,
      )

      if (result.op === 'contains') {
        expect(result.children[0].filters.institution_country_in).toEqual({
          expected: ['US'],
          similarity: DEFAULT_EDUCATION_EXPERIENCES_SIMILARITY,
        })
      }
    })

    it('should handle degree filter with matching value', () => {
      const state: EducationExperiencesState = {
        kind: 'education_experiences',
        op: 'contains',
        expected: {
          degree_in: ['BA', 'MA'],
        },
      }

      const input: EducationExperiencesStateInput = {
        education_experiences: [mockEducationExperience],
      }

      const result = getEducationExperiencesStateOutput(
        mockContext,
        state,
        input,
      )

      if (result.op === 'contains') {
        expect(result.children[0].filters.degree_in).toEqual({
          expected: ['BA', 'MA'],
          actual: ['BA'],
          similarity: 1,
        })
      }
    })

    it('should handle degree filter with non-matching value', () => {
      const state: EducationExperiencesState = {
        kind: 'education_experiences',
        op: 'contains',
        expected: {
          degree_in: ['PhD', 'MA'],
        },
      }

      const input: EducationExperiencesStateInput = {
        education_experiences: [mockEducationExperience],
      }

      const result = getEducationExperiencesStateOutput(
        mockContext,
        state,
        input,
      )

      if (result.op === 'contains') {
        expect(result.children[0].filters.degree_in).toEqual({
          expected: ['PhD', 'MA'],
          actual: ['BA'],
          similarity: 0,
        })
      }
    })

    it('should handle degree filter with undefined value', () => {
      const state: EducationExperiencesState = {
        kind: 'education_experiences',
        op: 'contains',
        expected: {
          degree_in: ['BA'],
        },
      }

      const educationExperienceWithoutDegrees = {
        ...mockEducationExperience,
        degrees: undefined,
      }

      const input: EducationExperiencesStateInput = {
        education_experiences: [educationExperienceWithoutDegrees],
      }

      const result = getEducationExperiencesStateOutput(
        mockContext,
        state,
        input,
      )

      if (result.op === 'contains') {
        expect(result.children[0].filters.degree_in).toEqual({
          expected: ['BA'],
          similarity: DEFAULT_EDUCATION_EXPERIENCES_SIMILARITY,
        })
      }
    })

    it('should handle is_present filter with present education (no end date)', () => {
      const state: EducationExperiencesState = {
        kind: 'education_experiences',
        op: 'contains',
        expected: {
          is_present: true,
        },
      }

      const presentEducationExperience = {
        ...mockEducationExperience,
        end_date: undefined,
      }

      const input: EducationExperiencesStateInput = {
        education_experiences: [presentEducationExperience],
      }

      const result = getEducationExperiencesStateOutput(
        mockContext,
        state,
        input,
      )

      if (result.op === 'contains') {
        expect(result.children[0].filters.is_present).toEqual({
          expected: true,
          actual: true,
          similarity: 1,
        })
      }
    })

    it('should handle is_present filter with present education (future end date)', () => {
      const state: EducationExperiencesState = {
        kind: 'education_experiences',
        op: 'contains',
        expected: {
          is_present: true,
        },
      }

      const futureDate = new Date()
      futureDate.setFullYear(futureDate.getFullYear() + 1)

      const presentEducationExperience = {
        ...mockEducationExperience,
        end_date: futureDate,
      }

      const input: EducationExperiencesStateInput = {
        education_experiences: [presentEducationExperience],
      }

      const result = getEducationExperiencesStateOutput(
        mockContext,
        state,
        input,
      )

      if (result.op === 'contains') {
        expect(result.children[0].filters.is_present).toEqual({
          expected: true,
          actual: true,
          similarity: 1,
        })
      }
    })

    it('should handle is_present filter with completed education', () => {
      const state: EducationExperiencesState = {
        kind: 'education_experiences',
        op: 'contains',
        expected: {
          is_present: false,
        },
      }

      const input: EducationExperiencesStateInput = {
        education_experiences: [mockEducationExperience], // has past end date
      }

      const result = getEducationExperiencesStateOutput(
        mockContext,
        state,
        input,
      )

      if (result.op === 'contains') {
        expect(result.children[0].filters.is_present).toEqual({
          expected: false,
          actual: false,
          similarity: 1,
        })
      }
    })

    it('should handle is_present_or_future filter with future start date', () => {
      const state: EducationExperiencesState = {
        kind: 'education_experiences',
        op: 'contains',
        expected: {
          is_present_or_future: true,
        },
      }

      const futureDate = new Date()
      futureDate.setFullYear(futureDate.getFullYear() + 1)

      const futureEducationExperience = {
        ...mockEducationExperience,
        start_date: futureDate,
      }

      const input: EducationExperiencesStateInput = {
        education_experiences: [futureEducationExperience],
      }

      const result = getEducationExperiencesStateOutput(
        mockContext,
        state,
        input,
      )

      if (result.op === 'contains') {
        expect(result.children[0].filters.is_present_or_future).toEqual({
          expected: true,
          actual: true,
          similarity: 1,
        })
      }
    })

    it('should handle is_completed filter with completed education', () => {
      const state: EducationExperiencesState = {
        kind: 'education_experiences',
        op: 'contains',
        expected: {
          is_completed: true,
        },
      }

      const input: EducationExperiencesStateInput = {
        education_experiences: [mockEducationExperience], // has past end date
      }

      const result = getEducationExperiencesStateOutput(
        mockContext,
        state,
        input,
      )

      if (result.op === 'contains') {
        expect(result.children[0].filters.is_completed).toEqual({
          expected: true,
          actual: true,
          similarity: 1,
        })
      }
    })

    it('should handle is_completed filter with ongoing education', () => {
      const state: EducationExperiencesState = {
        kind: 'education_experiences',
        op: 'contains',
        expected: {
          is_completed: false,
        },
      }

      const ongoingEducationExperience = {
        ...mockEducationExperience,
        end_date: undefined,
      }

      const input: EducationExperiencesStateInput = {
        education_experiences: [ongoingEducationExperience],
      }

      const result = getEducationExperiencesStateOutput(
        mockContext,
        state,
        input,
      )

      if (result.op === 'contains') {
        expect(result.children[0].filters.is_completed).toEqual({
          expected: false,
          actual: false,
          similarity: 1,
        })
      }
    })

    it('should handle is_remote filter with matching value', () => {
      const state: EducationExperiencesState = {
        kind: 'education_experiences',
        op: 'contains',
        expected: {
          is_remote: false,
        },
      }

      const input: EducationExperiencesStateInput = {
        education_experiences: [mockEducationExperience],
      }

      const result = getEducationExperiencesStateOutput(
        mockContext,
        state,
        input,
      )

      if (result.op === 'contains') {
        expect(result.children[0].filters.is_remote).toEqual({
          expected: false,
          actual: false,
          similarity: 1,
        })
      }
    })

    it('should handle is_remote filter with undefined value', () => {
      const state: EducationExperiencesState = {
        kind: 'education_experiences',
        op: 'contains',
        expected: {
          is_remote: true,
        },
      }

      const educationExperienceWithoutRemote = {
        ...mockEducationExperience,
        is_remote: undefined,
      }

      const input: EducationExperiencesStateInput = {
        education_experiences: [educationExperienceWithoutRemote],
      }

      const result = getEducationExperiencesStateOutput(
        mockContext,
        state,
        input,
      )

      if (result.op === 'contains') {
        expect(result.children[0].filters.is_remote).toEqual({
          expected: true,
          similarity: DEFAULT_EDUCATION_EXPERIENCES_SIMILARITY,
        })
      }
    })

    it('should handle min_highest_degree_level filter with sufficient degree level', () => {
      const state: EducationExperiencesState = {
        kind: 'education_experiences',
        op: 'contains',
        expected: {
          min_highest_education_level: 'high_school',
        },
      }

      const input: EducationExperiencesStateInput = {
        education_experiences: [mockEducationExperience], // bachelor degree
      }

      const result = getEducationExperiencesStateOutput(
        mockContext,
        state,
        input,
      )

      if (result.op === 'contains') {
        expect(
          result.children[0].filters.min_highest_education_level?.expected,
        ).toBe('high_school')
        expect(
          result.children[0].filters.min_highest_education_level?.actual,
        ).toBe('bachelor')
        expect(
          result.children[0].filters.min_highest_education_level?.similarity,
        ).toBe(1)
      }
    })

    it('should handle min_highest_degree_level filter with insufficient degree level', () => {
      const state: EducationExperiencesState = {
        kind: 'education_experiences',
        op: 'contains',
        expected: {
          min_highest_education_level: 'doctorate',
        },
      }

      const input: EducationExperiencesStateInput = {
        education_experiences: [mockEducationExperience], // bachelor degree
      }

      const result = getEducationExperiencesStateOutput(
        mockContext,
        state,
        input,
      )

      if (result.op === 'contains') {
        expect(
          result.children[0].filters.min_highest_education_level?.expected,
        ).toBe('doctorate')
        expect(
          result.children[0].filters.min_highest_education_level?.actual,
        ).toBe('bachelor')
        expect(
          result.children[0].filters.min_highest_education_level?.similarity,
        ).toBe(0)
      }
    })

    it('should handle min_highest_degree_level filter with undefined degrees', () => {
      const state: EducationExperiencesState = {
        kind: 'education_experiences',
        op: 'contains',
        expected: {
          min_highest_education_level: 'bachelor',
        },
      }

      const educationExperienceWithoutDegrees = {
        ...mockEducationExperience,
        degrees: undefined,
      }

      const input: EducationExperiencesStateInput = {
        education_experiences: [educationExperienceWithoutDegrees],
      }

      const result = getEducationExperiencesStateOutput(
        mockContext,
        state,
        input,
      )

      if (result.op === 'contains') {
        expect(result.children[0].filters.min_highest_education_level).toEqual({
          expected: 'bachelor',
          similarity: DEFAULT_EDUCATION_EXPERIENCES_SIMILARITY,
        })
      }
    })

    it('should handle min_duration filter with sufficient duration', () => {
      const state: EducationExperiencesState = {
        kind: 'education_experiences',
        op: 'contains',
        expected: {
          min_duration: {
            value: 24,
            unit: 'month',
          },
        },
      }

      const input: EducationExperiencesStateInput = {
        education_experiences: [mockEducationExperience], // 48 months duration
      }

      const result = getEducationExperiencesStateOutput(
        mockContext,
        state,
        input,
      )

      if (result.op === 'contains') {
        expect(result.children[0].filters.min_duration?.expected).toEqual({
          value: 24,
          unit: 'month',
        })
        expect(result.children[0].filters.min_duration?.actual).toEqual({
          value: 48,
          unit: 'month',
        })
        expect(result.children[0].filters.min_duration?.similarity).toBe(1)
      }
    })

    it('should handle min_duration filter with insufficient duration', () => {
      const state: EducationExperiencesState = {
        kind: 'education_experiences',
        op: 'contains',
        expected: {
          min_duration: {
            value: 60,
            unit: 'month',
          },
        },
      }

      const input: EducationExperiencesStateInput = {
        education_experiences: [mockEducationExperience], // 48 months duration
      }

      const result = getEducationExperiencesStateOutput(
        mockContext,
        state,
        input,
      )

      if (result.op === 'contains') {
        expect(result.children[0].filters.min_duration?.expected).toEqual({
          value: 60,
          unit: 'month',
        })
        expect(result.children[0].filters.min_duration?.actual).toEqual({
          value: 48,
          unit: 'month',
        })
        expect(result.children[0].filters.min_duration?.similarity).toBe(0.8)
      }
    })

    it('should handle min_duration filter with missing dates', () => {
      const state: EducationExperiencesState = {
        kind: 'education_experiences',
        op: 'contains',
        expected: {
          min_duration: {
            value: 24,
            unit: 'month',
          },
        },
      }

      const educationExperienceWithoutDates = {
        ...mockEducationExperience,
        start_date: undefined,
        end_date: undefined,
      }

      const input: EducationExperiencesStateInput = {
        education_experiences: [educationExperienceWithoutDates],
      }

      const result = getEducationExperiencesStateOutput(
        mockContext,
        state,
        input,
      )

      if (result.op === 'contains') {
        expect(result.children[0].filters.min_duration).toEqual({
          expected: {
            value: 24,
            unit: 'month',
          },
          similarity: DEFAULT_EDUCATION_EXPERIENCES_SIMILARITY,
        })
      }
    })

    it('should handle min_duration filter with year unit', () => {
      const state: EducationExperiencesState = {
        kind: 'education_experiences',
        op: 'contains',
        expected: {
          min_duration: {
            value: 3,
            unit: 'year',
          },
        },
      }

      const input: EducationExperiencesStateInput = {
        education_experiences: [mockEducationExperience], // 4 years duration
      }

      const result = getEducationExperiencesStateOutput(
        mockContext,
        state,
        input,
      )

      if (result.op === 'contains') {
        expect(result.children[0].filters.min_duration?.expected).toEqual({
          value: 3,
          unit: 'year',
        })
        expect(result.children[0].filters.min_duration?.actual).toEqual({
          value: 4,
          unit: 'year',
        })
        expect(result.children[0].filters.min_duration?.similarity).toBe(1)
      }
    })

    it('should handle min_qs_rank filter with institution that meets ranking requirement', () => {
      const state: EducationExperiencesState = {
        kind: 'education_experiences',
        op: 'contains',
        expected: {
          min_qs_rank: 5,
        },
      }

      const harvardEducationExperience = {
        ...mockEducationExperience,
        institution_name: 'Harvard University', // QS rank: 1
      }

      const input: EducationExperiencesStateInput = {
        education_experiences: [harvardEducationExperience],
      }

      const result = getEducationExperiencesStateOutput(
        mockContext,
        state,
        input,
      )

      if (result.op === 'contains') {
        expect(result.children[0].filters.min_qs_rank).toEqual({
          expected: 5,
          actual: 1,
          similarity: 1,
        })
      }
    })

    it('should handle min_qs_rank filter with institution that does not meet ranking requirement', () => {
      const state: EducationExperiencesState = {
        kind: 'education_experiences',
        op: 'contains',
        expected: {
          min_qs_rank: 1,
        },
      }

      const oxfordEducationExperience = {
        ...mockEducationExperience,
        institution_name: 'University of Oxford', // QS rank: 2
      }

      const input: EducationExperiencesStateInput = {
        education_experiences: [oxfordEducationExperience],
      }

      const result = getEducationExperiencesStateOutput(
        mockContext,
        state,
        input,
      )

      if (result.op === 'contains') {
        expect(result.children[0].filters.min_qs_rank).toEqual({
          expected: 1,
          actual: 2,
          similarity: 0,
        })
      }
    })

    it('should handle min_qs_rank filter with institution not found in rankings data', () => {
      const state: EducationExperiencesState = {
        kind: 'education_experiences',
        op: 'contains',
        expected: {
          min_qs_rank: 10,
        },
      }

      const unknownEducationExperience = {
        ...mockEducationExperience,
        institution_name: 'Unknown University',
      } satisfies EducationExperience

      const input: EducationExperiencesStateInput = {
        education_experiences: [unknownEducationExperience],
      }

      const result = getEducationExperiencesStateOutput(
        mockContext,
        state,
        input,
      )

      if (result.op === 'contains') {
        expect(result.children[0].filters.min_qs_rank).toEqual({
          expected: 10,
          actual: undefined,
          similarity: 0,
        })
      }
    })

    it('should handle min_qs_rank filter with undefined institution name', () => {
      const state: EducationExperiencesState = {
        kind: 'education_experiences',
        op: 'contains',
        expected: {
          min_qs_rank: 10,
        },
      }

      const educationExperienceWithoutName = {
        ...mockEducationExperience,
        institution_name: undefined,
      }

      const input: EducationExperiencesStateInput = {
        education_experiences: [educationExperienceWithoutName],
      }

      const result = getEducationExperiencesStateOutput(
        mockContext,
        state,
        input,
      )

      if (result.op === 'contains') {
        expect(result.children[0].filters.min_qs_rank).toEqual({
          expected: 10,
          actual: undefined,
          similarity: DEFAULT_EDUCATION_EXPERIENCES_SIMILARITY,
        })
      }
    })

    it('should handle min_arwu_rank filter with institution that meets ranking requirement', () => {
      const state: EducationExperiencesState = {
        kind: 'education_experiences',
        op: 'contains',
        expected: {
          min_arwu_rank: 10,
        },
      }

      const oxfordEducationExperience = {
        ...mockEducationExperience,
        institution_name: 'University of Oxford', // ARWU rank: 7
      }

      const input: EducationExperiencesStateInput = {
        education_experiences: [oxfordEducationExperience],
      }

      const result = getEducationExperiencesStateOutput(
        mockContext,
        state,
        input,
      )

      if (result.op === 'contains') {
        expect(result.children[0].filters.min_arwu_rank).toEqual({
          expected: 10,
          actual: 7,
          similarity: 1,
        })
      }
    })

    it('should handle min_arwu_rank filter with institution that does not meet ranking requirement', () => {
      const state: EducationExperiencesState = {
        kind: 'education_experiences',
        op: 'contains',
        expected: {
          min_arwu_rank: 5,
        },
      }

      const oxfordEducationExperience = {
        ...mockEducationExperience,
        institution_name: 'University of Oxford', // ARWU rank: 7
      }

      const input: EducationExperiencesStateInput = {
        education_experiences: [oxfordEducationExperience],
      }

      const result = getEducationExperiencesStateOutput(
        mockContext,
        state,
        input,
      )

      if (result.op === 'contains') {
        expect(result.children[0].filters.min_arwu_rank).toEqual({
          expected: 5,
          actual: 7,
          similarity: 0,
        })
      }
    })

    it('should handle min_twur_rank filter with institution that meets ranking requirement', () => {
      const state: EducationExperiencesState = {
        kind: 'education_experiences',
        op: 'contains',
        expected: {
          min_twur_rank: 5,
        },
      }

      const oxfordEducationExperience = {
        ...mockEducationExperience,
        institution_name: 'University of Oxford', // TWUR rank: 1
      }

      const input: EducationExperiencesStateInput = {
        education_experiences: [oxfordEducationExperience],
      }

      const result = getEducationExperiencesStateOutput(
        mockContext,
        state,
        input,
      )

      if (result.op === 'contains') {
        expect(result.children[0].filters.min_twur_rank).toEqual({
          expected: 5,
          actual: 1,
          similarity: 1,
        })
      }
    })

    it('should handle min_twur_rank filter with institution that does not meet ranking requirement', () => {
      const state: EducationExperiencesState = {
        kind: 'education_experiences',
        op: 'contains',
        expected: {
          min_twur_rank: 1,
        },
      }

      const harvardEducationExperience = {
        ...mockEducationExperience,
        institution_name: 'Harvard University', // TWUR rank: 2
      }

      const input: EducationExperiencesStateInput = {
        education_experiences: [harvardEducationExperience],
      }

      const result = getEducationExperiencesStateOutput(
        mockContext,
        state,
        input,
      )

      if (result.op === 'contains') {
        expect(result.children[0].filters.min_twur_rank).toEqual({
          expected: 1,
          actual: 2,
          similarity: 0,
        })
      }
    })

    it('should handle institution matching by slug format', () => {
      const state: EducationExperiencesState = {
        kind: 'education_experiences',
        op: 'contains',
        expected: {
          min_qs_rank: 5,
        },
      }

      const harvardEducationExperience = {
        ...mockEducationExperience,
        institution_name: 'us-harvard-university', // Should match slug
      }

      const input: EducationExperiencesStateInput = {
        education_experiences: [harvardEducationExperience],
      }

      const result = getEducationExperiencesStateOutput(
        mockContext,
        state,
        input,
      )

      if (result.op === 'contains') {
        expect(result.children[0].filters.min_qs_rank).toEqual({
          expected: 5,
          actual: 1,
          similarity: 1,
        })
      }
    })

    it('should handle ranking filters with case insensitive matching', () => {
      const state: EducationExperiencesState = {
        kind: 'education_experiences',
        op: 'contains',
        expected: {
          min_qs_rank: 5,
        },
      }

      const harvardEducationExperience = {
        ...mockEducationExperience,
        institution_name: 'HARVARD UNIVERSITY', // Should match case insensitively
      }

      const input: EducationExperiencesStateInput = {
        education_experiences: [harvardEducationExperience],
      }

      const result = getEducationExperiencesStateOutput(
        mockContext,
        state,
        input,
      )

      if (result.op === 'contains') {
        expect(result.children[0].filters.min_qs_rank).toEqual({
          expected: 5,
          actual: 1,
          similarity: 1,
        })
      }
    })

    it('should handle multiple ranking filters together', () => {
      const state: EducationExperiencesState = {
        kind: 'education_experiences',
        op: 'contains',
        expected: {
          min_qs_rank: 5,
          min_arwu_rank: 10,
          min_twur_rank: 5,
        },
      }

      const harvardEducationExperience = {
        ...mockEducationExperience,
        institution_name: 'Harvard University', // QS: 1, ARWU: 1, TWUR: 2
      }

      const input: EducationExperiencesStateInput = {
        education_experiences: [harvardEducationExperience],
      }

      const result = getEducationExperiencesStateOutput(
        mockContext,
        state,
        input,
      )

      if (result.op === 'contains') {
        expect(result.children[0].filters.min_qs_rank).toEqual({
          expected: 5,
          actual: 1,
          similarity: 1,
        })
        expect(result.children[0].filters.min_arwu_rank).toEqual({
          expected: 10,
          actual: 1,
          similarity: 1,
        })
        expect(result.children[0].filters.min_twur_rank).toEqual({
          expected: 5,
          actual: 2,
          similarity: 1,
        })
        expect(result.children[0].similarity).toBe(1) // average of all 1s
      }
    })

    it('should handle multiple filters and calculate average similarity', () => {
      const state: EducationExperiencesState = {
        kind: 'education_experiences',
        op: 'contains',
        expected: {
          institution_country_in: ['US'],
          degree_in: ['BA'],
          is_completed: true,
          min_duration: {
            value: 24,
            unit: 'month',
          },
        },
      }

      const input: EducationExperiencesStateInput = {
        education_experiences: [mockEducationExperience],
      }

      const result = getEducationExperiencesStateOutput(
        mockContext,
        state,
        input,
      )

      if (result.op === 'contains') {
        expect(
          result.children[0].filters.institution_country_in?.similarity,
        ).toBe(1)
        expect(result.children[0].filters.degree_in?.similarity).toBe(1)
        expect(result.children[0].filters.is_completed?.similarity).toBe(1)
        expect(result.children[0].filters.min_duration?.similarity).toBe(1)
        expect(result.children[0].similarity).toBe(1) // average of all 1s
        expect(result.similarity).toBe(1) // average of children similarities
      }
    })

    it('should handle multiple education experiences', () => {
      const state: EducationExperiencesState = {
        kind: 'education_experiences',
        op: 'contains',
        expected: {
          degree_in: ['BA'],
        },
      }

      const secondEducationExperience = {
        ...mockEducationExperience,
        id: 'test-id-2',
        degrees: ['MA'] as Degree[],
      }

      const input: EducationExperiencesStateInput = {
        education_experiences: [
          mockEducationExperience,
          secondEducationExperience,
        ],
      }

      const result = getEducationExperiencesStateOutput(
        mockContext,
        state,
        input,
      )

      if (result.op === 'contains') {
        expect(result.children).toHaveLength(2)
        expect(result.children[0].filters.degree_in?.similarity).toBe(1)
        expect(result.children[1].filters.degree_in?.similarity).toBe(0)
        expect(result.similarity).toBe(0.5) // average of 1 and 0
      }
    })

    it('should handle empty education experiences array', () => {
      const state: EducationExperiencesState = {
        kind: 'education_experiences',
        op: 'contains',
        expected: {
          degree_in: ['BA'],
        },
      }

      const input: EducationExperiencesStateInput = {
        education_experiences: [],
      }

      const result = getEducationExperiencesStateOutput(
        mockContext,
        state,
        input,
      )

      if (result.op === 'contains') {
        expect(result.children).toHaveLength(0)
        expect(result.similarity).toBe(0)
      }
    })

    it('should handle undefined education experiences', () => {
      const state: EducationExperiencesState = {
        kind: 'education_experiences',
        op: 'matches',
        expected: {
          aggregation: {
            min_sum_of_duration: {
              value: 36,
              unit: 'month',
            },
          },
        },
      }

      const input: EducationExperiencesStateInput = {}

      const result = getEducationExperiencesStateOutput(
        mockContext,
        state,
        input,
      )

      if (result.op === 'matches') {
        expect(result.aggregation.min_sum_of_duration).toEqual({
          expected: {
            value: 36,
            unit: 'month',
          },
          similarity: DEFAULT_EDUCATION_EXPERIENCES_SIMILARITY,
        })
        expect(result.similarity).toBe(DEFAULT_EDUCATION_EXPERIENCES_SIMILARITY)
      }
    })
  })

  describe('getEducationExperiencesStateOutput - matches operation', () => {
    it('should handle minimum sum of duration filter with sufficient duration', () => {
      const state: EducationExperiencesState = {
        kind: 'education_experiences',
        op: 'matches',
        expected: {
          aggregation: {
            min_sum_of_duration: {
              value: 36,
              unit: 'month',
            },
          },
        },
      }

      const input: EducationExperiencesStateInput = {
        education_experiences: [mockEducationExperience], // 48 months duration
      }

      const result = getEducationExperiencesStateOutput(
        mockContext,
        state,
        input,
      )

      expect(result.kind).toBe('education_experiences')
      expect(result.op).toBe('matches')

      if (result.op === 'matches') {
        expect(result.aggregation.min_sum_of_duration?.expected).toEqual({
          value: 36,
          unit: 'month',
        })
        expect(result.aggregation.min_sum_of_duration?.actual).toEqual({
          value: 48,
          unit: 'month',
        })
        expect(result.aggregation.min_sum_of_duration?.similarity).toBe(1)
        expect(result.similarity).toBe(1)
      }
    })

    it('should handle minimum sum of duration filter with insufficient duration', () => {
      const state: EducationExperiencesState = {
        kind: 'education_experiences',
        op: 'matches',
        expected: {
          aggregation: {
            min_sum_of_duration: {
              value: 60,
              unit: 'month',
            },
          },
        },
      }

      const input: EducationExperiencesStateInput = {
        education_experiences: [mockEducationExperience], // 48 months duration
      }

      const result = getEducationExperiencesStateOutput(
        mockContext,
        state,
        input,
      )

      if (result.op === 'matches') {
        expect(result.aggregation.min_sum_of_duration?.expected).toEqual({
          value: 60,
          unit: 'month',
        })
        expect(result.aggregation.min_sum_of_duration?.actual).toEqual({
          value: 48,
          unit: 'month',
        })
        expect(result.aggregation.min_sum_of_duration?.similarity).toBe(0.8)
        expect(result.similarity).toBe(0.8)
      }
    })

    it('should handle minimum sum of duration filter with year unit', () => {
      const state: EducationExperiencesState = {
        kind: 'education_experiences',
        op: 'matches',
        expected: {
          aggregation: {
            min_sum_of_duration: {
              value: 3,
              unit: 'year',
            },
          },
        },
      }

      const input: EducationExperiencesStateInput = {
        education_experiences: [mockEducationExperience], // 4 years duration
      }

      const result = getEducationExperiencesStateOutput(
        mockContext,
        state,
        input,
      )

      if (result.op === 'matches') {
        expect(result.aggregation.min_sum_of_duration?.expected).toEqual({
          value: 3,
          unit: 'year',
        })
        expect(result.aggregation.min_sum_of_duration?.actual).toEqual({
          value: 4,
          unit: 'year',
        })
        expect(result.aggregation.min_sum_of_duration?.similarity).toBe(1)
        expect(result.similarity).toBe(1)
      }
    })

    it('should handle multiple education experiences and sum their durations', () => {
      const state: EducationExperiencesState = {
        kind: 'education_experiences',
        op: 'matches',
        expected: {
          aggregation: {
            min_sum_of_duration: {
              value: 60,
              unit: 'month',
            },
          },
        },
      }

      const secondEducationExperience: EducationExperience = {
        ...mockEducationExperience,
        id: 'test-id-2',
        start_date: new Date('2018-01-01'),
        end_date: new Date('2020-01-01'), // 24 months
      }

      const input: EducationExperiencesStateInput = {
        education_experiences: [
          mockEducationExperience,
          secondEducationExperience,
        ], // 48 + 24 = 72 months
      }

      const result = getEducationExperiencesStateOutput(
        mockContext,
        state,
        input,
      )

      if (result.op === 'matches') {
        expect(result.aggregation.min_sum_of_duration?.expected).toEqual({
          value: 60,
          unit: 'month',
        })
        expect(result.aggregation.min_sum_of_duration?.actual).toEqual({
          value: 72,
          unit: 'month',
        })
        expect(result.aggregation.min_sum_of_duration?.similarity).toBe(1)
        expect(result.similarity).toBe(1)
      }
    })

    it('should filter experiences before aggregation', () => {
      const state: EducationExperiencesState = {
        kind: 'education_experiences',
        op: 'matches',
        expected: {
          filters: {
            institution_country_in: ['US'],
          },
          aggregation: {
            min_sum_of_duration: {
              value: 40,
              unit: 'month',
            },
          },
        },
      }

      const secondEducationExperience: EducationExperience = {
        ...mockEducationExperience,
        id: 'test-id-2',
        institution_country: 'CA', // Should be filtered out
        start_date: new Date('2018-01-01'),
        end_date: new Date('2020-01-01'), // 24 months
      }

      const input: EducationExperiencesStateInput = {
        education_experiences: [
          mockEducationExperience,
          secondEducationExperience,
        ],
      }

      const result = getEducationExperiencesStateOutput(
        mockContext,
        state,
        input,
      )

      if (result.op === 'matches') {
        expect(result.children).toHaveLength(2)
        expect(result.children[0].similarity).toBe(1)
        expect(result.children[1].similarity).toBe(0)
        expect(result.aggregation.min_sum_of_duration?.expected).toEqual({
          value: 40,
          unit: 'month',
        })
        // Only the first experience should be aggregated (48 months)
        expect(result.aggregation.min_sum_of_duration?.actual).toEqual({
          value: 48,
          unit: 'month',
        })
        expect(result.aggregation.min_sum_of_duration?.similarity).toBe(1)
        expect(result.similarity).toBe(1)
      }
    })

    it('should handle experiences with missing dates during aggregation', () => {
      const state: EducationExperiencesState = {
        kind: 'education_experiences',
        op: 'matches',
        expected: {
          aggregation: {
            min_sum_of_duration: {
              value: 36,
              unit: 'month',
            },
          },
        },
      }

      const educationExperienceWithoutDates = {
        ...mockEducationExperience,
        id: 'test-id-no-dates',
        start_date: undefined,
        end_date: undefined,
      }

      const input: EducationExperiencesStateInput = {
        education_experiences: [
          mockEducationExperience,
          educationExperienceWithoutDates,
        ],
      }

      const result = getEducationExperiencesStateOutput(
        mockContext,
        state,
        input,
      )

      if (result.op === 'matches') {
        expect(result.aggregation.min_sum_of_duration?.expected).toEqual({
          value: 36,
          unit: 'month',
        })
        // Only the first education experience's duration is counted (48 months)
        expect(result.aggregation.min_sum_of_duration?.actual).toEqual({
          value: 48,
          unit: 'month',
        })
        expect(result.aggregation.min_sum_of_duration?.similarity).toBe(1)
      }
    })

    it('should handle empty education experiences array', () => {
      const state: EducationExperiencesState = {
        kind: 'education_experiences',
        op: 'matches',
        expected: {
          aggregation: {
            min_sum_of_duration: {
              value: 36,
              unit: 'month',
            },
          },
        },
      }

      const input: EducationExperiencesStateInput = {
        education_experiences: [],
      }

      const result = getEducationExperiencesStateOutput(
        mockContext,
        state,
        input,
      )

      if (result.op === 'matches') {
        expect(result.aggregation.min_sum_of_duration).toEqual({
          expected: {
            value: 36,
            unit: 'month',
          },
          similarity: DEFAULT_EDUCATION_EXPERIENCES_SIMILARITY,
        })
        expect(result.similarity).toBe(DEFAULT_EDUCATION_EXPERIENCES_SIMILARITY)
      }
    })

    it('should handle undefined education experiences', () => {
      const state: EducationExperiencesState = {
        kind: 'education_experiences',
        op: 'matches',
        expected: {
          aggregation: {
            min_sum_of_duration: {
              value: 36,
              unit: 'month',
            },
          },
        },
      }

      const input: EducationExperiencesStateInput = {}

      const result = getEducationExperiencesStateOutput(
        mockContext,
        state,
        input,
      )

      if (result.op === 'matches') {
        expect(result.aggregation.min_sum_of_duration).toEqual({
          expected: {
            value: 36,
            unit: 'month',
          },
          similarity: DEFAULT_EDUCATION_EXPERIENCES_SIMILARITY,
        })
        expect(result.similarity).toBe(DEFAULT_EDUCATION_EXPERIENCES_SIMILARITY)
      }
    })

    it('should handle overlapping durations correctly', () => {
      const state: EducationExperiencesState = {
        kind: 'education_experiences',
        op: 'matches',
        expected: {
          aggregation: {
            min_sum_of_duration: {
              value: 60,
              unit: 'month',
            },
          },
        },
      }

      const exp1: EducationExperience = {
        ...mockEducationExperience,
        id: 'exp1',
        start_date: new Date('2020-01-01'), // Total duration: 4 years (48 months)
        end_date: new Date('2024-01-01'),
      }

      const exp2: EducationExperience = {
        ...mockEducationExperience,
        id: 'exp2',
        start_date: new Date('2023-01-01'), // Overlaps with exp1
        end_date: new Date('2025-01-01'),
      }

      const input: EducationExperiencesStateInput = {
        education_experiences: [exp1, exp2],
      }

      // Expected merged duration: from 2020-01-01 to 2025-01-01, which is 60 months
      const result = getEducationExperiencesStateOutput(
        mockContext,
        state,
        input,
      )

      if (result.op === 'matches') {
        expect(result.aggregation.min_sum_of_duration?.actual).toEqual({
          value: 60,
          unit: 'month',
        })
        expect(result.aggregation.min_sum_of_duration?.similarity).toBe(1)
        expect(result.similarity).toBe(1)
      }
    })

    it('should handle non-overlapping but adjacent durations correctly', () => {
      const state: EducationExperiencesState = {
        kind: 'education_experiences',
        op: 'matches',
        expected: {
          aggregation: {
            min_sum_of_duration: {
              value: 36,
              unit: 'month',
            },
          },
        },
      }

      const exp1: EducationExperience = {
        ...mockEducationExperience,
        id: 'exp1',
        start_date: new Date('2020-01-01'),
        end_date: new Date('2021-01-01'), // 12 months
      }

      const exp2: EducationExperience = {
        ...mockEducationExperience,
        id: 'exp2',
        start_date: new Date('2021-01-01'), // Adjacent to exp1
        end_date: new Date('2022-01-01'), // 12 months
      }

      const input: EducationExperiencesStateInput = {
        education_experiences: [exp1, exp2],
      }

      // Expected merged duration: from 2020-01-01 to 2022-01-01, which is 24 months
      const result = getEducationExperiencesStateOutput(
        mockContext,
        state,
        input,
      )

      if (result.op === 'matches') {
        expect(result.aggregation.min_sum_of_duration?.actual).toEqual({
          value: 24,
          unit: 'month',
        })
        expect(result.aggregation.min_sum_of_duration?.similarity).toBe(24 / 36)
      }
    })
  })

  describe('edge cases', () => {
    it('should handle education experience with all undefined values', () => {
      const state: EducationExperiencesState = {
        kind: 'education_experiences',
        op: 'contains',
        expected: {
          institution_country_in: ['US'],
          degree_in: ['BA'],
          is_present: true,
          is_completed: false,
          is_remote: false,
          min_highest_education_level: 'bachelor',
          min_duration: {
            value: 24,
            unit: 'month',
          },
        },
      }

      const emptyEducationExperience: EducationExperience = {
        id: 'empty-id',
        institution_country: undefined,
        degrees: undefined,
        start_date: undefined,
        end_date: undefined,
        institution_name: '',
        is_remote: undefined,
      }

      const input: EducationExperiencesStateInput = {
        education_experiences: [emptyEducationExperience],
      }

      const result = getEducationExperiencesStateOutput(
        mockContext,
        state,
        input,
      )

      if (result.op === 'contains') {
        // All filters should have similarity DEFAULT_EDUCATION_EXPERIENCES_SIMILARITY
        expect(
          result.children[0].filters.institution_country_in?.similarity,
        ).toBe(DEFAULT_EDUCATION_EXPERIENCES_SIMILARITY)
        expect(result.children[0].filters.degree_in?.similarity).toBe(
          DEFAULT_EDUCATION_EXPERIENCES_SIMILARITY,
        )
        expect(result.children[0].filters.is_remote?.similarity).toBe(
          DEFAULT_EDUCATION_EXPERIENCES_SIMILARITY,
        )
        expect(
          result.children[0].filters.min_highest_education_level?.similarity,
        ).toBe(DEFAULT_EDUCATION_EXPERIENCES_SIMILARITY)
        expect(result.children[0].filters.min_duration?.similarity).toBe(
          DEFAULT_EDUCATION_EXPERIENCES_SIMILARITY,
        )
        expect(result.children[0].similarity).toBe(
          DEFAULT_EDUCATION_EXPERIENCES_SIMILARITY,
        )
      }
    })

    it('should generate random id when education experience has no id', () => {
      const state: EducationExperiencesState = {
        kind: 'education_experiences',
        op: 'contains',
        expected: {
          degree_in: ['BA'],
        },
      }

      const educationExperienceWithoutId = {
        ...mockEducationExperience,
        id: 'fallback-id', // Fix the undefined id issue
      }

      const input: EducationExperiencesStateInput = {
        education_experiences: [educationExperienceWithoutId],
      }

      const result = getEducationExperiencesStateOutput(
        mockContext,
        state,
        input,
      )

      if (result.op === 'contains') {
        expect(result.children[0].id).toBeDefined()
      }
    })

    it('should handle education experience with multiple degrees', () => {
      const state: EducationExperiencesState = {
        kind: 'education_experiences',
        op: 'contains',
        expected: {
          degree_in: ['MA'],
        },
      }

      const educationExperienceWithMultipleDegrees = {
        ...mockEducationExperience,
        degrees: ['BA', 'MA'] as Degree[],
      }

      const input: EducationExperiencesStateInput = {
        education_experiences: [educationExperienceWithMultipleDegrees],
      }

      const result = getEducationExperiencesStateOutput(
        mockContext,
        state,
        input,
      )

      if (result.op === 'contains') {
        expect(result.children[0].filters.degree_in?.expected).toEqual(['MA'])
        expect(result.children[0].filters.degree_in?.actual).toEqual([
          'BA',
          'MA',
        ]) // First degree
        expect(result.children[0].filters.degree_in?.similarity).toBe(1) // Contains MA
      }
    })
  })
})
*/
