export type CalculatorId = 'loan' | 'savings' | 'tax' | 'unit' | 'dday'

export interface CalculatorTab {
  id: CalculatorId
  label: string
}

export const CALCULATOR_TABS: CalculatorTab[] = [
  { id: 'loan', label: '대출' },
  { id: 'savings', label: '예적금' },
  { id: 'tax', label: '세금/연봉' },
  { id: 'unit', label: '단위' },
  { id: 'dday', label: '디데이' },
]
