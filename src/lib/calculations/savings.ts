import Decimal from 'decimal.js'

export type SavingsType = 'lumpsum' | 'installment'
export type CompoundMethod = 'simple' | 'daily' | 'monthly' | 'annually'
export type TaxOption = 'general' | 'taxfree'

export interface SavingsInput {
  type: SavingsType
  /** 거치식: 예치금, 적립식: 월 납입액 */
  amount: number
  periodMonths: number
  annualRatePercent: number
  compound: CompoundMethod
  taxOption: TaxOption
}

export interface SavingsResult {
  principal: number
  preTaxInterest: number
  postTaxInterest: number
  maturityAmount: number
}

const TAX_RATES: Record<TaxOption, number> = { general: 0.154, taxfree: 0 }

/** 월복리 환산 시 사용할 실효 월이율 */
function effectiveMonthlyRate(annualRate: number, compound: CompoundMethod): number {
  switch (compound) {
    case 'annually':
      return Math.pow(1 + annualRate, 1 / 12) - 1
    case 'daily':
      return Math.pow(1 + annualRate / 365, 365 / 12) - 1
    case 'monthly':
    default:
      return annualRate / 12
  }
}

export function calculateSavings(input: SavingsInput): SavingsResult {
  const rate = input.annualRatePercent / 100
  const n = input.periodMonths
  const principal = input.type === 'lumpsum' ? input.amount : input.amount * n

  let preTaxInterest: number

  if (input.compound === 'simple') {
    preTaxInterest =
      input.type === 'lumpsum'
        ? input.amount * rate * (n / 12)
        : (input.amount * rate * (n * (n + 1))) / 2 / 12
  } else if (input.type === 'lumpsum') {
    let maturity: Decimal
    if (input.compound === 'daily') {
      const days = Math.round((n * 365) / 12)
      maturity = new Decimal(1).plus(rate / 365).pow(days).times(input.amount)
    } else {
      const im = effectiveMonthlyRate(rate, input.compound)
      maturity = new Decimal(1).plus(im).pow(n).times(input.amount)
    }
    preTaxInterest = maturity.minus(input.amount).toNumber()
  } else {
    const im = effectiveMonthlyRate(rate, input.compound)
    const maturity =
      im === 0
        ? new Decimal(input.amount).times(n)
        : new Decimal(1).plus(im).pow(n).minus(1).div(im).times(input.amount)
    preTaxInterest = maturity.minus(principal).toNumber()
  }

  const taxRate = TAX_RATES[input.taxOption]
  const postTaxInterest = preTaxInterest * (1 - taxRate)
  const maturityAmount = principal + postTaxInterest

  return {
    principal: Math.round(principal),
    preTaxInterest: Math.round(preTaxInterest),
    postTaxInterest: Math.round(postTaxInterest),
    maturityAmount: Math.round(maturityAmount),
  }
}
