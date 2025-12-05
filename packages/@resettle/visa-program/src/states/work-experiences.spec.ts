/*
import type {
  EducationExperience,
  EmploymentType,
  WorkExperience,
} from '@resettle/schema'
import assert from 'node:assert'
import { describe, it } from 'node:test'

import { createMockContext } from '../mock'
import type {
  WorkExperiencesState,
  WorkExperiencesStateInput,
} from './work-experiences'
import {
  DEFAULT_WORK_EXPERIENCES_SIMILARITY,
  getWorkExperiencesStateOutput,
} from './work-experiences'

const mockContext = createMockContext()

// Mock education experiences to support graduation date refs
const mockEducationExperiences: EducationExperience[] = [
  {
    id: 'high-school-1',
    institution_name: 'Test High School',
    institution_country: 'US',
    level: 'high_school',
    start_date: new Date('2015-09-01'),
    end_date: new Date('2019-06-15'),
    is_remote: false,
  },
  {
    id: 'bachelor-1',
    institution_name: 'Test University',
    institution_country: 'US',
    level: 'bachelor',
    start_date: new Date('2015-09-01'),
    end_date: new Date('2019-06-01'), // This will be the bachelor graduation date for refs
    is_remote: false,
  },
  {
    id: 'master-1',
    institution_name: 'Test Graduate School',
    institution_country: 'US',
    level: 'master',
    start_date: new Date('2019-09-01'),
    end_date: new Date('2021-05-15'), // This will be the master graduation date for refs
    is_remote: false,
  },
  {
    id: 'doctorate-1',
    institution_name: 'Test Research University',
    institution_country: 'US',
    level: 'doctorate',
    start_date: new Date('2021-09-01'),
    end_date: new Date('2025-05-20'), // This will be the doctorate graduation date for refs
    is_remote: false,
  },
  // Additional education experiences for edge case testing
  {
    id: 'associate-1',
    institution_name: 'Community College',
    institution_country: 'US',
    level: 'associate',
    start_date: new Date('2017-09-01'),
    end_date: new Date('2019-05-20'),
    is_remote: false,
  },
  {
    id: 'ongoing-education',
    institution_name: 'Current University',
    institution_country: 'US',
    level: 'doctorate',
    start_date: new Date('2023-09-01'),
    end_date: undefined, // Ongoing education
    is_remote: true,
  },
]

const mockWorkExperience: WorkExperience = {
  id: 'test-id',
  employment_type: 'full_time',
  employer_country: 'US',
  start_date: new Date('2020-01-01'),
  end_date: new Date('2022-01-01'),
  fixed_annual_salary: { amount: 80000, currency: 'USD' },
  fixed_monthly_salary: { amount: 6667, currency: 'USD' },
  employer_name: 'Test Company',
  job_title: 'Software Engineer',
  is_remote: false,
}

describe('work-experiences', () => {
  describe('getWorkExperiencesStateOutput - contains operation', () => {
    it('should handle employment type filter with matching value', () => {
      const state: WorkExperiencesState = {
        kind: 'work_experiences',
        op: 'contains',
        expected: {
          employment_type_in: ['full_time', 'part_time'],
        },
      }

      const input: WorkExperiencesStateInput = {
        work_experiences: [mockWorkExperience],
      }

      const result = getWorkExperiencesStateOutput(mockContext, state, input)

      assert.equal(result.kind, 'work_experiences')
      assert.equal(result.op, 'contains')

      if (result.op === 'contains') {
        assert.equal(result.children.length, 1)
        assert.deepStrictEqual(result.children[0].filters.employment_type_in, {
          expected: ['full_time', 'part_time'],
          actual: 'full_time',
          similarity: 1,
        })
      }
    })

    it('should handle employment type filter with non-matching value', () => {
      const state: WorkExperiencesState = {
        kind: 'work_experiences',
        op: 'contains',
        expected: {
          employment_type_in: ['self_employed', 'other'],
        },
      }

      const input: WorkExperiencesStateInput = {
        work_experiences: [mockWorkExperience],
      }

      const result = getWorkExperiencesStateOutput(mockContext, state, input)

      if (result.op === 'contains') {
        assert.deepStrictEqual(result.children[0].filters.employment_type_in, {
          expected: ['self_employed', 'other'],
          actual: 'full_time',
          similarity: 0,
        })
      }
    })

    it('should handle employment type filter with undefined value', () => {
      const state: WorkExperiencesState = {
        kind: 'work_experiences',
        op: 'contains',
        expected: {
          employment_type_in: ['full_time'],
        },
      }

      const workExperienceWithoutEmploymentType = {
        ...mockWorkExperience,
        employment_type: undefined,
      }

      const input: WorkExperiencesStateInput = {
        work_experiences: [workExperienceWithoutEmploymentType],
      }

      const result = getWorkExperiencesStateOutput(mockContext, state, input)

      if (result.op === 'contains') {
        assert.deepStrictEqual(result.children[0].filters.employment_type_in, {
          expected: ['full_time'],
          similarity: DEFAULT_WORK_EXPERIENCES_SIMILARITY,
        })
      }
    })

    it('should handle employer country filter with matching value', () => {
      const state: WorkExperiencesState = {
        kind: 'work_experiences',
        op: 'contains',
        expected: {
          employer_country_in: ['US', 'CA'],
        },
      }

      const input: WorkExperiencesStateInput = {
        work_experiences: [mockWorkExperience],
      }

      const result = getWorkExperiencesStateOutput(mockContext, state, input)

      if (result.op === 'contains') {
        assert.deepStrictEqual(result.children[0].filters.employer_country_in, {
          expected: ['US', 'CA'],
          actual: 'US',
          similarity: 1,
        })
      }
    })

    it('should handle employer country filter with non-matching value', () => {
      const state: WorkExperiencesState = {
        kind: 'work_experiences',
        op: 'contains',
        expected: {
          employer_country_in: ['GB', 'FR'],
        },
      }

      const input: WorkExperiencesStateInput = {
        work_experiences: [mockWorkExperience],
      }

      const result = getWorkExperiencesStateOutput(mockContext, state, input)

      if (result.op === 'contains') {
        assert.deepStrictEqual(result.children[0].filters.employer_country_in, {
          expected: ['GB', 'FR'],
          actual: 'US',
          similarity: 0,
        })
      }
    })

    it('should handle employer country filter with undefined value', () => {
      const state: WorkExperiencesState = {
        kind: 'work_experiences',
        op: 'contains',
        expected: {
          employer_country_in: ['US'],
        },
      }

      const workExperienceWithoutCountry = {
        ...mockWorkExperience,
        employer_country: undefined,
      }

      const input: WorkExperiencesStateInput = {
        work_experiences: [workExperienceWithoutCountry],
      }

      const result = getWorkExperiencesStateOutput(mockContext, state, input)

      if (result.op === 'contains') {
        assert.deepStrictEqual(result.children[0].filters.employer_country_in, {
          expected: ['US'],
          similarity: DEFAULT_WORK_EXPERIENCES_SIMILARITY,
        })
      }
    })

    it('should handle minimum duration filter with sufficient duration', () => {
      const state: WorkExperiencesState = {
        kind: 'work_experiences',
        op: 'contains',
        expected: {
          min_duration: {
            value: 12,
            unit: 'month',
          },
        },
      }

      const input: WorkExperiencesStateInput = {
        work_experiences: [mockWorkExperience], // 24 months duration
      }

      const result = getWorkExperiencesStateOutput(mockContext, state, input)

      if (result.op === 'contains') {
        assert.deepStrictEqual(
          result.children[0].filters.min_duration?.expected,
          {
            value: 12,
            unit: 'month',
          },
        )
        assert.deepStrictEqual(
          result.children[0].filters.min_duration?.actual,
          {
            value: 24,
            unit: 'month',
          },
        )
        assert.equal(result.children[0].filters.min_duration?.similarity, 1)
      }
    })

    it('should handle minimum duration filter with insufficient duration', () => {
      const state: WorkExperiencesState = {
        kind: 'work_experiences',
        op: 'contains',
        expected: {
          min_duration: {
            value: 36,
            unit: 'month',
          },
        },
      }

      const input: WorkExperiencesStateInput = {
        work_experiences: [mockWorkExperience], // 24 months duration
      }

      const result = getWorkExperiencesStateOutput(mockContext, state, input)

      if (result.op === 'contains') {
        assert.deepStrictEqual(
          result.children[0].filters.min_duration?.expected,
          {
            value: 36,
            unit: 'month',
          },
        )
        assert.deepStrictEqual(
          result.children[0].filters.min_duration?.actual,
          {
            value: 24,
            unit: 'month',
          },
        )
        assert
          .deepStrictEqual(result.children[0].filters.min_duration?.similarity)
          .toBeCloseTo(0.667, 2)
      }
    })

    it('should handle minimum duration filter with missing dates', () => {
      const state: WorkExperiencesState = {
        kind: 'work_experiences',
        op: 'contains',
        expected: {
          min_duration: {
            value: 12,
            unit: 'month',
          },
        },
      }

      const workExperienceWithoutDates = {
        ...mockWorkExperience,
        start_date: undefined,
        end_date: undefined,
      }

      const input: WorkExperiencesStateInput = {
        work_experiences: [workExperienceWithoutDates],
      }

      const result = getWorkExperiencesStateOutput(mockContext, state, input)

      if (result.op === 'contains') {
        assert.deepStrictEqual(result.children[0].filters.min_duration, {
          expected: {
            value: 12,
            unit: 'month',
          },
          similarity: DEFAULT_WORK_EXPERIENCES_SIMILARITY,
        })
      }
    })

    it('should handle minimum annual salary filter with sufficient salary', () => {
      const state: WorkExperiencesState = {
        kind: 'work_experiences',
        op: 'contains',
        expected: {
          min_annual_salary: { amount: 70000, currency: 'USD' },
        },
      }

      const input: WorkExperiencesStateInput = {
        work_experiences: [mockWorkExperience], // 80000 USD
      }

      const result = getWorkExperiencesStateOutput(mockContext, state, input)

      if (result.op === 'contains') {
        assert.deepStrictEqual(
          result.children[0].filters.min_annual_salary?.expected,
          {
            amount: 70000,
            currency: 'USD',
          },
        )
        assert.deepStrictEqual(
          result.children[0].filters.min_annual_salary?.actual,
          {
            amount: 80000,
            currency: 'USD',
          },
        )
        assert
          .deepStrictEqual(
            result.children[0].filters.min_annual_salary?.similarity,
          )
          .toBe(1)
      }
    })

    it('should handle minimum annual salary filter with insufficient salary', () => {
      const state: WorkExperiencesState = {
        kind: 'work_experiences',
        op: 'contains',
        expected: {
          min_annual_salary: { amount: 100000, currency: 'USD' },
        },
      }

      const input: WorkExperiencesStateInput = {
        work_experiences: [mockWorkExperience], // 80000 USD
      }

      const result = getWorkExperiencesStateOutput(mockContext, state, input)

      if (result.op === 'contains') {
        assert
          .deepStrictEqual(
            result.children[0].filters.min_annual_salary?.similarity,
          )
          .toBe(0.8)
      }
    })

    it('should handle minimum annual salary filter with missing salary', () => {
      const state: WorkExperiencesState = {
        kind: 'work_experiences',
        op: 'contains',
        expected: {
          min_annual_salary: { amount: 70000, currency: 'USD' },
        },
      }

      const workExperienceWithoutSalary = {
        ...mockWorkExperience,
        fixed_monthly_salary: undefined,
        fixed_annual_salary: undefined,
      }

      const input: WorkExperiencesStateInput = {
        work_experiences: [workExperienceWithoutSalary],
      }

      const result = getWorkExperiencesStateOutput(mockContext, state, input)

      if (result.op === 'contains') {
        assert.deepStrictEqual(result.children[0].filters.min_annual_salary, {
          expected: { amount: 70000, currency: 'USD' },
          similarity: DEFAULT_WORK_EXPERIENCES_SIMILARITY,
        })
      }
    })

    it('should handle minimum monthly salary filter with sufficient salary', () => {
      const state: WorkExperiencesState = {
        kind: 'work_experiences',
        op: 'contains',
        expected: {
          min_monthly_salary: { amount: 5000, currency: 'USD' },
        },
      }

      const input: WorkExperiencesStateInput = {
        work_experiences: [mockWorkExperience], // 6667 USD
      }

      const result = getWorkExperiencesStateOutput(mockContext, state, input)

      if (result.op === 'contains') {
        assert
          .deepStrictEqual(
            result.children[0].filters.min_monthly_salary?.similarity,
          )
          .toBe(1)
      }
    })

    it('should handle minimum monthly salary filter with missing salary', () => {
      const state: WorkExperiencesState = {
        kind: 'work_experiences',
        op: 'contains',
        expected: {
          min_monthly_salary: { amount: 5000, currency: 'USD' },
        },
      }

      const workExperienceWithoutSalary = {
        ...mockWorkExperience,
        fixed_monthly_salary: undefined,
        fixed_annual_salary: undefined,
      }

      const input: WorkExperiencesStateInput = {
        work_experiences: [workExperienceWithoutSalary],
      }

      const result = getWorkExperiencesStateOutput(mockContext, state, input)

      if (result.op === 'contains') {
        assert.deepStrictEqual(result.children[0].filters.min_monthly_salary, {
          expected: { amount: 5000, currency: 'USD' },
          similarity: DEFAULT_WORK_EXPERIENCES_SIMILARITY,
        })
      }
    })

    it('should handle multiple filters and calculate average similarity', () => {
      const state: WorkExperiencesState = {
        kind: 'work_experiences',
        op: 'contains',
        expected: {
          employment_type_in: ['full_time'],
          employer_country_in: ['US'],
          min_duration: {
            value: 12,
            unit: 'month',
          },
        },
      }

      const input: WorkExperiencesStateInput = {
        work_experiences: [mockWorkExperience],
      }

      const result = getWorkExperiencesStateOutput(mockContext, state, input)

      if (result.op === 'contains') {
        assert
          .deepStrictEqual(
            result.children[0].filters.employment_type_in?.similarity,
          )
          .toBe(1)
        assert
          .deepStrictEqual(
            result.children[0].filters.employer_country_in?.similarity,
          )
          .toBe(1)
        assert
          .deepStrictEqual(result.children[0].filters.min_duration?.similarity)
          .toBe(1)
        assert.deepStrictEqual(result.children[0].similarity).toBe(1) // average of all 1s
        assert.deepStrictEqual(result.similarity).toBe(1) // average of children similarities
      }
    })

    it('should handle multiple work experiences', () => {
      const state: WorkExperiencesState = {
        kind: 'work_experiences',
        op: 'contains',
        expected: {
          employment_type_in: ['full_time'],
        },
      }

      const secondWorkExperience = {
        ...mockWorkExperience,
        id: 'test-id-2',
        employment_type: 'part_time' as EmploymentType,
      }

      const input: WorkExperiencesStateInput = {
        work_experiences: [mockWorkExperience, secondWorkExperience],
      }

      const result = getWorkExperiencesStateOutput(mockContext, state, input)

      if (result.op === 'contains') {
        assert.deepStrictEqual(result.children).toHaveLength(2)
        assert
          .deepStrictEqual(
            result.children[0].filters.employment_type_in?.similarity,
          )
          .toBe(1)
        assert
          .deepStrictEqual(
            result.children[1].filters.employment_type_in?.similarity,
          )
          .toBe(0)
        assert.deepStrictEqual(result.similarity).toBe(0.5) // average of 1 and 0
      }
    })
  })

  describe('getWorkExperiencesStateOutput - contains operation with count', () => {
    const matchingWorkExperience1: WorkExperience = {
      id: 'matching-1',
      employment_type: 'full_time',
      employer_country: 'US',
      start_date: new Date('2020-01-01'),
      end_date: new Date('2022-01-01'),
      fixed_annual_salary: { amount: 80000, currency: 'USD' },
      fixed_monthly_salary: { amount: 6667, currency: 'USD' },
      employer_name: 'Test Company 1',
      job_title: 'Software Engineer',
      is_remote: false,
    }

    const matchingWorkExperience2: WorkExperience = {
      id: 'matching-2',
      employment_type: 'full_time',
      employer_country: 'US',
      start_date: new Date('2019-01-01'),
      end_date: new Date('2021-01-01'),
      fixed_annual_salary: { amount: 75000, currency: 'USD' },
      fixed_monthly_salary: { amount: 6250, currency: 'USD' },
      employer_name: 'Test Company 2',
      job_title: 'Developer',
      is_remote: false,
    }

    const nonMatchingWorkExperience: WorkExperience = {
      id: 'non-matching',
      employment_type: 'part_time',
      employer_country: 'CA',
      start_date: new Date('2020-01-01'),
      end_date: new Date('2020-06-01'),
      fixed_annual_salary: { amount: 30000, currency: 'USD' },
      fixed_monthly_salary: { amount: 2500, currency: 'USD' },
      employer_name: 'Different Company',
      job_title: 'Intern',
      is_remote: true,
    }

    it('should handle count with min constraint - satisfied', () => {
      const state: WorkExperiencesState = {
        kind: 'work_experiences',
        op: 'contains',
        expected: {
          employment_type_in: ['full_time'],
          employer_country_in: ['US'],
        },
        count: {
          min: 2,
        },
      }

      const input: WorkExperiencesStateInput = {
        work_experiences: [
          matchingWorkExperience1,
          matchingWorkExperience2,
          nonMatchingWorkExperience,
        ],
      }

      const result = getWorkExperiencesStateOutput(mockContext, state, input)

      if (result.op === 'contains') {
        assert.deepStrictEqual(result.children).toHaveLength(3)
        assert.deepStrictEqual(result.count, { min: 2, actual: 2 })
        assert.deepStrictEqual(result.similarity).toBe(1) // Boolean: count satisfied

        // Verify that 2 children have similarity >= 1
        const matchingChildren = result.children.filter(
          child => child.similarity >= 1,
        )
        assert.deepStrictEqual(matchingChildren).toHaveLength(2)
      }
    })

    it('should handle count with min constraint - not satisfied', () => {
      const state: WorkExperiencesState = {
        kind: 'work_experiences',
        op: 'contains',
        expected: {
          employment_type_in: ['full_time'],
          employer_country_in: ['US'],
        },
        count: {
          min: 3,
        },
      }

      const input: WorkExperiencesStateInput = {
        work_experiences: [
          matchingWorkExperience1,
          matchingWorkExperience2,
          nonMatchingWorkExperience,
        ],
      }

      const result = getWorkExperiencesStateOutput(mockContext, state, input)

      if (result.op === 'contains') {
        assert.deepStrictEqual(result.children).toHaveLength(3)
        assert.deepStrictEqual(result.count, { min: 3, actual: 2 })
        assert.deepStrictEqual(result.similarity).toBe(0) // Boolean: count not satisfied

        // Verify that only 2 children have similarity >= 1 (less than required 3)
        const matchingChildren = result.children.filter(
          child => child.similarity >= 1,
        )
        assert.deepStrictEqual(matchingChildren).toHaveLength(2)
      }
    })

    it('should handle count with max constraint - satisfied', () => {
      const state: WorkExperiencesState = {
        kind: 'work_experiences',
        op: 'contains',
        expected: {
          employment_type_in: ['full_time'],
          employer_country_in: ['US'],
        },
        count: {
          max: 3,
        },
      }

      const input: WorkExperiencesStateInput = {
        work_experiences: [
          matchingWorkExperience1,
          matchingWorkExperience2,
          nonMatchingWorkExperience,
        ],
      }

      const result = getWorkExperiencesStateOutput(mockContext, state, input)

      if (result.op === 'contains') {
        assert.deepStrictEqual(result.children).toHaveLength(3)
        assert.deepStrictEqual(result.count, { max: 3, actual: 2 })
        assert.deepStrictEqual(result.similarity).toBe(1) // Boolean: count satisfied

        // Verify that 2 children have similarity >= 1 (less than max 3)
        const matchingChildren = result.children.filter(
          child => child.similarity >= 1,
        )
        assert.deepStrictEqual(matchingChildren).toHaveLength(2)
      }
    })

    it('should handle count with max constraint - not satisfied', () => {
      const state: WorkExperiencesState = {
        kind: 'work_experiences',
        op: 'contains',
        expected: {
          employment_type_in: ['full_time'],
          employer_country_in: ['US'],
        },
        count: {
          max: 1,
        },
      }

      const input: WorkExperiencesStateInput = {
        work_experiences: [
          matchingWorkExperience1,
          matchingWorkExperience2,
          nonMatchingWorkExperience,
        ],
      }

      const result = getWorkExperiencesStateOutput(mockContext, state, input)

      if (result.op === 'contains') {
        assert.deepStrictEqual(result.children).toHaveLength(3)
        assert.deepStrictEqual(result.count, { max: 1, actual: 2 })
        assert.deepStrictEqual(result.similarity).toBe(0) // Boolean: count not satisfied

        // Verify that 2 children have similarity >= 1 (more than max 1)
        const matchingChildren = result.children.filter(
          child => child.similarity >= 1,
        )
        assert.deepStrictEqual(matchingChildren).toHaveLength(2)
      }
    })

    it('should handle count with both min and max constraints - satisfied', () => {
      const state: WorkExperiencesState = {
        kind: 'work_experiences',
        op: 'contains',
        expected: {
          employment_type_in: ['full_time'],
          employer_country_in: ['US'],
        },
        count: {
          min: 1,
          max: 3,
        },
      }

      const input: WorkExperiencesStateInput = {
        work_experiences: [
          matchingWorkExperience1,
          matchingWorkExperience2,
          nonMatchingWorkExperience,
        ],
      }

      const result = getWorkExperiencesStateOutput(mockContext, state, input)

      if (result.op === 'contains') {
        assert.deepStrictEqual(result.children).toHaveLength(3)
        assert.deepStrictEqual(result.count, { min: 1, max: 3, actual: 2 })
        assert.deepStrictEqual(result.similarity).toBe(1) // Boolean: count satisfied

        // Verify that 2 children have similarity >= 1 (within range 1-3)
        const matchingChildren = result.children.filter(
          child => child.similarity >= 1,
        )
        assert.deepStrictEqual(matchingChildren).toHaveLength(2)
      }
    })

    it('should handle count with both min and max constraints - not satisfied (below min)', () => {
      const state: WorkExperiencesState = {
        kind: 'work_experiences',
        op: 'contains',
        expected: {
          employment_type_in: ['full_time'],
          employer_country_in: ['US'],
        },
        count: {
          min: 3,
          max: 5,
        },
      }

      const input: WorkExperiencesStateInput = {
        work_experiences: [
          matchingWorkExperience1,
          matchingWorkExperience2,
          nonMatchingWorkExperience,
        ],
      }

      const result = getWorkExperiencesStateOutput(mockContext, state, input)

      if (result.op === 'contains') {
        assert.deepStrictEqual(result.children).toHaveLength(3)
        assert.deepStrictEqual(result.count, { min: 3, max: 5, actual: 2 })
        assert.deepStrictEqual(result.similarity).toBe(0) // Boolean: count not satisfied

        // Verify that 2 children have similarity >= 1 (below min 3)
        const matchingChildren = result.children.filter(
          child => child.similarity >= 1,
        )
        assert.deepStrictEqual(matchingChildren).toHaveLength(2)
      }
    })

    it('should handle count with both min and max constraints - not satisfied (above max)', () => {
      const state: WorkExperiencesState = {
        kind: 'work_experiences',
        op: 'contains',
        expected: {
          employment_type_in: ['full_time'],
          employer_country_in: ['US'],
        },
        count: {
          min: 1,
          max: 1,
        },
      }

      const input: WorkExperiencesStateInput = {
        work_experiences: [
          matchingWorkExperience1,
          matchingWorkExperience2,
          nonMatchingWorkExperience,
        ],
      }

      const result = getWorkExperiencesStateOutput(mockContext, state, input)

      if (result.op === 'contains') {
        assert.deepStrictEqual(result.children).toHaveLength(3)
        assert.deepStrictEqual(result.count, { min: 1, max: 1, actual: 2 })
        assert.deepStrictEqual(result.similarity).toBe(0) // Boolean: count not satisfied

        // Verify that 2 children have similarity >= 1 (above max 1)
        const matchingChildren = result.children.filter(
          child => child.similarity >= 1,
        )
        assert.deepStrictEqual(matchingChildren).toHaveLength(2)
      }
    })

    it('should handle count with empty work experiences array', () => {
      const state: WorkExperiencesState = {
        kind: 'work_experiences',
        op: 'contains',
        expected: {
          employment_type_in: ['full_time'],
        },
        count: {
          min: 1,
        },
      }

      const input: WorkExperiencesStateInput = {
        work_experiences: [],
      }

      const result = getWorkExperiencesStateOutput(mockContext, state, input)

      if (result.op === 'contains') {
        assert.deepStrictEqual(result.children).toHaveLength(0)
        assert.deepStrictEqual(result.count, {
          actual: 0,
          max: undefined,
          min: 1,
        })
        assert.deepStrictEqual(result.similarity).toBe(0)
      }
    })

    it('should handle count when no children match the filters', () => {
      const state: WorkExperiencesState = {
        kind: 'work_experiences',
        op: 'contains',
        expected: {
          employment_type_in: ['self_employed'], // None of our test experiences are self_employed
        },
        count: {
          min: 1,
        },
      }

      const input: WorkExperiencesStateInput = {
        work_experiences: [
          matchingWorkExperience1,
          matchingWorkExperience2,
          nonMatchingWorkExperience,
        ],
      }

      const result = getWorkExperiencesStateOutput(mockContext, state, input)

      if (result.op === 'contains') {
        assert.deepStrictEqual(result.children).toHaveLength(3)
        assert.deepStrictEqual(result.count, { min: 1, actual: 0 })
        assert.deepStrictEqual(result.similarity).toBe(0) // Boolean: count not satisfied (0 matches < 1)

        // Verify that no children have similarity >= 1
        const matchingChildren = result.children.filter(
          child => child.similarity >= 1,
        )
        assert.deepStrictEqual(matchingChildren).toHaveLength(0)
      }
    })

    it('should handle count with exact match on boundaries', () => {
      const state: WorkExperiencesState = {
        kind: 'work_experiences',
        op: 'contains',
        expected: {
          employment_type_in: ['full_time'],
          employer_country_in: ['US'],
        },
        count: {
          min: 2,
          max: 2,
        },
      }

      const input: WorkExperiencesStateInput = {
        work_experiences: [
          matchingWorkExperience1,
          matchingWorkExperience2,
          nonMatchingWorkExperience,
        ],
      }

      const result = getWorkExperiencesStateOutput(mockContext, state, input)

      if (result.op === 'contains') {
        assert.deepStrictEqual(result.children).toHaveLength(3)
        assert.deepStrictEqual(result.count, { min: 2, max: 2, actual: 2 })
        assert.deepStrictEqual(result.similarity).toBe(1) // Boolean: count satisfied (exactly 2 matches)

        // Verify that exactly 2 children have similarity >= 1
        const matchingChildren = result.children.filter(
          child => child.similarity >= 1,
        )
        assert.deepStrictEqual(matchingChildren).toHaveLength(2)
      }
    })

    it('should not include count in output when count is not specified in input', () => {
      const state: WorkExperiencesState = {
        kind: 'work_experiences',
        op: 'contains',
        expected: {
          employment_type_in: ['full_time'],
        },
        // No count specified
      }

      const input: WorkExperiencesStateInput = {
        work_experiences: [matchingWorkExperience1, nonMatchingWorkExperience],
      }

      const result = getWorkExperiencesStateOutput(mockContext, state, input)

      if (result.op === 'contains') {
        assert.deepStrictEqual(result.count).toBeUndefined()
        assert.deepStrictEqual(result.similarity).toBe(0.5) // Average similarity, not boolean
      }
    })
  })

  describe('getWorkExperiencesStateOutput - matches operation', () => {
    it('should handle minimum sum of monthly salary filter with sufficient salary', () => {
      const state: WorkExperiencesState = {
        kind: 'work_experiences',
        op: 'matches',
        expected: {
          aggregation: {
            min_sum_of_monthly_salary: {
              amount: 5000,
              currency: 'USD',
            },
          },
        },
      }

      const input: WorkExperiencesStateInput = {
        work_experiences: [mockWorkExperience], // 6667 USD monthly
      }

      const result = getWorkExperiencesStateOutput(mockContext, state, input)

      assert.deepStrictEqual(result.kind).toBe('work_experiences')
      assert.deepStrictEqual(result.op).toBe('matches')

      if (result.op === 'matches') {
        assert.deepStrictEqual(result.children).toHaveLength(1)
        assert.deepStrictEqual(result.children[0].similarity).toBe(1) // No filters applied, so similarity is 1
        assert.deepStrictEqual(
          result.aggregation.min_sum_of_monthly_salary?.expected,
          {
            amount: 5000,
            currency: 'USD',
          },
        )
        assert.deepStrictEqual(
          result.aggregation.min_sum_of_monthly_salary?.actual,
          {
            amount: 6667,
            currency: 'USD',
          },
        )
        assert
          .deepStrictEqual(
            result.aggregation.min_sum_of_monthly_salary?.similarity,
          )
          .toBe(1)
        assert.deepStrictEqual(result.similarity).toBe(1)
      }
    })

    it('should handle minimum sum of monthly salary filter with missing salary', () => {
      const state: WorkExperiencesState = {
        kind: 'work_experiences',
        op: 'matches',
        expected: {
          aggregation: {
            min_sum_of_monthly_salary: {
              amount: 5000,
              currency: 'USD',
            },
          },
        },
      }

      const workExperienceWithoutSalary = {
        ...mockWorkExperience,
        fixed_monthly_salary: undefined,
        fixed_annual_salary: undefined,
      }

      const input: WorkExperiencesStateInput = {
        work_experiences: [workExperienceWithoutSalary],
      }

      const result = getWorkExperiencesStateOutput(mockContext, state, input)

      if (result.op === 'matches') {
        assert.deepStrictEqual(result.aggregation.min_sum_of_monthly_salary, {
          expected: {
            amount: 5000,
            currency: 'USD',
          },
          actual: {
            amount: 0,
            currency: 'USD',
          },
          similarity: 0,
        })
      }
    })

    it('should handle empty work experiences array', () => {
      const state: WorkExperiencesState = {
        kind: 'work_experiences',
        op: 'matches',
        expected: {
          aggregation: {
            min_sum_of_monthly_salary: {
              amount: 5000,
              currency: 'USD',
            },
          },
        },
      }

      const input: WorkExperiencesStateInput = {
        work_experiences: [],
      }

      const result = getWorkExperiencesStateOutput(mockContext, state, input)

      assert
        .deepStrictEqual(result.similarity)
        .toBe(DEFAULT_WORK_EXPERIENCES_SIMILARITY)
    })

    it('should handle state without any expected aggregation', () => {
      const state: WorkExperiencesState = {
        kind: 'work_experiences',
        op: 'matches',
        expected: {},
      }

      const input: WorkExperiencesStateInput = {
        work_experiences: [mockWorkExperience],
      }

      assert
        .deepStrictEqual(() =>
          getWorkExperiencesStateOutput(mockContext, state, input),
        )
        .toThrow('must specify at least one aggregation')
    })

    it('should handle multiple work experiences and sum their salaries', () => {
      const state: WorkExperiencesState = {
        kind: 'work_experiences',
        op: 'matches',
        expected: {
          aggregation: {
            min_sum_of_monthly_salary: {
              amount: 10000,
              currency: 'USD',
            },
          },
        },
      }

      const secondWorkExperience: WorkExperience = {
        ...mockWorkExperience,
        id: 'test-id-2',
        fixed_monthly_salary: { amount: 4000, currency: 'USD' },
      }

      const input: WorkExperiencesStateInput = {
        work_experiences: [mockWorkExperience, secondWorkExperience], // 6667 + 4000 = 10667 USD
      }

      const result = getWorkExperiencesStateOutput(mockContext, state, input)

      if (result.op === 'matches') {
        assert.deepStrictEqual(result.children).toHaveLength(2)
        assert.deepStrictEqual(
          result.aggregation.min_sum_of_monthly_salary?.expected,
          {
            amount: 10000,
            currency: 'USD',
          },
        )
        assert.deepStrictEqual(
          result.aggregation.min_sum_of_monthly_salary?.actual,
          {
            amount: 10667,
            currency: 'USD',
          },
        )
        assert
          .deepStrictEqual(
            result.aggregation.min_sum_of_monthly_salary?.similarity,
          )
          .toBe(1)
        assert.deepStrictEqual(result.similarity).toBe(1)
      }
    })

    it('should handle duration filtering for sum of monthly salaries', () => {
      const state: WorkExperiencesState = {
        kind: 'work_experiences',
        op: 'matches',
        expected: {
          aggregation: {
            min_sum_of_monthly_salary: {
              duration: {
                value: 12,
                unit: 'month',
              },
              amount: 5000,
              currency: 'USD',
            },
          },
        },
      }

      // Create an old work experience that should be filtered out
      const oldWorkExperience: WorkExperience = {
        ...mockWorkExperience,
        id: 'old-work',
        start_date: new Date('2020-01-01'),
        fixed_monthly_salary: { amount: 10000, currency: 'USD' },
      }

      // Create a recent work experience that should be included
      const recentWorkExperience: WorkExperience = {
        ...mockWorkExperience,
        id: 'recent-work',
        start_date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
        fixed_monthly_salary: { amount: 6000, currency: 'USD' },
      }

      const input: WorkExperiencesStateInput = {
        work_experiences: [oldWorkExperience, recentWorkExperience],
      }

      const result = getWorkExperiencesStateOutput(mockContext, state, input)

      if (result.op === 'matches') {
        assert.deepStrictEqual(
          result.aggregation.min_sum_of_monthly_salary?.expected,
          {
            duration: {
              value: 12,
              unit: 'month',
            },
            amount: 5000,
            currency: 'USD',
          },
        )
        assert.deepStrictEqual(
          result.aggregation.min_sum_of_monthly_salary?.actual,
          {
            duration: {
              value: 12,
              unit: 'month',
            },
            amount: 6000, // Only the recent work experience
            currency: 'USD',
          },
        )
        assert
          .deepStrictEqual(
            result.aggregation.min_sum_of_monthly_salary?.similarity,
          )
          .toBe(1)
        assert.deepStrictEqual(result.similarity).toBe(1)
      }
    })
  })

  describe('getWorkExperiencesStateOutput - matches operation - min_sum_of_duration', () => {
    it('should calculate sum of duration for single experience', () => {
      const state: WorkExperiencesState = {
        kind: 'work_experiences',
        op: 'matches',
        expected: {
          aggregation: {
            min_sum_of_duration: { value: 2, unit: 'year' },
          },
        },
      }
      const input: WorkExperiencesStateInput = {
        work_experiences: [
          {
            id: 'exp1',
            start_date: new Date('2020-01-01'),
            end_date: new Date('2022-01-01'),
          },
        ],
      }
      const result = getWorkExperiencesStateOutput(mockContext, state, input)
      if (result.op === 'matches') {
        assert
          .deepStrictEqual(
            result.aggregation.min_sum_of_duration?.actual?.value,
          )
          .toBeCloseTo(2)
        assert
          .deepStrictEqual(result.aggregation.min_sum_of_duration?.similarity)
          .toBe(1)
      }
    })

    it('should sum durations of multiple non-overlapping experiences', () => {
      const state: WorkExperiencesState = {
        kind: 'work_experiences',
        op: 'matches',
        expected: {
          aggregation: {
            min_sum_of_duration: { value: 3, unit: 'year' },
          },
        },
      }
      const input: WorkExperiencesStateInput = {
        work_experiences: [
          {
            id: 'exp1',
            start_date: new Date('2018-01-01'),
            end_date: new Date('2019-01-01'),
          }, // 1 year
          {
            id: 'exp2',
            start_date: new Date('2020-01-01'),
            end_date: new Date('2022-01-01'),
          }, // 2 years
        ],
      }
      const result = getWorkExperiencesStateOutput(mockContext, state, input)
      if (result.op === 'matches') {
        assert
          .deepStrictEqual(
            result.aggregation.min_sum_of_duration?.actual?.value,
          )
          .toBeCloseTo(3)
        assert
          .deepStrictEqual(result.aggregation.min_sum_of_duration?.similarity)
          .toBe(1)
      }
    })

    it('should merge overlapping durations and calculate sum', () => {
      const state: WorkExperiencesState = {
        kind: 'work_experiences',
        op: 'matches',
        expected: {
          aggregation: {
            min_sum_of_duration: { value: 3, unit: 'year' },
          },
        },
      }
      const input: WorkExperiencesStateInput = {
        work_experiences: [
          {
            id: 'exp1',
            start_date: new Date('2019-01-01'),
            end_date: new Date('2021-01-01'),
          }, // 2 years
          {
            id: 'exp2',
            start_date: new Date('2020-01-01'),
            end_date: new Date('2022-01-01'),
          }, // 2 years, but 1 year overlaps
        ],
      }
      const result = getWorkExperiencesStateOutput(mockContext, state, input)
      if (result.op === 'matches') {
        // Total duration is from 2019-01-01 to 2022-01-01 = 3 years
        assert
          .deepStrictEqual(
            result.aggregation.min_sum_of_duration?.actual?.value,
          )
          .toBeCloseTo(3)
        assert
          .deepStrictEqual(result.aggregation.min_sum_of_duration?.similarity)
          .toBe(1)
      }
    })

    it('should handle complex overlapping and non-overlapping experiences', () => {
      const state: WorkExperiencesState = {
        kind: 'work_experiences',
        op: 'matches',
        expected: {
          aggregation: {
            min_sum_of_duration: { value: 5, unit: 'year' },
          },
        },
      }
      const input: WorkExperiencesStateInput = {
        work_experiences: [
          {
            id: 'exp1',
            start_date: new Date('2015-01-01'),
            end_date: new Date('2017-01-01'),
          }, // 2 years
          {
            id: 'exp2',
            start_date: new Date('2016-01-01'),
            end_date: new Date('2018-01-01'),
          }, // Overlaps with exp1, extends to 2018. Total so far: 3 years (2015-2018)
          {
            id: 'exp3',
            start_date: new Date('2019-01-01'),
            end_date: new Date('2021-01-01'),
          }, // 2 years, non-overlapping. Total so far: 3 + 2 = 5 years
        ],
      }
      const result = getWorkExperiencesStateOutput(mockContext, state, input)
      if (result.op === 'matches') {
        assert
          .deepStrictEqual(
            result.aggregation.min_sum_of_duration?.actual?.value,
          )
          .toBeCloseTo(5)
        assert
          .deepStrictEqual(result.aggregation.min_sum_of_duration?.similarity)
          .toBe(1)
      }
    })

    it('should return similarity less than 1 if duration is insufficient', () => {
      const state: WorkExperiencesState = {
        kind: 'work_experiences',
        op: 'matches',
        expected: {
          aggregation: {
            min_sum_of_duration: { value: 4, unit: 'year' },
          },
        },
      }
      const input: WorkExperiencesStateInput = {
        work_experiences: [
          {
            id: 'exp1',
            start_date: new Date('2020-01-01'),
            end_date: new Date('2022-01-01'),
          },
        ], // 2 years
      }
      const result = getWorkExperiencesStateOutput(mockContext, state, input)
      if (result.op === 'matches') {
        assert
          .deepStrictEqual(
            result.aggregation.min_sum_of_duration?.actual?.value,
          )
          .toBeCloseTo(2)
        assert
          .deepStrictEqual(result.aggregation.min_sum_of_duration?.similarity)
          .toBe(0.5) // 2 / 4 = 0.5
      }
    })

    it('should handle empty work experiences array', () => {
      const state: WorkExperiencesState = {
        kind: 'work_experiences',
        op: 'matches',
        expected: {
          aggregation: {
            min_sum_of_duration: { value: 1, unit: 'year' },
          },
        },
      }
      const input: WorkExperiencesStateInput = {
        work_experiences: [],
      }
      const result = getWorkExperiencesStateOutput(mockContext, state, input)
      if (result.op === 'matches') {
        assert
          .deepStrictEqual(
            result.aggregation.min_sum_of_duration?.actual?.value,
          )
          .toBeUndefined()
        assert
          .deepStrictEqual(result.aggregation.min_sum_of_duration?.similarity)
          .toBe(DEFAULT_WORK_EXPERIENCES_SIMILARITY)
      }
    })

    it('should handle ongoing work experience (null end_date)', () => {
      const state: WorkExperiencesState = {
        kind: 'work_experiences',
        op: 'matches',
        expected: {
          aggregation: {
            min_sum_of_duration: { value: 2, unit: 'year' },
          },
        },
      }
      const twoYearsAgo = new Date()
      twoYearsAgo.setFullYear(twoYearsAgo.getFullYear() - 2)
      const input: WorkExperiencesStateInput = {
        work_experiences: [
          { id: 'exp1', start_date: twoYearsAgo, end_date: null },
        ],
      }
      const result = getWorkExperiencesStateOutput(mockContext, state, input)
      if (result.op === 'matches') {
        assert
          .deepStrictEqual(
            result.aggregation.min_sum_of_duration?.actual?.value,
          )
          .toBeCloseTo(2)
        assert
          .deepStrictEqual(result.aggregation.min_sum_of_duration?.similarity)
          .toBe(1)
      }
    })

    it('should only aggregate experiences that match filters', () => {
      const state: WorkExperiencesState = {
        kind: 'work_experiences',
        op: 'matches',
        expected: {
          filters: {
            employment_type_in: ['full_time'],
          },
          aggregation: {
            min_sum_of_duration: { value: 2, unit: 'year' },
          },
        },
      }

      const fullTimeExperience: WorkExperience = {
        id: 'full-time',
        employment_type: 'full_time',
        start_date: new Date('2020-01-01'),
        end_date: new Date('2022-01-01'), // 2 years
      }

      const partTimeExperience: WorkExperience = {
        id: 'part-time',
        employment_type: 'part_time',
        start_date: new Date('2019-01-01'),
        end_date: new Date('2023-01-01'), // 4 years
      }

      const input: WorkExperiencesStateInput = {
        work_experiences: [fullTimeExperience, partTimeExperience],
      }

      const result = getWorkExperiencesStateOutput(mockContext, state, input)
      if (result.op === 'matches') {
        // Only the full-time experience should be aggregated (2 years)
        assert
          .deepStrictEqual(
            result.aggregation.min_sum_of_duration?.actual?.value,
          )
          .toBeCloseTo(2)
        assert
          .deepStrictEqual(result.aggregation.min_sum_of_duration?.similarity)
          .toBe(1)
      }
    })
  })

  describe('edge cases', () => {
    it('should handle empty work experiences array for contains operation', () => {
      const state: WorkExperiencesState = {
        kind: 'work_experiences',
        op: 'contains',
        expected: {
          employment_type_in: ['full_time'],
        },
      }

      const input: WorkExperiencesStateInput = {
        work_experiences: [],
      }

      const result = getWorkExperiencesStateOutput(mockContext, state, input)

      if (result.op === 'contains') {
        assert.deepStrictEqual(result.children).toHaveLength(0)
        assert.deepStrictEqual(result.similarity).toBe(0)
      }
    })

    it('should handle work experience with all undefined values', () => {
      const state: WorkExperiencesState = {
        kind: 'work_experiences',
        op: 'contains',
        expected: {
          employment_type_in: ['full_time'],
          employer_country_in: ['US'],
          min_duration: {
            value: 12,
            unit: 'month',
          },
          min_annual_salary: { amount: 50000, currency: 'USD' },
          min_monthly_salary: { amount: 4000, currency: 'USD' },
        },
      }

      const emptyWorkExperience: WorkExperience = {
        id: 'empty-id',
        employment_type: undefined,
        employer_country: undefined,
        start_date: undefined,
        end_date: undefined,
        fixed_annual_salary: undefined,
        fixed_monthly_salary: undefined,
        employer_name: '',
        job_title: '',
        is_remote: undefined,
      }

      const input: WorkExperiencesStateInput = {
        work_experiences: [emptyWorkExperience],
      }

      const result = getWorkExperiencesStateOutput(mockContext, state, input)

      if (result.op === 'contains') {
        // All filters should have similarity DEFAULT_WORK_EXPERIENCES_SIMILARITY
        assert
          .deepStrictEqual(
            result.children[0].filters.employment_type_in?.similarity,
          )
          .toBe(DEFAULT_WORK_EXPERIENCES_SIMILARITY)
        assert
          .deepStrictEqual(
            result.children[0].filters.employer_country_in?.similarity,
          )
          .toBe(DEFAULT_WORK_EXPERIENCES_SIMILARITY)
        assert
          .deepStrictEqual(result.children[0].filters.min_duration?.similarity)
          .toBe(DEFAULT_WORK_EXPERIENCES_SIMILARITY)
        assert
          .deepStrictEqual(
            result.children[0].filters.min_annual_salary?.similarity,
          )
          .toBe(DEFAULT_WORK_EXPERIENCES_SIMILARITY)
        assert
          .deepStrictEqual(
            result.children[0].filters.min_monthly_salary?.similarity,
          )
          .toBe(DEFAULT_WORK_EXPERIENCES_SIMILARITY)
        assert
          .deepStrictEqual(result.children[0].similarity)
          .toBe(DEFAULT_WORK_EXPERIENCES_SIMILARITY)
      }
    })

    it('should handle currency conversion in salary comparison', () => {
      const state: WorkExperiencesState = {
        kind: 'work_experiences',
        op: 'contains',
        expected: {
          min_annual_salary: { amount: 66000, currency: 'EUR' }, // 80000 USD = 66000 EUR
        },
      }

      const input: WorkExperiencesStateInput = {
        work_experiences: [mockWorkExperience], // 80000 USD
      }

      const result = getWorkExperiencesStateOutput(mockContext, state, input)

      if (result.op === 'contains') {
        assert
          .deepStrictEqual(
            result.children[0].filters.min_annual_salary?.similarity,
          )
          .toBe(1)
      }
    })
  })

  describe('ref-based date filters', () => {
    it('should handle starts_before filter with valid ref', () => {
      const state: WorkExperiencesState = {
        kind: 'work_experiences',
        op: 'contains',
        expected: {
          starts_before: { $ref: 'graduation_date.bachelor' },
        },
      }

      const stateInput: WorkExperiencesStateInput = {
        education_experiences: mockEducationExperiences,
        work_experiences: [mockWorkExperience], // starts 2020-01-01
      }

      const result = getWorkExperiencesStateOutput(
        mockContext,
        state,
        stateInput,
      )

      if (result.op === 'contains') {
        assert
          .deepStrictEqual(result.children[0].filters.starts_before)
          .toBeDefined()
        assert.deepStrictEqual(
          result.children[0].filters.starts_before?.expected,
          new Date('2020-05-15').toISOString(),
        )
        assert.deepStrictEqual(
          result.children[0].filters.starts_before?.actual,
          new Date('2020-01-01').toISOString(),
        )
        assert
          .deepStrictEqual(result.children[0].filters.starts_before?.similarity)
          .toBe(1) // starts before most recent graduation
      }
    })

    it('should handle starts_after filter with valid ref', () => {
      const state: WorkExperiencesState = {
        kind: 'work_experiences',
        op: 'contains',
        expected: {
          starts_after: { $ref: 'graduation_date.bachelor' },
        },
      }

      const stateInput: WorkExperiencesStateInput = {
        education_experiences: mockEducationExperiences,
        work_experiences: [mockWorkExperience], // starts 2020-01-01
      }

      const result = getWorkExperiencesStateOutput(
        mockContext,
        state,
        stateInput,
      )

      if (result.op === 'contains') {
        assert
          .deepStrictEqual(result.children[0].filters.starts_after)
          .toBeDefined()
        assert.deepStrictEqual(
          result.children[0].filters.starts_after?.expected,
          new Date('2020-05-15').toISOString(),
        )
        assert.deepStrictEqual(
          result.children[0].filters.starts_after?.actual,
          new Date('2020-01-01').toISOString(),
        )
        assert
          .deepStrictEqual(result.children[0].filters.starts_after?.similarity)
          .toBe(0) // starts before most recent graduation
      }
    })

    it('should handle ends_before filter with valid ref', () => {
      const state: WorkExperiencesState = {
        kind: 'work_experiences',
        op: 'contains',
        expected: {
          ends_before: { $ref: 'graduation_date.master' },
        },
      }

      const stateInput: WorkExperiencesStateInput = {
        education_experiences: mockEducationExperiences,
        work_experiences: [mockWorkExperience], // ends 2022-01-01
      }

      const result = getWorkExperiencesStateOutput(
        mockContext,
        state,
        stateInput,
      )

      if (result.op === 'contains') {
        assert
          .deepStrictEqual(result.children[0].filters.ends_before)
          .toBeDefined()
        assert.deepStrictEqual(
          result.children[0].filters.ends_before?.expected,
          new Date('2021-05-15').toISOString(),
        )
        assert.deepStrictEqual(
          result.children[0].filters.ends_before?.actual,
          new Date('2022-01-01').toISOString(),
        )
        assert
          .deepStrictEqual(result.children[0].filters.ends_before?.similarity)
          .toBe(0) // ends after master graduation
      }
    })

    it('should handle ends_after filter with valid ref', () => {
      const state: WorkExperiencesState = {
        kind: 'work_experiences',
        op: 'contains',
        expected: {
          ends_after: { $ref: 'graduation_date.bachelor' },
        },
      }

      const stateInput: WorkExperiencesStateInput = {
        education_experiences: mockEducationExperiences,
        work_experiences: [mockWorkExperience], // ends 2022-01-01
      }

      const result = getWorkExperiencesStateOutput(
        mockContext,
        state,
        stateInput,
      )

      if (result.op === 'contains') {
        assert
          .deepStrictEqual(result.children[0].filters.ends_after)
          .toBeDefined()
        assert.deepStrictEqual(
          result.children[0].filters.ends_after?.expected,
          new Date('2020-05-15').toISOString(),
        )
        assert.deepStrictEqual(
          result.children[0].filters.ends_after?.actual,
          new Date('2022-01-01').toISOString(),
        )
        assert
          .deepStrictEqual(result.children[0].filters.ends_after?.similarity)
          .toBe(1) // ends after most recent graduation
      }
    })

    it('should handle ref that does exist in education experiences', () => {
      const state: WorkExperiencesState = {
        kind: 'work_experiences',
        op: 'contains',
        expected: {
          starts_before: { $ref: 'graduation_date.doctorate' }, // this exists in mockEducationExperiences
        },
      }

      const stateInput: WorkExperiencesStateInput = {
        education_experiences: mockEducationExperiences,
        work_experiences: [mockWorkExperience], // starts 2020-01-01
      }

      const result = getWorkExperiencesStateOutput(
        mockContext,
        state,
        stateInput,
      )

      if (result.op === 'contains') {
        assert
          .deepStrictEqual(result.children[0].filters.starts_before)
          .toBeDefined()
        assert.deepStrictEqual(
          result.children[0].filters.starts_before?.expected,
          new Date('2025-05-20').toISOString(),
        )
        assert.deepStrictEqual(
          result.children[0].filters.starts_before?.actual,
          new Date('2020-01-01').toISOString(),
        )
        assert
          .deepStrictEqual(result.children[0].filters.starts_before?.similarity)
          .toBe(1) // starts before doctorate graduation
      }
    })

    it('should handle multiple ref-based date filters', () => {
      const state: WorkExperiencesState = {
        kind: 'work_experiences',
        op: 'contains',
        expected: {
          starts_after: { $ref: 'graduation_date.bachelor' },
          ends_before: { $ref: 'graduation_date.master' },
        },
      }

      const stateInput: WorkExperiencesStateInput = {
        education_experiences: mockEducationExperiences,
        work_experiences: [mockWorkExperience], // starts 2020-01-01, ends 2022-01-01
      }

      const result = getWorkExperiencesStateOutput(
        mockContext,
        state,
        stateInput,
      )

      if (result.op === 'contains') {
        assert
          .deepStrictEqual(result.children[0].filters.starts_after?.similarity)
          .toBe(0) // starts before most recent bachelor graduation
        assert
          .deepStrictEqual(result.children[0].filters.ends_before?.similarity)
          .toBe(0) // ends after master graduation
        assert.deepStrictEqual(result.children[0].similarity).toBe(0) // average of 0 and 0
      }
    })

    it('should handle string date and ref date filters together', () => {
      const state: WorkExperiencesState = {
        kind: 'work_experiences',
        op: 'contains',
        expected: {
          starts_after: '2019-01-01', // string date
          ends_before: { $ref: 'graduation_date.master' }, // ref date
        },
      }

      const stateInput: WorkExperiencesStateInput = {
        education_experiences: mockEducationExperiences,
        work_experiences: [mockWorkExperience], // starts 2020-01-01, ends 2022-01-01
      }

      const result = getWorkExperiencesStateOutput(
        mockContext,
        state,
        stateInput,
      )

      if (result.op === 'contains') {
        assert.deepStrictEqual(
          result.children[0].filters.starts_after?.expected,
          new Date('2019-01-01').toISOString(),
        )
        assert
          .deepStrictEqual(result.children[0].filters.starts_after?.similarity)
          .toBe(1) // starts after 2019
        assert.deepStrictEqual(
          result.children[0].filters.ends_before?.expected,
          new Date('2021-05-15').toISOString(),
        )
        assert
          .deepStrictEqual(result.children[0].filters.ends_before?.similarity)
          .toBe(0) // ends after master graduation
        assert.deepStrictEqual(result.children[0].similarity).toBe(0.5) // average of 1 and 0
      }
    })

    it('should handle ref filters with work experience missing dates', () => {
      const state: WorkExperiencesState = {
        kind: 'work_experiences',
        op: 'contains',
        expected: {
          starts_after: { $ref: 'graduation_date.bachelor' },
          ends_before: { $ref: 'graduation_date.master' },
        },
      }

      const workExperienceWithoutDates = {
        ...mockWorkExperience,
        start_date: undefined,
        end_date: undefined,
      }

      const stateInput: WorkExperiencesStateInput = {
        education_experiences: mockEducationExperiences,
        work_experiences: [workExperienceWithoutDates],
      }

      const result = getWorkExperiencesStateOutput(
        mockContext,
        state,
        stateInput,
      )

      if (result.op === 'contains') {
        assert
          .deepStrictEqual(result.children[0].filters.starts_after?.similarity)
          .toBe(DEFAULT_WORK_EXPERIENCES_SIMILARITY) // undefined date
        assert
          .deepStrictEqual(result.children[0].filters.ends_before?.similarity)
          .toBe(DEFAULT_WORK_EXPERIENCES_SIMILARITY) // undefined date
        assert
          .deepStrictEqual(result.children[0].similarity)
          .toBe(DEFAULT_WORK_EXPERIENCES_SIMILARITY) // average of DEFAULT_WORK_EXPERIENCES_SIMILARITY and DEFAULT_WORK_EXPERIENCES_SIMILARITY
      }
    })

    it('should handle missing education experiences', () => {
      const state: WorkExperiencesState = {
        kind: 'work_experiences',
        op: 'contains',
        expected: {
          starts_after: { $ref: 'graduation_date.bachelor' },
        },
      }

      const stateInput: WorkExperiencesStateInput = {
        // No education experiences provided
        work_experiences: [mockWorkExperience],
      }

      const result = getWorkExperiencesStateOutput(
        mockContext,
        state,
        stateInput,
      )

      if (result.op === 'contains') {
        // Filter should not be added when ref cannot be resolved
        assert
          .deepStrictEqual(result.children[0].filters.starts_after)
          .toBeUndefined()
      }
    })

    it('should handle advanced ref with date calculations', () => {
      const state: WorkExperiencesState = {
        kind: 'work_experiences',
        op: 'contains',
        expected: {
          starts_after: { $ref: 'graduation_date.bachelor.add_years:1' }, // 1 year after bachelor graduation
        },
      }

      const stateInput: WorkExperiencesStateInput = {
        education_experiences: mockEducationExperiences,
        work_experiences: [mockWorkExperience], // starts 2020-01-01
      }

      const result = getWorkExperiencesStateOutput(
        mockContext,
        state,
        stateInput,
      )

      if (result.op === 'contains') {
        assert
          .deepStrictEqual(result.children[0].filters.starts_after)
          .toBeDefined()
        assert.deepStrictEqual(
          result.children[0].filters.starts_after?.expected,
          new Date('2021-05-15').toISOString(), // 1 year after 2020-05-15 (most recent bachelor)
        )
        assert.deepStrictEqual(
          result.children[0].filters.starts_after?.actual,
          new Date('2020-01-01').toISOString(),
        )
        assert
          .deepStrictEqual(result.children[0].filters.starts_after?.similarity)
          .toBe(0) // starts before the calculated date
      }
    })

    it('should handle bachelor_or_higher ref', () => {
      const state: WorkExperiencesState = {
        kind: 'work_experiences',
        op: 'contains',
        expected: {
          starts_after: { $ref: 'graduation_date.bachelor_or_higher' }, // Should return most recent (doctorate)
        },
      }

      const stateInput: WorkExperiencesStateInput = {
        education_experiences: mockEducationExperiences,
        work_experiences: [mockWorkExperience], // starts 2020-01-01
      }

      const result = getWorkExperiencesStateOutput(
        mockContext,
        state,
        stateInput,
      )

      if (result.op === 'contains') {
        assert
          .deepStrictEqual(result.children[0].filters.starts_after)
          .toBeDefined()
        assert.deepStrictEqual(
          result.children[0].filters.starts_after?.expected,
          new Date('2025-05-20').toISOString(), // Most recent graduation (doctorate)
        )
        assert.deepStrictEqual(
          result.children[0].filters.starts_after?.actual,
          new Date('2020-01-01').toISOString(),
        )
        assert
          .deepStrictEqual(result.children[0].filters.starts_after?.similarity)
          .toBe(0) // starts before the most recent graduation
      }
    })

    it('should handle master_or_higher ref', () => {
      const state: WorkExperiencesState = {
        kind: 'work_experiences',
        op: 'contains',
        expected: {
          ends_before: { $ref: 'graduation_date.master_or_higher' }, // Should return most recent (doctorate)
        },
      }

      const stateInput: WorkExperiencesStateInput = {
        education_experiences: mockEducationExperiences,
        work_experiences: [mockWorkExperience], // ends 2022-01-01
      }

      const result = getWorkExperiencesStateOutput(
        mockContext,
        state,
        stateInput,
      )

      if (result.op === 'contains') {
        assert
          .deepStrictEqual(result.children[0].filters.ends_before)
          .toBeDefined()
        assert.deepStrictEqual(
          result.children[0].filters.ends_before?.expected,
          new Date('2025-05-20').toISOString(), // Most recent graduation (doctorate)
        )
        assert.deepStrictEqual(
          result.children[0].filters.ends_before?.actual,
          new Date('2022-01-01').toISOString(),
        )
        assert
          .deepStrictEqual(result.children[0].filters.ends_before?.similarity)
          .toBe(1) // ends before doctorate graduation
      }
    })

    it('should handle high_school ref', () => {
      const state: WorkExperiencesState = {
        kind: 'work_experiences',
        op: 'contains',
        expected: {
          starts_after: { $ref: 'graduation_date.high_school' },
        },
      }

      const stateInput: WorkExperiencesStateInput = {
        education_experiences: mockEducationExperiences,
        work_experiences: [mockWorkExperience], // starts 2020-01-01
      }

      const result = getWorkExperiencesStateOutput(
        mockContext,
        state,
        stateInput,
      )

      if (result.op === 'contains') {
        assert
          .deepStrictEqual(result.children[0].filters.starts_after)
          .toBeDefined()
        assert.deepStrictEqual(
          result.children[0].filters.starts_after?.expected,
          new Date('2019-06-15').toISOString(), // High school graduation
        )
        assert.deepStrictEqual(
          result.children[0].filters.starts_after?.actual,
          new Date('2020-01-01').toISOString(),
        )
        assert
          .deepStrictEqual(result.children[0].filters.starts_after?.similarity)
          .toBe(1) // starts after high school graduation
      }
    })

    it('should handle ref with subtract years calculation', () => {
      const state: WorkExperiencesState = {
        kind: 'work_experiences',
        op: 'contains',
        expected: {
          starts_after: { $ref: 'graduation_date.master.subtract_years:1' }, // 1 year before master graduation
        },
      }

      const stateInput: WorkExperiencesStateInput = {
        education_experiences: mockEducationExperiences,
        work_experiences: [mockWorkExperience], // starts 2020-01-01
      }

      const result = getWorkExperiencesStateOutput(
        mockContext,
        state,
        stateInput,
      )

      if (result.op === 'contains') {
        assert
          .deepStrictEqual(result.children[0].filters.starts_after)
          .toBeDefined()
        assert.deepStrictEqual(
          result.children[0].filters.starts_after?.expected,
          new Date('2020-05-15').toISOString(), // 1 year before 2021-05-15
        )
        assert.deepStrictEqual(
          result.children[0].filters.starts_after?.actual,
          new Date('2020-01-01').toISOString(),
        )
        assert
          .deepStrictEqual(result.children[0].filters.starts_after?.similarity)
          .toBe(0) // starts before the calculated date
      }
    })

    it('should handle multiple work experiences with different ref dates', () => {
      const state: WorkExperiencesState = {
        kind: 'work_experiences',
        op: 'contains',
        expected: {
          starts_after: { $ref: 'graduation_date.bachelor' },
        },
      }

      const earlyWorkExperience: WorkExperience = {
        ...mockWorkExperience,
        id: 'early-work',
        start_date: new Date('2018-01-01'), // Before bachelor graduation
        end_date: new Date('2019-01-01'),
      }

      const lateWorkExperience: WorkExperience = {
        ...mockWorkExperience,
        id: 'late-work',
        start_date: new Date('2020-01-01'), // After bachelor graduation
        end_date: new Date('2021-01-01'),
      }

      const stateInput: WorkExperiencesStateInput = {
        education_experiences: mockEducationExperiences,
        work_experiences: [earlyWorkExperience, lateWorkExperience],
      }

      const result = getWorkExperiencesStateOutput(
        mockContext,
        state,
        stateInput,
      )

      if (result.op === 'contains') {
        assert.deepStrictEqual(result.children).toHaveLength(2)
        assert
          .deepStrictEqual(result.children[0].filters.starts_after?.similarity)
          .toBe(0) // early work starts before most recent graduation
        assert
          .deepStrictEqual(result.children[1].filters.starts_after?.similarity)
          .toBe(0) // late work also starts before most recent graduation (2020-05-15)
        assert.deepStrictEqual(result.similarity).toBe(0) // average of 0 and 0
      }
    })

    it('should handle multiple bachelor degrees and pick the most recent', () => {
      const state: WorkExperiencesState = {
        kind: 'work_experiences',
        op: 'contains',
        expected: {
          starts_after: { $ref: 'graduation_date.bachelor' },
        },
      }

      const stateInput: WorkExperiencesStateInput = {
        education_experiences: mockEducationExperiences, // Contains multiple bachelor degrees
        work_experiences: [mockWorkExperience], // starts 2020-01-01
      }

      const result = getWorkExperiencesStateOutput(
        mockContext,
        state,
        stateInput,
      )

      if (result.op === 'contains') {
        assert
          .deepStrictEqual(result.children[0].filters.starts_after)
          .toBeDefined()
        // Should use the most recent bachelor degree graduation (2020-05-15 from multiple-degrees-1)
        // not the earlier one (2019-06-01 from bachelor-1)
        assert.deepStrictEqual(
          result.children[0].filters.starts_after?.expected,
          new Date('2020-05-15').toISOString(),
        )
        assert.deepStrictEqual(
          result.children[0].filters.starts_after?.actual,
          new Date('2020-01-01').toISOString(),
        )
        assert
          .deepStrictEqual(result.children[0].filters.starts_after?.similarity)
          .toBe(0) // starts before the most recent graduation
      }
    })

    it('should handle ongoing education and not include it in graduation dates', () => {
      const state: WorkExperiencesState = {
        kind: 'work_experiences',
        op: 'contains',
        expected: {
          starts_after: { $ref: 'graduation_date.doctorate' },
        },
      }

      const stateInput: WorkExperiencesStateInput = {
        education_experiences: mockEducationExperiences, // Contains ongoing PhD
        work_experiences: [mockWorkExperience], // starts 2020-01-01
      }

      const result = getWorkExperiencesStateOutput(
        mockContext,
        state,
        stateInput,
      )

      if (result.op === 'contains') {
        assert
          .deepStrictEqual(result.children[0].filters.starts_after)
          .toBeDefined()
        // Should use the completed PhD (2025-05-20), not the ongoing one (no end date)
        assert.deepStrictEqual(
          result.children[0].filters.starts_after?.expected,
          new Date('2025-05-20').toISOString(),
        )
        assert.deepStrictEqual(
          result.children[0].filters.starts_after?.actual,
          new Date('2020-01-01').toISOString(),
        )
        assert
          .deepStrictEqual(result.children[0].filters.starts_after?.similarity)
          .toBe(0) // starts before doctorate graduation
      }
    })
  })

  describe('getWorkExperiencesStateOutput - matches operation - occupation_codes and intersection logic', () => {
    const mockWorkExperienceWithOccupation: WorkExperience = {
      ...mockWorkExperience,
      id: 'work-with-occupation',
      occupation_codes: {
        primary: {
          kind: 'ISCO-2008',
          code: '2511', // Software developer
        },
        equivalent: [],
      },
    }

    it('should handle occupation_codes filter with matching codes', () => {
      const state: WorkExperiencesState = {
        kind: 'work_experiences',
        op: 'contains',
        expected: {
          occupation_codes: {
            kind: 'ISCO-2008' as const,
            codes: [
              {
                level: 'unit' as const,
                code: '2511', // Software developer
              },
            ],
          },
        },
      }

      const input: WorkExperiencesStateInput = {
        work_experiences: [mockWorkExperienceWithOccupation],
      }

      const result = getWorkExperiencesStateOutput(mockContext, state, input)

      if (result.op === 'contains') {
        const matchingChild = result.children.find(
          child => child.id === 'work-with-occupation',
        )
        assert.deepStrictEqual(
          matchingChild?.filters.occupation_codes?.expected,
          {
            kind: 'ISCO-2008' as const,
            codes: [
              {
                level: 'unit' as const,
                code: '2511',
              },
            ],
          },
        )
        assert.deepStrictEqual(matchingChild?.similarity).toBe(1)
        assert.deepStrictEqual(result.similarity).toBe(1)
      }
    })

    it('should handle occupation_codes filter with non-matching codes', () => {
      const state: WorkExperiencesState = {
        kind: 'work_experiences',
        op: 'contains',
        expected: {
          occupation_codes: {
            kind: 'ISCO-2008' as const,
            codes: [
              {
                level: 'unit' as const,
                code: '1221', // Marketing manager
              },
            ],
          },
        },
      }

      const input: WorkExperiencesStateInput = {
        work_experiences: [mockWorkExperienceWithOccupation], // Software developer
      }

      const result = getWorkExperiencesStateOutput(mockContext, state, input)

      if (result.op === 'contains') {
        const nonMatchingChild = result.children.find(
          child => child.id === 'work-with-occupation',
        )
        assert.deepStrictEqual(
          nonMatchingChild?.filters.occupation_codes?.expected,
          {
            kind: 'ISCO-2008' as const,
            codes: [
              {
                level: 'unit' as const,
                code: '1221',
              },
            ],
          },
        )
        assert.deepStrictEqual(nonMatchingChild?.similarity).toBe(0)
        assert.deepStrictEqual(result.similarity).toBe(0)
      }
    })

    it('should handle intersection of multiple filters - all filters satisfied by same experience', () => {
      const state: WorkExperiencesState = {
        kind: 'work_experiences',
        op: 'matches',
        expected: {
          filters: {
            occupation_codes: {
              kind: 'ISCO-2008' as const,
              codes: [
                {
                  level: 'unit' as const,
                  code: '2511', // Software developer
                },
              ],
            },
          },
          aggregation: {
            min_sum_of_duration: {
              value: 1,
              unit: 'year',
            },
            min_sum_of_monthly_salary: {
              amount: 5000,
              currency: 'USD',
            },
          },
        },
      }

      const input: WorkExperiencesStateInput = {
        work_experiences: [mockWorkExperienceWithOccupation], // 24 months, 6667 USD monthly, software developer
      }

      const result = getWorkExperiencesStateOutput(mockContext, state, input)

      if (result.op === 'matches') {
        assert
          .deepStrictEqual(result.aggregation.min_sum_of_duration?.similarity)
          .toBe(1)
        assert
          .deepStrictEqual(
            result.aggregation.min_sum_of_monthly_salary?.similarity,
          )
          .toBe(1)
        assert.deepStrictEqual(result.similarity).toBe(1) // Perfect intersection - same experience satisfies all filters
      }
    })

    it('should handle intersection of multiple filters - no intersection', () => {
      const softwareDevWorkExperience: WorkExperience = {
        ...mockWorkExperience,
        id: 'software-dev-work',
        occupation_codes: {
          primary: {
            kind: 'ISCO-2008',
            code: '2511', // Software developer
          },
          equivalent: [],
        },
        start_date: new Date('2020-01-01'),
        end_date: new Date('2020-06-01'), // Only 5 months
        fixed_monthly_salary: { amount: 3000, currency: 'USD' }, // Low salary
      }

      const highSalaryWorkExperience: WorkExperience = {
        ...mockWorkExperience,
        id: 'high-salary-work',
        occupation_codes: {
          primary: {
            kind: 'ISCO-2008',
            code: '1221', // Marketing manager
          },
          equivalent: [],
        },
        start_date: new Date('2021-01-01'),
        end_date: new Date('2023-01-01'), // 24 months
        fixed_monthly_salary: { amount: 8000, currency: 'USD' }, // High salary
      }

      const state: WorkExperiencesState = {
        kind: 'work_experiences',
        op: 'matches',
        expected: {
          filters: {
            occupation_codes: {
              kind: 'ISCO-2008' as const,
              codes: [
                {
                  level: 'unit' as const,
                  code: '2511', // Software developer
                },
              ],
            },
          },
          aggregation: {
            min_sum_of_duration: {
              value: 18,
              unit: 'month',
            },
            min_sum_of_monthly_salary: {
              amount: 7000,
              currency: 'USD',
            },
          },
        },
      }

      const input: WorkExperiencesStateInput = {
        work_experiences: [softwareDevWorkExperience, highSalaryWorkExperience],
      }

      const result = getWorkExperiencesStateOutput(mockContext, state, input)

      if (result.op === 'matches') {
        // The software dev experience has low salary and duration
        // The high salary experience is not a software dev
        // Thus, the filtered experiences for aggregation will be only the software dev one.
        assert
          .deepStrictEqual(
            result.aggregation.min_sum_of_duration?.actual?.value,
          )
          .toBeCloseTo(5, 0)
        assert
          .deepStrictEqual(result.aggregation.min_sum_of_duration?.similarity)
          .toBeLessThan(1)

        assert
          .deepStrictEqual(
            result.aggregation.min_sum_of_monthly_salary?.actual?.amount,
          )
          .toBe(3000)
        assert
          .deepStrictEqual(
            result.aggregation.min_sum_of_monthly_salary?.similarity,
          )
          .toBeLessThan(1)
        assert.deepStrictEqual(result.similarity).toBeLessThan(1)
      }
    })

    it('should handle partial intersection - some filters satisfied', () => {
      const state: WorkExperiencesState = {
        kind: 'work_experiences',
        op: 'matches',
        expected: {
          filters: {
            occupation_codes: {
              kind: 'ISCO-2008' as const,
              codes: [
                {
                  level: 'unit' as const,
                  code: '2511', // Software developer
                },
              ],
            },
          },
          aggregation: {
            min_sum_of_duration: {
              value: 50, // Impossible to meet
              unit: 'year',
            },
          },
        },
      }

      const input: WorkExperiencesStateInput = {
        work_experiences: [mockWorkExperienceWithOccupation], // Software developer, but only 2 years
      }

      const result = getWorkExperiencesStateOutput(mockContext, state, input)

      if (result.op === 'matches') {
        assert
          .deepStrictEqual(result.aggregation.min_sum_of_duration?.similarity)
          .toBeCloseTo(0.04) // 2/50 = 0.04
        assert.deepStrictEqual(result.similarity).toBeCloseTo(0.04)
      }
    })

    it('should handle multiple experiences with mixed filter satisfaction', () => {
      const exp1: WorkExperience = {
        ...mockWorkExperience,
        id: 'exp1',
        occupation_codes: {
          primary: {
            kind: 'ISCO-2008',
            code: '2511', // Software developer
          },
          equivalent: [],
        },
        start_date: new Date('2020-01-01'),
        end_date: new Date('2021-01-01'), // 12 months
        fixed_monthly_salary: { amount: 4000, currency: 'USD' },
      }

      const exp2: WorkExperience = {
        ...mockWorkExperience,
        id: 'exp2',
        occupation_codes: {
          primary: {
            kind: 'ISCO-2008',
            code: '2511', // Software developer
          },
          equivalent: [],
        },
        start_date: new Date('2021-06-01'),
        end_date: new Date('2022-12-01'), // 18 months
        fixed_monthly_salary: { amount: 6000, currency: 'USD' },
      }

      const exp3: WorkExperience = {
        ...mockWorkExperience,
        id: 'exp3',
        occupation_codes: {
          primary: {
            kind: 'ISCO-2008',
            code: '1221', // Marketing manager
          },
          equivalent: [],
        },
        start_date: new Date('2022-01-01'),
        end_date: new Date('2023-01-01'), // 12 months
        fixed_monthly_salary: { amount: 7000, currency: 'USD' },
      }

      const state: WorkExperiencesState = {
        kind: 'work_experiences',
        op: 'matches',
        expected: {
          filters: {
            occupation_codes: {
              kind: 'ISCO-2008' as const,
              codes: [
                {
                  level: 'unit' as const,
                  code: '2511', // Software developer
                },
              ],
            },
          },
          aggregation: {
            min_sum_of_duration: {
              value: 24, // 2 years
              unit: 'month',
            },
            min_sum_of_monthly_salary: {
              amount: 10000,
              currency: 'USD',
            },
          },
        },
      }

      const input: WorkExperiencesStateInput = {
        work_experiences: [exp1, exp2, exp3],
      }

      const result = getWorkExperiencesStateOutput(mockContext, state, input)

      if (result.op === 'matches') {
        // exp1 and exp2 match occupation_codes.
        // Their combined duration is 12 + 18 = 30 months.
        // Their combined salary is 4000 + 6000 = 10000.
        assert
          .deepStrictEqual(result.aggregation.min_sum_of_duration?.similarity)
          .toBe(1)
        assert
          .deepStrictEqual(
            result.aggregation.min_sum_of_monthly_salary?.similarity,
          )
          .toBe(1)
        assert.deepStrictEqual(result.similarity).toBe(1)
      }
    })
  })
})
*/
