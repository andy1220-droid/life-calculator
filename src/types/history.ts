import type { CalculatorId } from '@/types/calculator'

export interface HistoryEntry<TInput = unknown, TResult = unknown> {
  id: string
  calculatorId: CalculatorId
  /** 기록 목록에 보여줄 한 줄 요약 (예: "대출 3억 · 30년 · 원리금균등") */
  summary: string
  input: TInput
  result: TResult
  createdAt: string
}
