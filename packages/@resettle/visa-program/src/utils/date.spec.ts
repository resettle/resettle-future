import assert from 'node:assert'
import { describe, it } from 'node:test'

import { getDurationInMonths, getDurationInYears } from './date'

describe('getDurationInMonths', () => {
  it('should calculate exact months with no remaining days', () => {
    const start = new Date('2023-01-01')
    const end = new Date('2023-04-01')
    assert.equal(getDurationInMonths(start, end), 3)
  })

  it('should round down when remaining days < 10', () => {
    const start = new Date('2023-01-01')
    const end = new Date('2023-02-09') // 39 days = 1 month + 9 days
    assert.equal(getDurationInMonths(start, end), 1)
  })

  it('should round up when remaining days >= 10', () => {
    const start = new Date('2023-01-01')
    const end = new Date('2023-02-11') // 40 days = 1 month + 10 days
    assert.equal(getDurationInMonths(start, end), 2)
  })

  it('should handle month boundaries correctly', () => {
    const start = new Date('2023-01-31')
    const end = new Date('2023-02-28') // 28 days = 0 months + 28 days
    assert.equal(getDurationInMonths(start, end), 1) // >= 10 days, round up
  })

  it('should handle leap year correctly', () => {
    const start = new Date('2024-01-31')
    const end = new Date('2024-02-29') // 29 days = 0 months + 29 days
    assert.equal(getDurationInMonths(start, end), 1) // >= 10 days, round up
  })

  it('should handle different month lengths', () => {
    const start = new Date('2023-01-31')
    const end = new Date('2023-03-05') // 1 month + 5 days (Feb has 28 days)
    assert.equal(getDurationInMonths(start, end), 1) // < 10 days, round down
  })

  it('should handle year boundaries', () => {
    const start = new Date('2023-12-01')
    const end = new Date('2024-03-15') // 3 months + 14 days
    assert.equal(getDurationInMonths(start, end), 4) // >= 10 days, round up
  })

  it('should return 0 for same date', () => {
    const date = new Date('2023-06-15')
    assert.equal(getDurationInMonths(date, date), 0)
  })

  it('should handle end date before start date', () => {
    const start = new Date('2023-06-15')
    const end = new Date('2023-05-15')
    assert.equal(getDurationInMonths(start, end), 0) // Math.max(0, negative) = 0
  })

  it('should handle exact day boundaries for rounding', () => {
    const start = new Date('2023-01-01')
    const end = new Date('2023-01-09') // exactly 8 days
    assert.equal(getDurationInMonths(start, end), 0) // < 10 days, round down

    const end2 = new Date('2023-01-11') // exactly 10 days
    assert.equal(getDurationInMonths(start, end2), 1) // >= 10 days, round up
  })
})

describe('getDurationInYears', () => {
  it('should calculate exact years with no remaining months', () => {
    const start = new Date('2020-01-01')
    const end = new Date('2023-01-01')
    assert.equal(getDurationInYears(start, end), 3)
  })

  it('should round down when remaining months < 2', () => {
    const start = new Date('2020-01-01')
    const end = new Date('2021-02-28') // 1 year + 1 month + 27 days
    assert.ok(getDurationInYears(start, end) > 1.1)
    assert.ok(getDurationInYears(start, end) < 1.2)
  })

  it('should round up when remaining months >= 2', () => {
    const start = new Date('2020-01-01')
    const end = new Date('2021-03-01') // 1 year + 2 months
    assert.ok(getDurationInYears(start, end) > 1.1)
    assert.ok(getDurationInYears(start, end) < 1.2)
  })

  it('should handle leap year correctly', () => {
    const start = new Date('2020-02-29') // leap year
    const end = new Date('2022-04-15') // 2 years + 1 month + some days
    assert.ok(getDurationInYears(start, end) > 2.1)
    assert.ok(getDurationInYears(start, end) < 2.2)
  })

  it('should handle month boundaries with day adjustments', () => {
    const start = new Date('2020-01-31')
    const end = new Date('2021-01-30') // 11 months + 30 days (but day is less)
    assert.ok(getDurationInYears(start, end) > 1) // < 2 months remaining, round down
  })

  it('should handle exact 2-month boundary', () => {
    const start = new Date('2020-01-15')
    const end = new Date('2021-03-15') // 1 year + exactly 2 months
    assert.ok(getDurationInYears(start, end) > 1.1)
    assert.ok(getDurationInYears(start, end) < 1.2)
  })

  it('should handle multiple years with rounding', () => {
    const start = new Date('2018-06-15')
    const end = new Date('2023-08-20') // 5 years + 2 months + 5 days
    assert.ok(getDurationInYears(start, end) > 5.1)
    assert.ok(getDurationInYears(start, end) < 5.2)
  })

  it('should return 0 for same date', () => {
    const date = new Date('2023-06-15')
    assert.equal(getDurationInYears(date, date), 0)
  })

  it('should handle end date before start date', () => {
    const start = new Date('2023-06-15')
    const end = new Date('2022-06-15')
    assert.equal(getDurationInYears(start, end), 0) // Math.max(0, negative) = 0
  })

  it('should handle edge case with day adjustments affecting months', () => {
    const start = new Date('2020-03-31')
    const end = new Date('2021-03-30') // 11 months + 30 days, but day adjustment makes it 11 months
    assert.ok(getDurationInYears(start, end) < 1) // < 2 months remaining, round down
  })

  it('should handle exact month boundaries for rounding', () => {
    const start = new Date('2020-01-01')
    const end = new Date('2021-02-28') // 1 year + 1 month + 27 days
    assert.ok(getDurationInYears(start, end) > 1) // < 2 months, round down

    const end2 = new Date('2021-03-01') // 1 year + exactly 2 months
    assert.ok(getDurationInYears(start, end2) > 1.1)
    assert.ok(getDurationInYears(start, end2) > 1.2)
  })
})
