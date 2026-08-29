import { describe, expect, it } from 'vitest'
import { calculateLoan } from './loan'

describe('calculateLoan - 원리금균등 (equal payment)', () => {
  it('matches manually verified UI output for 3억원 / 4.5% / 360개월', () => {
    // Regression check against the value confirmed in the running app.
    const result = calculateLoan({
      amount: 300_000_000,
      annualRatePercent: 4.5,
      termMonths: 360,
      repaymentType: 'equalPayment',
    })
    expect(result.firstPayment).toBe(1_520_056)
    expect(result.totalInterest).toBe(247_220_145)
    expect(result.totalPayment).toBe(547_220_160)
  })

  it('keeps the monthly payment constant across the schedule', () => {
    const result = calculateLoan({
      amount: 100_000_000,
      annualRatePercent: 3,
      termMonths: 24,
      repaymentType: 'equalPayment',
    })
    const payments = new Set(result.schedule.slice(0, -1).map((row) => row.payment))
    expect(payments.size).toBe(1)
  })

  it('pays off the loan to exactly 0 balance by the final month', () => {
    const result = calculateLoan({
      amount: 50_000_000,
      annualRatePercent: 2.5,
      termMonths: 60,
      repaymentType: 'equalPayment',
    })
    expect(result.schedule.at(-1)?.balance).toBe(0)
  })

  it('splits an even amount evenly with a 0% rate', () => {
    const result = calculateLoan({
      amount: 12_000_000,
      annualRatePercent: 0,
      termMonths: 12,
      repaymentType: 'equalPayment',
    })
    expect(result.firstPayment).toBe(1_000_000)
    expect(result.totalInterest).toBe(0)
  })
})

describe('calculateLoan - 원금균등 (equal principal)', () => {
  it('decreases the payment amount every month', () => {
    const result = calculateLoan({
      amount: 100_000_000,
      annualRatePercent: 4,
      termMonths: 12,
      repaymentType: 'equalPrincipal',
    })
    for (let i = 1; i < result.schedule.length; i++) {
      expect(result.schedule[i].payment).toBeLessThan(result.schedule[i - 1].payment)
    }
  })

  it('keeps the principal portion constant every month', () => {
    const result = calculateLoan({
      amount: 120_000_000,
      annualRatePercent: 4,
      termMonths: 12,
      repaymentType: 'equalPrincipal',
    })
    const principals = new Set(result.schedule.map((row) => row.principal))
    expect(principals.size).toBe(1)
    expect(result.schedule[0].principal).toBe(10_000_000)
  })
})

describe('calculateLoan - 만기일시상환 (bullet)', () => {
  it('charges interest-only payments until the final month', () => {
    const result = calculateLoan({
      amount: 100_000_000,
      annualRatePercent: 6,
      termMonths: 12,
      repaymentType: 'bullet',
    })
    const interestOnlyPayment = 100_000_000 * 0.06 / 12
    for (const row of result.schedule.slice(0, -1)) {
      expect(row.payment).toBe(Math.round(interestOnlyPayment))
      expect(row.principal).toBe(0)
    }
  })

  it('repays the full principal alongside interest in the final month', () => {
    const result = calculateLoan({
      amount: 100_000_000,
      annualRatePercent: 6,
      termMonths: 12,
      repaymentType: 'bullet',
    })
    const last = result.schedule.at(-1)!
    expect(last.principal).toBe(100_000_000)
    expect(last.balance).toBe(0)
  })

  it('computes total interest as principal * monthly rate * term', () => {
    const result = calculateLoan({
      amount: 100_000_000,
      annualRatePercent: 6,
      termMonths: 12,
      repaymentType: 'bullet',
    })
    expect(result.totalInterest).toBe(Math.round((100_000_000 * 0.06) / 12) * 12)
  })
})
