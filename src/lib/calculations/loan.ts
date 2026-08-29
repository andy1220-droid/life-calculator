import Decimal from 'decimal.js'

export type RepaymentType = 'equalPayment' | 'equalPrincipal' | 'bullet'

export interface LoanInput {
  amount: number
  annualRatePercent: number
  termMonths: number
  repaymentType: RepaymentType
}

export interface LoanScheduleRow {
  month: number
  payment: number
  principal: number
  interest: number
  balance: number
}

export interface LoanResult {
  firstPayment: number
  totalInterest: number
  totalPayment: number
  schedule: LoanScheduleRow[]
}

function toWon(value: Decimal): number {
  return value.toDecimalPlaces(0).toNumber()
}

export function calculateLoan(input: LoanInput): LoanResult {
  const { amount, annualRatePercent, termMonths: n, repaymentType } = input
  const i = new Decimal(annualRatePercent).div(100).div(12)
  const principalD = new Decimal(amount)
  const schedule: LoanScheduleRow[] = []
  let balance = principalD

  if (repaymentType === 'bullet') {
    const interestPerMonth = principalD.times(i)
    for (let month = 1; month <= n; month++) {
      const isLast = month === n
      const principalPaid = isLast ? principalD : new Decimal(0)
      const payment = isLast ? interestPerMonth.plus(principalD) : interestPerMonth
      balance = isLast ? new Decimal(0) : principalD
      schedule.push({
        month,
        payment: toWon(payment),
        principal: toWon(principalPaid),
        interest: toWon(interestPerMonth),
        balance: toWon(balance),
      })
    }
  } else if (repaymentType === 'equalPrincipal') {
    const principalPerMonth = principalD.div(n)
    for (let month = 1; month <= n; month++) {
      const interest = balance.times(i)
      const payment = principalPerMonth.plus(interest)
      balance = balance.minus(principalPerMonth)
      schedule.push({
        month,
        payment: toWon(payment),
        principal: toWon(principalPerMonth),
        interest: toWon(interest),
        balance: toWon(Decimal.max(balance, 0)),
      })
    }
  } else {
    const iNum = i.toNumber()
    const monthlyPayment =
      iNum === 0
        ? principalD.div(n)
        : principalD.times(i).div(new Decimal(1).minus(new Decimal(1).plus(i).pow(-n)))

    for (let month = 1; month <= n; month++) {
      const interest = balance.times(i)
      let principalPaid = monthlyPayment.minus(interest)
      const isLast = month === n
      if (isLast) principalPaid = balance // 마지막 회차는 잔액을 전액 상환해 반올림 오차 보정
      balance = balance.minus(principalPaid)
      schedule.push({
        month,
        payment: toWon(isLast ? principalPaid.plus(interest) : monthlyPayment),
        principal: toWon(principalPaid),
        interest: toWon(interest),
        balance: toWon(Decimal.max(balance, 0)),
      })
    }
  }

  const totalPayment = schedule.reduce((sum, row) => sum + row.payment, 0)
  const totalInterest = schedule.reduce((sum, row) => sum + row.interest, 0)

  return {
    firstPayment: schedule[0]?.payment ?? 0,
    totalInterest,
    totalPayment,
    schedule,
  }
}
