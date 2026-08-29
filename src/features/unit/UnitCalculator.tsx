import { useState } from 'react'
import { ArrowLeftRight, Save } from 'lucide-react'
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
  convertUnit,
  UNIT_CATEGORIES,
  type UnitCategory,
} from '@/lib/calculations/unit'
import { formatNumber } from '@/lib/format'
import { useHistoryStore } from '@/store/historyStore'
import type { HistoryEntry } from '@/types/history'

export interface UnitCalculatorInput {
  category: UnitCategory
  from: string
  to: string
  value: number
}

export interface UnitCalculatorResult {
  result: number
}

interface UnitCalculatorProps {
  /** 히스토리에서 복원할 항목. App에서 key로 넘겨 선택이 바뀔 때만 마운트 시점에 반영됩니다. */
  initialEntry: HistoryEntry<UnitCalculatorInput, UnitCalculatorResult> | null
}

export function UnitCalculator({ initialEntry }: UnitCalculatorProps) {
  const addEntry = useHistoryStore((state) => state.addEntry)
  const [category, setCategory] = useState<UnitCategory>(
    initialEntry?.input.category ?? 'area',
  )
  const [fromUnit, setFromUnit] = useState(initialEntry?.input.from ?? 'm2')
  const [toUnit, setToUnit] = useState(initialEntry?.input.to ?? 'pyeong')
  const [valueStr, setValueStr] = useState(
    initialEntry ? String(initialEntry.input.value) : '1',
  )

  const currentCategory = UNIT_CATEGORIES.find((c) => c.id === category)
  const units = currentCategory?.units ?? []
  const value = Number(valueStr)
  const isValid = valueStr.trim() !== '' && !Number.isNaN(value)
  const result = isValid ? convertUnit(category, fromUnit, toUnit, value) : null

  const handleCategoryChange = (next: UnitCategory) => {
    setCategory(next)
    const nextUnits = UNIT_CATEGORIES.find((c) => c.id === next)?.units ?? []
    setFromUnit(nextUnits[0]?.value ?? '')
    setToUnit(nextUnits[1]?.value ?? nextUnits[0]?.value ?? '')
  }

  const handleSwap = () => {
    setFromUnit(toUnit)
    setToUnit(fromUnit)
  }

  const handleSave = () => {
    if (result === null) return
    const fromLabel = units.find((u) => u.value === fromUnit)?.label ?? fromUnit
    const toLabel = units.find((u) => u.value === toUnit)?.label ?? toUnit
    addEntry({
      calculatorId: 'unit',
      summary: `${currentCategory?.label ?? ''} · ${formatNumber(value)}${fromLabel} → ${formatNumber(result, 4)}${toLabel}`,
      input: { category, from: fromUnit, to: toUnit, value },
      result: { result },
    })
  }

  return (
    <div className="mx-auto flex max-w-md flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <Label>분류</Label>
        <Select
          value={category}
          onValueChange={(next) =>
            next && handleCategoryChange(next as UnitCategory)
          }
        >
          <SelectTrigger className="w-full">
            <SelectValue>
              {(v: UnitCategory) =>
                UNIT_CATEGORIES.find((c) => c.id === v)?.label ?? v
              }
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            {UNIT_CATEGORIES.map((c) => (
              <SelectItem key={c.id} value={c.id}>
                {c.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="unit-value">값</Label>
        <Input
          id="unit-value"
          inputMode="decimal"
          value={valueStr}
          onChange={(e) => setValueStr(e.target.value)}
        />
      </div>

      <div className="flex items-end gap-2">
        <div className="flex flex-1 flex-col gap-1.5">
          <Label>변환 전</Label>
          <Select
            value={fromUnit}
            onValueChange={(v) => v && setFromUnit(v)}
          >
            <SelectTrigger className="w-full">
              <SelectValue>
                {(v: string) => units.find((u) => u.value === v)?.label ?? v}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              {units.map((u) => (
                <SelectItem key={u.value} value={u.value}>
                  {u.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Button
          type="button"
          variant="outline"
          size="icon"
          onClick={handleSwap}
          aria-label="단위 바꾸기"
        >
          <ArrowLeftRight className="size-4" />
        </Button>
        <div className="flex flex-1 flex-col gap-1.5">
          <Label>변환 후</Label>
          <Select value={toUnit} onValueChange={(v) => v && setToUnit(v)}>
            <SelectTrigger className="w-full">
              <SelectValue>
                {(v: string) => units.find((u) => u.value === v)?.label ?? v}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              {units.map((u) => (
                <SelectItem key={u.value} value={u.value}>
                  {u.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <ResultCard
        label="변환 결과"
        value={result === null ? '-' : formatNumber(result, 4)}
        emphasis
      />

      <div className="flex gap-2">
        <Button
          type="button"
          variant="outline"
          className="flex-1"
          onClick={handleSave}
          disabled={result === null}
        >
          <Save className="size-4" />
          기록에 저장
        </Button>
        {result !== null && (
          <CopyResultButton
            getText={() => {
              const fromLabel =
                units.find((u) => u.value === fromUnit)?.label ?? fromUnit
              const toLabel =
                units.find((u) => u.value === toUnit)?.label ?? toUnit
              return `${formatNumber(value)}${fromLabel} = ${formatNumber(result, 4)}${toLabel}`
            }}
          />
        )}
      </div>
    </div>
  )
}
