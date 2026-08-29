import { useState } from 'react'
import dayjs from 'dayjs'
import { CalendarIcon, Save } from 'lucide-react'
import { CopyResultButton } from '@/components/common/CopyResultButton'
import { ResultCard } from '@/components/common/ResultCard'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Label } from '@/components/ui/label'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { calculateDday } from '@/lib/calculations/dday'
import { useHistoryStore } from '@/store/historyStore'
import type { HistoryEntry } from '@/types/history'

export interface DdayCalculatorInput {
  baseDate: string
  targetDate: string
}

export interface DdayCalculatorResult {
  diffDays: number
  label: string
}

interface DdayCalculatorProps {
  /** 히스토리에서 복원할 항목. App에서 key로 넘겨 선택이 바뀔 때만 마운트 시점에 반영됩니다. */
  initialEntry: HistoryEntry<DdayCalculatorInput, DdayCalculatorResult> | null
}

export function DdayCalculator({ initialEntry }: DdayCalculatorProps) {
  const addEntry = useHistoryStore((state) => state.addEntry)
  const [baseDate, setBaseDate] = useState(
    () => initialEntry?.input.baseDate ?? dayjs().format('YYYY-MM-DD'),
  )
  const [targetDate, setTargetDate] = useState<string | null>(
    initialEntry?.input.targetDate ?? null,
  )
  const [baseOpen, setBaseOpen] = useState(false)
  const [targetOpen, setTargetOpen] = useState(false)

  const result = targetDate ? calculateDday(baseDate, targetDate) : null

  const handleSave = () => {
    if (!result || !targetDate) return
    addEntry({
      calculatorId: 'dday',
      summary: `${dayjs(targetDate).format('YYYY.MM.DD')} · ${result.label}`,
      input: { baseDate, targetDate },
      result,
    })
  }

  return (
    <div className="mx-auto flex max-w-md flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <Label>기준일</Label>
        <Popover open={baseOpen} onOpenChange={setBaseOpen}>
          <PopoverTrigger
            render={
              <Button
                variant="outline"
                className="w-full justify-start font-normal"
              />
            }
          >
            <CalendarIcon className="size-4" />
            {dayjs(baseDate).format('YYYY년 MM월 DD일')}
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={dayjs(baseDate).toDate()}
              onSelect={(date) => {
                if (!date) return
                setBaseDate(dayjs(date).format('YYYY-MM-DD'))
                setBaseOpen(false)
              }}
            />
          </PopoverContent>
        </Popover>
      </div>

      <div className="flex flex-col gap-1.5">
        <Label>목표 날짜</Label>
        <Popover open={targetOpen} onOpenChange={setTargetOpen}>
          <PopoverTrigger
            render={
              <Button
                variant="outline"
                className="w-full justify-start font-normal"
              />
            }
          >
            <CalendarIcon className="size-4" />
            {targetDate
              ? dayjs(targetDate).format('YYYY년 MM월 DD일')
              : '날짜를 선택하세요'}
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={targetDate ? dayjs(targetDate).toDate() : undefined}
              onSelect={(date) => {
                if (!date) return
                setTargetDate(dayjs(date).format('YYYY-MM-DD'))
                setTargetOpen(false)
              }}
            />
          </PopoverContent>
        </Popover>
      </div>

      <ResultCard
        label={result && result.diffDays < 0 ? '지난 일수' : '남은 일수'}
        value={result ? result.label : '-'}
        emphasis
      />

      <div className="flex gap-2">
        <Button
          type="button"
          variant="outline"
          className="flex-1"
          onClick={handleSave}
          disabled={!result}
        >
          <Save className="size-4" />
          기록에 저장
        </Button>
        {result && targetDate && (
          <CopyResultButton
            getText={() =>
              `${dayjs(targetDate).format('YYYY.MM.DD')}까지 ${result.label} (기준일 ${dayjs(baseDate).format('YYYY.MM.DD')})`
            }
          />
        )}
      </div>
    </div>
  )
}
