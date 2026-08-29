import { useState } from 'react'
import { Disclaimer } from '@/components/common/Disclaimer'
import { HistoryPanel } from '@/components/common/HistoryPanel'
import { Header } from '@/components/layout/Header'
import { TopNavigation } from '@/components/layout/TopNavigation'
import { Tabs, TabsContent } from '@/components/ui/tabs'
import {
  DdayCalculator,
  type DdayCalculatorInput,
  type DdayCalculatorResult,
} from '@/features/dday/DdayCalculator'
import { LoanCalculator } from '@/features/loan/LoanCalculator'
import { SavingsCalculator } from '@/features/savings/SavingsCalculator'
import { TaxCalculator } from '@/features/tax/TaxCalculator'
import {
  UnitCalculator,
  type UnitCalculatorInput,
  type UnitCalculatorResult,
} from '@/features/unit/UnitCalculator'
import type { LoanInput, LoanResult } from '@/lib/calculations/loan'
import type { SavingsInput, SavingsResult } from '@/lib/calculations/savings'
import type { TaxInput, TaxResult } from '@/lib/calculations/tax'
import { useSyncTheme } from '@/store/themeStore'
import { type CalculatorId } from '@/types/calculator'
import type { HistoryEntry } from '@/types/history'

function App() {
  useSyncTheme()
  const [activeTab, setActiveTab] = useState<CalculatorId>('loan')
  const [selectedEntry, setSelectedEntry] = useState<HistoryEntry | null>(null)

  const handleSelectEntry = (entry: HistoryEntry) => {
    setActiveTab(entry.calculatorId)
    setSelectedEntry(entry)
  }

  function entryFor<TInput, TResult>(
    calculatorId: CalculatorId,
  ): HistoryEntry<TInput, TResult> | null {
    if (selectedEntry?.calculatorId !== calculatorId) return null
    return selectedEntry as HistoryEntry<TInput, TResult>
  }

  const loanEntry = entryFor<LoanInput, LoanResult>('loan')
  const savingsEntry = entryFor<SavingsInput, SavingsResult>('savings')
  const taxEntry = entryFor<TaxInput, TaxResult>('tax')
  const unitEntry = entryFor<UnitCalculatorInput, UnitCalculatorResult>('unit')
  const ddayEntry = entryFor<DdayCalculatorInput, DdayCalculatorResult>('dday')

  return (
    <div className="flex min-h-svh flex-col">
      <Header />
      <Tabs
        value={activeTab}
        onValueChange={(value) => setActiveTab(value as CalculatorId)}
        className="flex flex-1 flex-col"
      >
        <div className="border-b px-4">
          <TopNavigation />
        </div>
        <main className="flex-1 px-4 py-6">
          <TabsContent value="loan" keepMounted>
            <LoanCalculator key={loanEntry?.id ?? 'loan'} initialEntry={loanEntry} />
          </TabsContent>
          <TabsContent value="savings" keepMounted>
            <SavingsCalculator
              key={savingsEntry?.id ?? 'savings'}
              initialEntry={savingsEntry}
            />
          </TabsContent>
          <TabsContent value="tax" keepMounted>
            <TaxCalculator key={taxEntry?.id ?? 'tax'} initialEntry={taxEntry} />
          </TabsContent>
          <TabsContent value="unit" keepMounted>
            <UnitCalculator key={unitEntry?.id ?? 'unit'} initialEntry={unitEntry} />
          </TabsContent>
          <TabsContent value="dday" keepMounted>
            <DdayCalculator key={ddayEntry?.id ?? 'dday'} initialEntry={ddayEntry} />
          </TabsContent>
        </main>
      </Tabs>
      <Disclaimer />
      <HistoryPanel onSelectEntry={handleSelectEntry} />
    </div>
  )
}

export default App
