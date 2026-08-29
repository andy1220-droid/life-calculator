import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { HistoryEntry } from '@/types/history'

const MAX_ENTRIES = 10

interface HistoryState {
  entries: HistoryEntry[]
  addEntry: (entry: Omit<HistoryEntry, 'id' | 'createdAt'>) => void
  clearHistory: () => void
}

export const useHistoryStore = create<HistoryState>()(
  persist(
    (set) => ({
      entries: [],
      addEntry: (entry) =>
        set((state) => ({
          entries: [
            {
              ...entry,
              id: crypto.randomUUID(),
              createdAt: new Date().toISOString(),
            },
            ...state.entries,
          ].slice(0, MAX_ENTRIES),
        })),
      clearHistory: () => set({ entries: [] }),
    }),
    { name: 'life-calculator-history' },
  ),
)
