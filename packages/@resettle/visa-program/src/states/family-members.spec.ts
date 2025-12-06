import type { FamilyMember } from '@resettle/schema'
import assert from 'node:assert'
import { describe, it } from 'node:test'

import { createMockContext } from '../mock'
import {
  getFamilyMembersStateOutput,
  type FamilyMembersState,
} from './family-members'

const mockContext = createMockContext()

describe('family members state', () => {
  describe('getFamilyMembersStateOutput', () => {
    describe('exists operation - expected true (family_members required)', () => {
      it('should return similarity 1 when family_members exist', () => {
        const state: FamilyMembersState = {
          kind: 'family_members',
          op: 'exists',
          expected: true,
        }

        const mockFamilyMembers: FamilyMember[] = [
          {
            id: '123e4567-e89b-12d3-a456-426614174000',
            type: 'partner',
            date_of_birth: new Date('1990-01-01'),
            citizenship: ['US'],
            permanent_residency: ['CA'],
            education_experiences: [],
            work_experiences: [],
          },
        ]

        const result = getFamilyMembersStateOutput(mockContext, state, {
          family_members: mockFamilyMembers,
        })

        assert.deepStrictEqual(result, {
          kind: 'family_members',
          op: 'exists',
          expected: true,
          actual: true,
          similarity: 1,
        })
      })

      it('should return similarity 1 when multiple family members exist', () => {
        const state: FamilyMembersState = {
          kind: 'family_members',
          op: 'exists',
          expected: true,
        }

        const mockFamilyMembers: FamilyMember[] = [
          {
            id: '123e4567-e89b-12d3-a456-426614174000',
            type: 'partner',
            date_of_birth: new Date('1990-01-01'),
          },
          {
            id: '123e4567-e89b-12d3-a456-426614174001',
            type: 'child',
            date_of_birth: new Date('2015-06-15'),
          },
        ]

        const result = getFamilyMembersStateOutput(mockContext, state, {
          family_members: mockFamilyMembers,
        })

        assert.deepStrictEqual(result, {
          kind: 'family_members',
          op: 'exists',
          expected: true,
          actual: true,
          similarity: 1,
        })
      })

      it('should return similarity 0 when no family_members exist (undefined)', () => {
        const state: FamilyMembersState = {
          kind: 'family_members',
          op: 'exists',
          expected: true,
        }

        const result = getFamilyMembersStateOutput(mockContext, state, {
          family_members: undefined,
        })

        assert.deepStrictEqual(result, {
          kind: 'family_members',
          op: 'exists',
          actual: undefined,
          expected: true,
          similarity: 0,
        })
      })

      it('should return similarity 0 when family_members array is empty', () => {
        const state: FamilyMembersState = {
          kind: 'family_members',
          op: 'exists',
          expected: true,
        }

        const result = getFamilyMembersStateOutput(mockContext, state, {
          family_members: [],
        })

        assert.deepStrictEqual(result, {
          kind: 'family_members',
          op: 'exists',
          expected: true,
          actual: false,
          similarity: 0,
        })
      })
    })

    describe('exists operation - expected false (no family_members required)', () => {
      it('should return similarity 1 when no family_members exist (undefined)', () => {
        const state: FamilyMembersState = {
          kind: 'family_members',
          op: 'exists',
          expected: false,
        }

        const result = getFamilyMembersStateOutput(mockContext, state, {
          family_members: undefined,
        })

        assert.deepStrictEqual(result, {
          kind: 'family_members',
          op: 'exists',
          actual: undefined,
          expected: false,
          similarity: 1,
        })
      })

      it('should return similarity 1 when family_members array is empty', () => {
        const state: FamilyMembersState = {
          kind: 'family_members',
          op: 'exists',
          expected: false,
        }

        const result = getFamilyMembersStateOutput(mockContext, state, {
          family_members: [],
        })

        assert.deepStrictEqual(result, {
          kind: 'family_members',
          op: 'exists',
          expected: false,
          actual: false,
          similarity: 1,
        })
      })

      it('should return similarity 1 even when family_members exist (OR logic)', () => {
        const state: FamilyMembersState = {
          kind: 'family_members',
          op: 'exists',
          expected: false,
        }

        const mockFamilyMembers: FamilyMember[] = [
          {
            id: '123e4567-e89b-12d3-a456-426614174000',
            type: 'partner',
            date_of_birth: new Date('1990-01-01'),
          },
        ]

        const result = getFamilyMembersStateOutput(mockContext, state, {
          family_members: mockFamilyMembers,
        })

        assert.deepStrictEqual(result, {
          kind: 'family_members',
          op: 'exists',
          expected: false,
          actual: true,
          similarity: 1,
        })
      })
    })

    describe('edge cases', () => {
      it('should handle family member with minimal required fields', () => {
        const state: FamilyMembersState = {
          kind: 'family_members',
          op: 'exists',
          expected: true,
        }

        const mockFamilyMembers: FamilyMember[] = [
          {
            id: '123e4567-e89b-12d3-a456-426614174000',
            type: 'child',
          },
        ]

        const result = getFamilyMembersStateOutput(mockContext, state, {
          family_members: mockFamilyMembers,
        })

        assert.deepStrictEqual(result, {
          kind: 'family_members',
          op: 'exists',
          expected: true,
          actual: true,
          similarity: 1,
        })
      })

      it('should handle family member with all optional fields', () => {
        const state: FamilyMembersState = {
          kind: 'family_members',
          op: 'exists',
          expected: true,
        }

        const mockFamilyMembers: FamilyMember[] = [
          {
            id: '123e4567-e89b-12d3-a456-426614174000',
            type: 'parent',
            date_of_birth: new Date('1960-03-15'),
            citizenship: ['GB', 'AU'],
            permanent_residency: ['US'],
            education_experiences: [
              {
                id: '223e4567-e89b-12d3-a456-426614174000',
                institution_name: 'University of Oxford',
                institution_country: 'GB',
                level: 'doctorate',
                start_date: new Date('1980-09-01'),
                end_date: new Date('1985-06-30'),
              },
            ],
            work_experiences: [
              {
                id: '323e4567-e89b-12d3-a456-426614174000',
                employer_name: 'Tech Corp',
                job_title: 'Senior Engineer',
                employer_country: 'US',
                employment_type: 'full_time',
                start_date: new Date('1985-07-01'),
                end_date: new Date('2020-12-31'),
                fixed_annual_salary: {
                  amount: 120000,
                  currency: 'USD',
                },
                is_remote: false,
              },
            ],
          },
        ]

        const result = getFamilyMembersStateOutput(mockContext, state, {
          family_members: mockFamilyMembers,
        })

        assert.deepStrictEqual(result, {
          kind: 'family_members',
          op: 'exists',
          expected: true,
          actual: true,
          similarity: 1,
        })
      })

      it('should handle input with no family_members key', () => {
        const state: FamilyMembersState = {
          kind: 'family_members',
          op: 'exists',
          expected: true,
        }

        const result = getFamilyMembersStateOutput(mockContext, state, {})

        assert.deepStrictEqual(result, {
          kind: 'family_members',
          op: 'exists',
          actual: undefined,
          expected: true,
          similarity: 0,
        })
      })
    })
  })
})
