import { useState } from 'react'
import { Calculator, ChevronDown, ChevronUp } from 'lucide-react'
import { CopyResultButton } from '@/components/common/CopyResultButton'
import { ResultCard } from '@/components/common/ResultCard'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  calculateLoan,
  type LoanInput,
  type LoanResult,
  type RepaymentType,
} from '@/lib/calculations/loan'
import { formatKRW } from '@/lib/format'
import { useHistoryStore } from '@/store/historyStore'
import type { HistoryEntry } from '@/types/history'

const REPAYMENT_OPTIONS: { value: RepaymentType; label: string }[] = [
  { value: 'equalPayment', label: '원리금균등' },
  { value: 'equalPrincipal', label: '원금균등' },
  { value: 'bullet', label: '만기일시상환' },
]

interface LoanCalculatorProps {
  /** 히스토리에서 복원할 항목. App에서 key로 넘겨 선택이 바뀔 때만 마운트 시점에 반영됩니다. */
  initialEntry: HistoryEntry<LoanInput, LoanResult> | null
}

export function LoanCalculator({ initialEntry }: LoanCalculatorProps) {
  const addEntry = useHistoryStore((state) => state.addEntry)
  const [amount, setAmount] = useState(
    initialEntry ? String(initialEntry.input.amount) : '300000000',
  )
  const [annualRatePercent, setAnnualRatePercent] = useState(
    initialEntry ? String(initialEntry.input.annualRatePercent) : '4.5',
  )
  const [termMonths, setTermMonths] = useState(
    initialEntry ? String(initialEntry.input.termMonths) : '360',
  )
  const [repaymentType, setRepaymentType] = useState<RepaymentType>(
    initialEntry?.input.repaymentType ?? 'equalPayment',
  )
  const [result, setResult] = useState<LoanResult | null>(
    initialEntry?.result ?? null,
  )
  const [showSchedule, setShowSchedule] = useState(false)

  const handleCalculate = () => {
    const input: LoanInput = {
      amount: Number(amount) || 0,
      annualRatePercent: Number(annualRatePercent) || 0,
      termMonths: Number(termMonths) || 0,
      repaymentType,
    }
    const next = calculateLoan(input)
    setResult(next)
    setShowSchedule(false)

    const repaymentLabel = REPAYMENT_OPTIONS.find(
      (r) => r.value === repaymentType,
    )?.label
    addEntry({
      calculatorId: 'loan',
      summary: `${formatKRW(input.amount)} · ${repaymentLabel} · 총이자 ${formatKRW(next.totalInterest)}`,
      input,
      result: next,
    })
  }

  return (
    <div className="mx-auto flex max-w-md flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="loan-amount">대출 금액 (원)</Label>
        <Input
          id="loan-amount"
          inputMode="numeric"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="loan-rate">대출 금리 (연 %)</Label>
          <Input
            id="loan-rate"
            inputMode="decimal"
            value={annualRatePercent}
            onChange={(e) => setAnnualRatePercent(e.target.value)}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="loan-term">대출 기간 (개월)</Label>
          <Input
            id="loan-term"
            inputMode="numeric"
            value={termMonths}
            onChange={(e) => setTermMonths(e.target.value)}
          />
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <Label>상환 방식</Label>
        <Select
          value={repaymentType}
          onValueChange={(v) => v && setRepaymentType(v as RepaymentType)}
        >
          <SelectTrigger className="w-full">
            <SelectValue>
              {(v: RepaymentType) =>
                REPAYMENT_OPTIONS.find((r) => r.value === v)?.label ?? v
              }
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            {REPAYMENT_OPTIONS.map((r) => (
              <SelectItem key={r.value} value={r.value}>
                {r.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Button type="button" onClick={handleCalculate}>
        <Calculator className="size-4" />
        계산하기
      </Button>

      {result && (
        <div className="flex flex-col gap-3">
          <ResultCard
            label={
              repaymentType === 'equalPrincipal' ? '1회차 상환액' : '월 상환액'
            }
            value={formatKRW(result.firstPayment)}
            emphasis
          />
          <div className="grid grid-cols-2 gap-3">
            <ResultCard
              label="총 이자액"
              value={formatKRW(result.totalInterest)}
            />
            <ResultCard
              label="총 상환 금액"
              value={formatKRW(result.totalPayment)}
            />
          </div>

          <CopyResultButton
            getText={() => {
              const repaymentLabel = REPAYMENT_OPTIONS.find(
                (r) => r.value === repaymentType,
              )?.label
              return [
                `대출 ${formatKRW(Number(amount) || 0)} · ${repaymentLabel} (연 ${annualRatePercent}%, ${termMonths}개월)`,
                `${repaymentType === 'equalPrincipal' ? '1회차' : '월'} 상환액: ${formatKRW(result.firstPayment)}`,
                `총 이자액: ${formatKRW(result.totalInterest)}`,
                `총 상환 금액: ${formatKRW(result.totalPayment)}`,
              ].join('\n')
            }}
          />

          <Button
            type="button"
            variant="outline"
            onClick={() => setShowSchedule((prev) => !prev)}
          >
            {showSchedule ? (
              <ChevronUp className="size-4" />
            ) : (
              <ChevronDown className="size-4" />
            )}
            상환 스케줄표 {showSchedule ? '숨기기' : '보기'}
          </Button>

          {showSchedule && (
            <div className="max-h-80 overflow-auto rounded-lg border">
              <table className="w-full min-w-[420px] text-xs">
                <thead className="sticky top-0 bg-muted">
                  <tr>
                    <th className="px-2 py-1.5 text-left">회차</th>
                    <th className="px-2 py-1.5 text-right">상환액</th>
                    <th className="px-2 py-1.5 text-right">원금</th>
                    <th className="px-2 py-1.5 text-right">이자</th>
                    <th className="px-2 py-1.5 text-right">잔액</th>
                  </tr>
                </thead>
                <tbody>
                  {result.schedule.map((row) => (
                    <tr key={row.month} className="border-t">
                      <td className="px-2 py-1.5">{row.month}</td>
                      <td className="px-2 py-1.5 text-right">
                        {formatKRW(row.payment)}
                      </td>
                      <td className="px-2 py-1.5 text-right">
                        {formatKRW(row.principal)}
                      </td>
                      <td className="px-2 py-1.5 text-right">
                        {formatKRW(row.interest)}
                      </td>
                      <td className="px-2 py-1.5 text-right">
                        {formatKRW(row.balance)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
