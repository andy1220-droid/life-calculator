import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { useHistoryStore } from '@/store/historyStore'
import { HistoryPanel } from './HistoryPanel'

describe('HistoryPanel', () => {
  beforeEach(() => {
    localStorage.clear()
    useHistoryStore.setState({ entries: [] })
  })

  it('shows an empty-state message when there is no history', async () => {
    const user = userEvent.setup()
    render(<HistoryPanel onSelectEntry={vi.fn()} />)

    await user.click(screen.getByRole('button', { name: '계산 기록 보기' }))

    expect(screen.getByText('아직 계산 기록이 없습니다.')).toBeInTheDocument()
  })

  it('lists saved entries and calls onSelectEntry when one is clicked', async () => {
    useHistoryStore.getState().addEntry({
      calculatorId: 'loan',
      summary: '300,000,000원 · 원리금균등 · 총이자 247,220,145원',
      input: {},
      result: {},
    })

    const onSelectEntry = vi.fn()
    const user = userEvent.setup()
    render(<HistoryPanel onSelectEntry={onSelectEntry} />)

    await user.click(screen.getByRole('button', { name: '계산 기록 보기' }))
    expect(
      screen.getByText('300,000,000원 · 원리금균등 · 총이자 247,220,145원'),
    ).toBeInTheDocument()

    await user.click(
      screen.getByText('300,000,000원 · 원리금균등 · 총이자 247,220,145원'),
    )

    expect(onSelectEntry).toHaveBeenCalledTimes(1)
    expect(onSelectEntry.mock.calls[0][0]).toMatchObject({
      calculatorId: 'loan',
    })
  })
})
