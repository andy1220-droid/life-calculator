import { useState } from 'react'
import { Calculator } from 'lucide-react'
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
  calculateSavings,
  type CompoundMethod,
  type SavingsInput,
  type SavingsResult,
  type SavingsType,
  type TaxOption,
} from '@/lib/calculations/savings'
import { formatKRW } from '@/lib/format'
import { useHistoryStore } from '@/store/historyStore'
import type { HistoryEntry } from '@/types/history'

const COMPOUND_OPTIONS: { value: CompoundMethod; label: string }[] = [
  { value: 'simple', label: '단리' },
  { value: 'daily', label: '일복리' },
  { value: 'monthly', label: '월복리' },
  { value: 'annually', label: '연복리' },
]

const TAX_OPTIONS: { value: TaxOption; label: string }[] = [
  { value: 'general', label: '일반과세 (15.4%)' },
  { value: 'taxfree', label: '비과세' },
]

interface SavingsCalculatorProps {
  /** 히스토리에서 복원할 항목. App에서 key로 넘겨 선택이 바뀔 때만 마운트 시점에 반영됩니다. */
  initialEntry: HistoryEntry<SavingsInput, SavingsResult> | null
}

export function SavingsCalculator({ initialEntry }: SavingsCalculatorProps) {
  const addEntry = useHistoryStore((state) => state.addEntry)
  const [type, setType] = useState<SavingsType>(
    initialEntry?.input.type ?? 'lumpsum',
  )
  const [amount, setAmount] = useState(
    initialEntry ? String(initialEntry.input.amount) : '10000000',
  )
  const [periodMonths, setPeriodMonths] = useState(
    initialEntry ? String(initialEntry.input.periodMonths) : '12',
  )
  const [annualRatePercent, setAnnualRatePercent] = useState(
    initialEntry ? String(initialEntry.input.annualRatePercent) : '3.5',
  )
  const [compound, setCompound] = useState<CompoundMethod>(
    initialEntry?.input.compound ?? 'monthly',
  )
  const [taxOption, setTaxOption] = useState<TaxOption>(
    initialEntry?.input.taxOption ?? 'general',
  )
  const [result, setResult] = useState<SavingsResult | null>(
    initialEntry?.result ?? null,
  )

  const handleCalculate = () => {
    const input: SavingsInput = {
      type,
      amount: Number(amount) || 0,
      periodMonths: Number(periodMonths) || 0,
      annualRatePercent: Number(annualRatePercent) || 0,
      compound,
      taxOption,
    }
    const next = calculateSavings(input)
    setResult(next)

    const typeLabel = type === 'lumpsum' ? '거치식' : '적립식'
    const compoundLabel = COMPOUND_OPTIONS.find((c) => c.value === compound)?.label
    addEntry({
      calculatorId: 'savings',
      summary: `${typeLabel} · ${compoundLabel} · 만기 ${formatKRW(next.maturityAmount)}`,
      input,
      result: next,
    })
  }

  return (
    <div className="mx-auto flex max-w-md flex-col gap-4">
      <div className="inline-flex w-fit rounded-lg border p-1">
        <Button
          type="button"
          size="sm"
          variant={type === 'lumpsum' ? 'default' : 'ghost'}
          onClick={() => setType('lumpsum')}
        >
          거치식 (예금)
        </Button>
        <Button
          type="button"
          size="sm"
          variant={type === 'installment' ? 'default' : 'ghost'}
          onClick={() => setType('installment')}
        >
          적립식 (적금)
        </Button>
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="savings-amount">
          {type === 'lumpsum' ? '예치금 (원)' : '월 납입액 (원)'}
        </Label>
        <Input
          id="savings-amount"
          inputMode="numeric"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="savings-period">예치 기간 (개월)</Label>
          <Input
            id="savings-period"
            inputMode="numeric"
            value={periodMonths}
            onChange={(e) => setPeriodMonths(e.target.value)}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="savings-rate">연 이자율 (%)</Label>
          <Input
            id="savings-rate"
            inputMode="decimal"
            value={annualRatePercent}
            onChange={(e) => setAnnualRatePercent(e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-1.5">
          <Label>이자 계산 방식</Label>
          <Select
            value={compound}
            onValueChange={(v) => v && setCompound(v as CompoundMethod)}
          >
            <SelectTrigger className="w-full">
              <SelectValue>
                {(v: CompoundMethod) =>
                  COMPOUND_OPTIONS.find((c) => c.value === v)?.label ?? v
                }
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              {COMPOUND_OPTIONS.map((c) => (
                <SelectItem key={c.value} value={c.value}>
                  {c.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex flex-col gap-1.5">
          <Label>세금 우대</Label>
          <Select
            value={taxOption}
            onValueChange={(v) => v && setTaxOption(v as TaxOption)}
          >
            <SelectTrigger className="w-full">
              <SelectValue>
                {(v: TaxOption) =>
                  TAX_OPTIONS.find((t) => t.value === v)?.label ?? v
                }
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              {TAX_OPTIONS.map((t) => (
                <SelectItem key={t.value} value={t.value}>
                  {t.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <Button type="button" onClick={handleCalculate}>
        <Calculator className="size-4" />
        계산하기
      </Button>

      {result && (
        <div className="flex flex-col gap-3">
          <ResultCard
            label="만기 시 총 실수령액"
            value={formatKRW(result.maturityAmount)}
            emphasis
          />
          <div className="grid grid-cols-3 gap-3">
            <ResultCard label="원금 총액" value={formatKRW(result.principal)} />
            <ResultCard
              label="세전 이자"
              value={formatKRW(result.preTaxInterest)}
            />
            <ResultCard
              label="세후 이자"
              value={formatKRW(result.postTaxInterest)}
            />
          </div>
          <CopyResultButton
            getText={() => {
              const typeLabel = type === 'lumpsum' ? '거치식' : '적립식'
              const compoundLabel = COMPOUND_OPTIONS.find(
                (c) => c.value === compound,
              )?.label
              return [
                `${typeLabel} · ${compoundLabel} (연 ${annualRatePercent}%, ${periodMonths}개월)`,
                `원금 총액: ${formatKRW(result.principal)}`,
                `세후 이자: ${formatKRW(result.postTaxInterest)}`,
                `만기 시 총 실수령액: ${formatKRW(result.maturityAmount)}`,
              ].join('\n')
            }}
          />
        </div>
      )}
    </div>
  )
}
