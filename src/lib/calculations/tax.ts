export type TaxMode = 'employee' | 'freelancer'

export interface EmployeeTaxInput {
  mode: 'employee'
  annualSalary: number
  nonTaxableMonthly: number
  dependents: number
}

export interface FreelancerTaxInput {
  mode: 'freelancer'
  amount: number
}

export type TaxInput = EmployeeTaxInput | FreelancerTaxInput

export interface EmployeeTaxResult {
  mode: 'employee'
  monthlyGross: number
  pension: number
  healthInsurance: number
  longTermCare: number
  employmentInsurance: number
  totalInsurance: number
  incomeTax: number
  localIncomeTax: number
  monthlyNet: number
}

export interface FreelancerTaxResult {
  mode: 'freelancer'
  amount: number
  incomeTax: number
  localIncomeTax: number
  totalTax: number
  netAmount: number
}

export type TaxResult = EmployeeTaxResult | FreelancerTaxResult

/**
 * 근로소득공제 (소득세법 제47조 근사치). 실제 세율/구간은 매년 바뀔 수 있어
 * 화면 하단 Disclaimer로 참고용임을 안내합니다.
 */
function calcEarnedIncomeDeduction(annualSalary: number): number {
  if (annualSalary <= 5_000_000) return annualSalary * 0.7
  if (annualSalary <= 15_000_000) return 3_500_000 + (annualSalary - 5_000_000) * 0.4
  if (annualSalary <= 45_000_000)
    return 7_500_000 + (annualSalary - 15_000_000) * 0.15
  if (annualSalary <= 100_000_000)
    return 12_000_000 + (annualSalary - 45_000_000) * 0.05
  return 14_750_000 + (annualSalary - 100_000_000) * 0.02
}

const INCOME_TAX_BRACKETS = [
  { limit: 14_000_000, rate: 0.06, deduction: 0 },
  { limit: 50_000_000, rate: 0.15, deduction: 1_260_000 },
  { limit: 88_000_000, rate: 0.24, deduction: 5_760_000 },
  { limit: 150_000_000, rate: 0.35, deduction: 15_440_000 },
  { limit: 300_000_000, rate: 0.38, deduction: 19_940_000 },
  { limit: 500_000_000, rate: 0.4, deduction: 25_940_000 },
  { limit: 1_000_000_000, rate: 0.42, deduction: 35_940_000 },
  { limit: Infinity, rate: 0.45, deduction: 65_940_000 },
]

function calcProgressiveIncomeTax(taxBase: number): number {
  const bracket = INCOME_TAX_BRACKETS.find((b) => taxBase <= b.limit)
  if (!bracket) return 0
  return Math.max(0, taxBase * bracket.rate - bracket.deduction)
}

const PENSION_RATE = 0.045
const HEALTH_INSURANCE_RATE = 0.03545
const LONG_TERM_CARE_RATE = 0.1295 // 건강보험료 대비 비율
const EMPLOYMENT_INSURANCE_RATE = 0.009
const PERSONAL_DEDUCTION_PER_PERSON = 1_500_000
const FREELANCER_TAX_RATE = 0.033 // 소득세 3% + 지방소득세 0.3%

export function calculateTax(input: TaxInput): TaxResult {
  if (input.mode === 'freelancer') {
    const totalTax = Math.round(input.amount * FREELANCER_TAX_RATE)
    const incomeTax = Math.round(input.amount * 0.03)
    const localIncomeTax = totalTax - incomeTax
    return {
      mode: 'freelancer',
      amount: input.amount,
      incomeTax,
      localIncomeTax,
      totalTax,
      netAmount: input.amount - totalTax,
    }
  }

  const monthlyGross = input.annualSalary / 12
  const insuranceBase = Math.max(0, monthlyGross - input.nonTaxableMonthly)
  const pension = insuranceBase * PENSION_RATE
  const healthInsurance = insuranceBase * HEALTH_INSURANCE_RATE
  const longTermCare = healthInsurance * LONG_TERM_CARE_RATE
  const employmentInsurance = insuranceBase * EMPLOYMENT_INSURANCE_RATE
  const totalInsurance = pension + healthInsurance + longTermCare + employmentInsurance

  const earnedIncomeAmount = input.annualSalary - calcEarnedIncomeDeduction(input.annualSalary)
  const personalDeduction = Math.max(1, input.dependents) * PERSONAL_DEDUCTION_PER_PERSON
  const annualInsurance = totalInsurance * 12
  const taxBase = Math.max(0, earnedIncomeAmount - personalDeduction - annualInsurance)

  const annualIncomeTax = calcProgressiveIncomeTax(taxBase)
  const annualLocalTax = annualIncomeTax * 0.1
  const incomeTax = annualIncomeTax / 12
  const localIncomeTax = annualLocalTax / 12
  const monthlyNet = monthlyGross - totalInsurance - incomeTax - localIncomeTax

  return {
    mode: 'employee',
    monthlyGross: Math.round(monthlyGross),
    pension: Math.round(pension),
    healthInsurance: Math.round(healthInsurance),
    longTermCare: Math.round(longTermCare),
    employmentInsurance: Math.round(employmentInsurance),
    totalInsurance: Math.round(totalInsurance),
    incomeTax: Math.round(incomeTax),
    localIncomeTax: Math.round(localIncomeTax),
    monthlyNet: Math.round(monthlyNet),
  }
}
