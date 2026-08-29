import { useState } from 'react'
import { History } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { useHistoryStore } from '@/store/historyStore'
import { CALCULATOR_TABS } from '@/types/calculator'
import type { HistoryEntry } from '@/types/history'

interface HistoryPanelProps {
  onSelectEntry: (entry: HistoryEntry) => void
}

/** 우측 하단 FAB으로 열리는 최근 계산 기록 패널. */
export function HistoryPanel({ onSelectEntry }: HistoryPanelProps) {
  const [open, setOpen] = useState(false)
  const entries = useHistoryStore((state) => state.entries)

  const handleSelect = (entry: HistoryEntry) => {
    onSelectEntry(entry)
    setOpen(false)
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger
        render={
          <Button
            size="icon"
            className="fixed right-6 bottom-6 z-50 size-12 rounded-full shadow-lg"
            aria-label="계산 기록 보기"
          />
        }
      >
        <History className="size-5" />
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-sm">
        <SheetHeader>
          <SheetTitle>최근 계산 기록</SheetTitle>
        </SheetHeader>
        <div className="flex flex-col gap-2 overflow-y-auto px-4 pb-4">
          {entries.length === 0 && (
            <p className="text-sm text-muted-foreground">
              아직 계산 기록이 없습니다.
            </p>
          )}
          {entries.map((entry) => (
            <button
              key={entry.id}
              type="button"
              onClick={() => handleSelect(entry)}
              className="rounded-md border p-3 text-left text-sm transition-colors hover:bg-accent"
            >
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>
                  {
                    CALCULATOR_TABS.find((tab) => tab.id === entry.calculatorId)
                      ?.label
                  }
                </span>
                <span>{new Date(entry.createdAt).toLocaleString('ko-KR')}</span>
              </div>
              <p className="mt-1 font-medium text-foreground">{entry.summary}</p>
            </button>
          ))}
        </div>
      </SheetContent>
    </Sheet>
  )
}
