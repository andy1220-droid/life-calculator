import { describe, expect, it } from 'vitest'
import { calculateSavings } from './savings'

describe('calculateSavings - simple interest (단리)', () => {
  it('computes lumpsum simple interest as P * r * (months/12)', () => {
    const result = calculateSavings({
      type: 'lumpsum',
      amount: 10_000_000,
      periodMonths: 12,
      annualRatePercent: 5,
      compound: 'simple',
      taxOption: 'taxfree',
    })
    expect(result.principal).toBe(10_000_000)
    expect(result.preTaxInterest).toBe(500_000)
    expect(result.postTaxInterest).toBe(500_000)
    expect(result.maturityAmount).toBe(10_500_000)
  })

  it('applies the 15.4% general tax rate to interest only', () => {
    const result = calculateSavings({
      type: 'lumpsum',
      amount: 10_000_000,
      periodMonths: 12,
      annualRatePercent: 5,
      compound: 'simple',
      taxOption: 'general',
    })
    expect(result.postTaxInterest).toBe(Math.round(500_000 * (1 - 0.154)))
  })
})

describe('calculateSavings - compound interest (복리)', () => {
  it('matches manually verified UI output for 월복리 적립식', () => {
    // Regression check against the value confirmed in the running app.
    const result = calculateSavings({
      type: 'installment',
      amount: 10_000_000,
      periodMonths: 12,
      annualRatePercent: 3.5,
      compound: 'monthly',
      taxOption: 'general',
    })
    expect(result.principal).toBe(120_000_000)
    expect(result.maturityAmount).toBe(121_644_488)
  })

  it('produces a higher maturity amount for daily compounding than simple interest', () => {
    const simple = calculateSavings({
      type: 'lumpsum',
      amount: 10_000_000,
      periodMonths: 12,
      annualRatePercent: 5,
      compound: 'simple',
      taxOption: 'taxfree',
    })
    const daily = calculateSavings({
      type: 'lumpsum',
      amount: 10_000_000,
      periodMonths: 12,
      annualRatePercent: 5,
      compound: 'daily',
      taxOption: 'taxfree',
    })
    expect(daily.maturityAmount).toBeGreaterThan(simple.maturityAmount)
  })

  it('produces no interest at a 0% rate', () => {
    const result = calculateSavings({
      type: 'lumpsum',
      amount: 5_000_000,
      periodMonths: 24,
      annualRatePercent: 0,
      compound: 'monthly',
      taxOption: 'general',
    })
    expect(result.preTaxInterest).toBe(0)
    expect(result.maturityAmount).toBe(5_000_000)
  })
})
