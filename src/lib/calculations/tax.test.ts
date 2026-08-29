import { describe, expect, it } from 'vitest'
import { calculateTax } from './tax'

describe('calculateTax - freelancer', () => {
  it('deducts exactly 3.3% (3% income tax + 0.3% local tax)', () => {
    const result = calculateTax({ mode: 'freelancer', amount: 1_000_000 })
    expect(result.mode).toBe('freelancer')
    if (result.mode !== 'freelancer') return
    expect(result.incomeTax).toBe(30_000)
    expect(result.localIncomeTax).toBe(3_000)
    expect(result.totalTax).toBe(33_000)
    expect(result.netAmount).toBe(967_000)
  })

  it('matches manually verified UI output for a 50,000,000 salary', () => {
    // Regression check against the value confirmed in the running app.
    const result = calculateTax({
      mode: 'employee',
      annualSalary: 50_000_000,
      nonTaxableMonthly: 200_000,
      dependents: 1,
    })
    expect(result.mode).toBe('employee')
    if (result.mode !== 'employee') return
    expect(result.monthlyNet).toBe(3_472_250)
  })
})

describe('calculateTax - employee', () => {
  it('never lets the monthly net exceed the monthly gross', () => {
    const result = calculateTax({
      mode: 'employee',
      annualSalary: 60_000_000,
      nonTaxableMonthly: 200_000,
      dependents: 1,
    })
    if (result.mode !== 'employee') return
    expect(result.monthlyNet).toBeLessThan(result.monthlyGross)
  })

  it('sums the 4 insurance components into totalInsurance', () => {
    const result = calculateTax({
      mode: 'employee',
      annualSalary: 45_000_000,
      nonTaxableMonthly: 100_000,
      dependents: 2,
    })
    if (result.mode !== 'employee') return
    expect(result.totalInsurance).toBe(
      result.pension +
        result.healthInsurance +
        result.longTermCare +
        result.employmentInsurance,
    )
  })

  it('treats a dependents count below 1 the same as 1 (본인 최소 공제)', () => {
    const withZero = calculateTax({
      mode: 'employee',
      annualSalary: 40_000_000,
      nonTaxableMonthly: 0,
      dependents: 0,
    })
    const withOne = calculateTax({
      mode: 'employee',
      annualSalary: 40_000_000,
      nonTaxableMonthly: 0,
      dependents: 1,
    })
    expect(withZero).toEqual(withOne)
  })

  it('never produces a negative monthly net for a typical salary', () => {
    const result = calculateTax({
      mode: 'employee',
      annualSalary: 30_000_000,
      nonTaxableMonthly: 200_000,
      dependents: 1,
    })
    if (result.mode !== 'employee') return
    expect(result.monthlyNet).toBeGreaterThan(0)
  })
})
