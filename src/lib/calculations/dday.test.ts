import { describe, expect, it } from 'vitest'
import { calculateDday } from './dday'

describe('calculateDday', () => {
  it('returns D-DAY when the target date equals the base date', () => {
    const result = calculateDday('2026-08-29', '2026-08-29')
    expect(result.diffDays).toBe(0)
    expect(result.label).toBe('D-DAY')
  })

  it('returns a D-N label for a future date', () => {
    const result = calculateDday('2026-08-29', '2026-09-08')
    expect(result.diffDays).toBe(10)
    expect(result.label).toBe('D-10')
  })

  it('returns a D+N label for a past date', () => {
    const result = calculateDday('2026-08-29', '2026-08-15')
    expect(result.diffDays).toBe(-14)
    expect(result.label).toBe('D+14')
  })

  it('correctly spans a year boundary', () => {
    const result = calculateDday('2026-12-25', '2027-01-01')
    expect(result.diffDays).toBe(7)
    expect(result.label).toBe('D-7')
  })

  it('correctly spans a leap-year February', () => {
    // 2028 is a leap year, so Feb has 29 days
    const result = calculateDday('2028-02-01', '2028-03-01')
    expect(result.diffDays).toBe(29)
  })
})
