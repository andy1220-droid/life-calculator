import { useState } from 'react'
import { Calculator } from 'lucide-react'
import { CopyResultButton } from '@/components/common/CopyResultButton'
import { ResultCard } from '@/components/common/ResultCard'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  calculateTax,
  type EmployeeTaxInput,
  type FreelancerTaxInput,
  type TaxInput,
  type TaxMode,
  type TaxResult,
} from '@/lib/calculations/tax'
import { formatKRW } from '@/lib/format'
import { useHistoryStore } from '@/store/historyStore'
import type { HistoryEntry } from '@/types/history'

interface TaxCalculatorProps {
  /** 히스토리에서 복원할 항목. App에서 key로 넘겨 선택이 바뀔 때만 마운트 시점에 반영됩니다. */
  initialEntry: HistoryEntry<TaxInput, TaxResult> | null
}

export function TaxCalculator({ initialEntry }: TaxCalculatorProps) {
  const addEntry = useHistoryStore((state) => state.addEntry)
  const [mode, setMode] = useState<TaxMode>(initialEntry?.input.mode ?? 'employee')
  const [annualSalary, setAnnualSalary] = useState(
    initialEntry?.input.mode === 'employee'
      ? String(initialEntry.input.annualSalary)
      : '50000000',
  )
  const [nonTaxableMonthly, setNonTaxableMonthly] = useState(
    initialEntry?.input.mode === 'employee'
      ? String(initialEntry.input.nonTaxableMonthly)
      : '200000',
  )
  const [dependents, setDependents] = useState(
    initialEntry?.input.mode === 'employee'
      ? String(initialEntry.input.dependents)
      : '1',
  )
  const [freelancerAmount, setFreelancerAmount] = useState(
    initialEntry?.input.mode === 'freelancer'
      ? String(initialEntry.input.amount)
      : '1000000',
  )
  const [result, setResult] = useState<TaxResult | null>(
    initialEntry?.result ?? null,
  )

  const handleCalculate = () => {
    if (mode === 'employee') {
      const input: EmployeeTaxInput = {
        mode: 'employee',
        annualSalary: Number(annualSalary) || 0,
        nonTaxableMonthly: Number(nonTaxableMonthly) || 0,
        dependents: Number(dependents) || 1,
      }
      const next = calculateTax(input)
      setResult(next)
      addEntry({
        calculatorId: 'tax',
        summary: `연봉 ${formatKRW(input.annualSalary)} · 월 실수령 ${formatKRW(next.mode === 'employee' ? next.monthlyNet : 0)}`,
        input,
        result: next,
      })
    } else {
      const input: FreelancerTaxInput = {
        mode: 'freelancer',
        amount: Number(freelancerAmount) || 0,
      }
      const next = calculateTax(input)
      setResult(next)
      addEntry({
        calculatorId: 'tax',
        summary: `프리랜서 ${formatKRW(input.amount)} · 실수령 ${formatKRW(next.mode === 'freelancer' ? next.netAmount : 0)}`,
        input,
        result: next,
      })
    }
  }

  return (
    <div className="mx-auto flex max-w-md flex-col gap-4">
      <div className="inline-flex w-fit rounded-lg border p-1">
        <Button
          type="button"
          size="sm"
          variant={mode === 'employee' ? 'default' : 'ghost'}
          onClick={() => setMode('employee')}
        >
          직장인
        </Button>
        <Button
          type="button"
          size="sm"
          variant={mode === 'freelancer' ? 'default' : 'ghost'}
          onClick={() => setMode('freelancer')}
        >
          프리랜서
        </Button>
      </div>

      {mode === 'employee' ? (
        <>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="annual-salary">연봉 (세전, 원)</Label>
            <Input
              id="annual-salary"
              inputMode="numeric"
              value={annualSalary}
              onChange={(e) => setAnnualSalary(e.target.value)}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="non-taxable">비과세액 (월, 식대 등)</Label>
            <Input
              id="non-taxable"
              inputMode="numeric"
              value={nonTaxableMonthly}
              onChange={(e) => setNonTaxableMonthly(e.target.value)}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="dependents">부양가족 수 (본인 포함)</Label>
            <Input
              id="dependents"
              type="number"
              min={1}
              value={dependents}
              onChange={(e) => setDependents(e.target.value)}
            />
          </div>
        </>
      ) : (
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="freelancer-amount">건당 수령액 또는 총액 (원)</Label>
          <Input
            id="freelancer-amount"
            inputMode="numeric"
            value={freelancerAmount}
            onChange={(e) => setFreelancerAmount(e.target.value)}
          />
        </div>
      )}

      <Button type="button" onClick={handleCalculate}>
        <Calculator className="size-4" />
        계산하기
      </Button>

      {result?.mode === 'employee' && (
        <div className="flex flex-col gap-3">
          <ResultCard
            label="예상 월 실수령액"
            value={formatKRW(result.monthlyNet)}
            emphasis
          />
          <div className="grid grid-cols-2 gap-3">
            <ResultCard label="국민연금" value={formatKRW(result.pension)} />
            <ResultCard
              label="건강보험(장기요양 포함)"
              value={formatKRW(result.healthInsurance + result.longTermCare)}
            />
            <ResultCard
              label="고용보험"
              value={formatKRW(result.employmentInsurance)}
            />
            <ResultCard
              label="소득세+지방소득세"
              value={formatKRW(result.incomeTax + result.localIncomeTax)}
            />
          </div>
          <CopyResultButton
            getText={() =>
              [
                `연봉 ${formatKRW(Number(annualSalary) || 0)} (세전)`,
                `월 실수령액: ${formatKRW(result.monthlyNet)}`,
                `4대보험 공제: ${formatKRW(result.totalInsurance)}`,
                `소득세+지방소득세: ${formatKRW(result.incomeTax + result.localIncomeTax)}`,
              ].join('\n')
            }
          />
        </div>
      )}

      {result?.mode === 'freelancer' && (
        <div className="flex flex-col gap-3">
          <ResultCard
            label="실수령액"
            value={formatKRW(result.netAmount)}
            emphasis
          />
          <ResultCard
            label="원천징수 세액 (3.3%)"
            value={formatKRW(result.totalTax)}
            description={`소득세 ${formatKRW(result.incomeTax)} + 지방소득세 ${formatKRW(result.localIncomeTax)}`}
          />
          <CopyResultButton
            getText={() =>
              [
                `수령액 ${formatKRW(Number(freelancerAmount) || 0)}`,
                `원천징수(3.3%): ${formatKRW(result.totalTax)}`,
                `실수령액: ${formatKRW(result.netAmount)}`,
              ].join('\n')
            }
          />
        </div>
      )}
    </div>
  )
}
