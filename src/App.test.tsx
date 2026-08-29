import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it } from 'vitest'
import App from './App'
import { useHistoryStore } from './store/historyStore'
import { useThemeStore } from './store/themeStore'

describe('App', () => {
  beforeEach(() => {
    localStorage.clear()
    useThemeStore.setState({ theme: 'light' })
    useHistoryStore.setState({ entries: [] })
  })

  it('renders the header, disclaimer, and history button', () => {
    render(<App />)
    expect(screen.getByText('라이프 계산기')).toBeInTheDocument()
    expect(screen.getByText(/단순 추정치이며/)).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: '계산 기록 보기' }),
    ).toBeInTheDocument()
  })

  it('shows the 대출 calculator by default', () => {
    render(<App />)
    expect(screen.getByLabelText('대출 금액 (원)')).toBeInTheDocument()
  })

  it('switches panels when a different tab is clicked', async () => {
    const user = userEvent.setup()
    render(<App />)

    await user.click(screen.getByRole('tab', { name: '예적금' }))
    expect(screen.getByRole('button', { name: '거치식 (예금)' })).toBeInTheDocument()

    await user.click(screen.getByRole('tab', { name: '단위' }))
    expect(screen.getByLabelText('값')).toBeInTheDocument()
  })

  it('restores a history entry into its calculator and switches tabs', async () => {
    useHistoryStore.getState().addEntry({
      calculatorId: 'savings',
      summary: '거치식 · 월복리 · 만기 10,300,896원',
      input: {
        type: 'lumpsum',
        amount: 10_000_000,
        periodMonths: 12,
        annualRatePercent: 3.5,
        compound: 'monthly',
        taxOption: 'general',
      },
      result: {
        principal: 10_000_000,
        preTaxInterest: 355_670,
        postTaxInterest: 300_896,
        maturityAmount: 10_300_896,
      },
    })

    const user = userEvent.setup()
    render(<App />)

    await user.click(screen.getByRole('button', { name: '계산 기록 보기' }))
    await user.click(screen.getByText('거치식 · 월복리 · 만기 10,300,896원'))

    // 히스토리 선택 시 예적금 탭으로 전환되고 결과가 즉시 복원된다
    expect(screen.getByRole('tab', { name: '예적금' })).toHaveAttribute(
      'aria-selected',
      'true',
    )
    expect(screen.getByText('10,300,896원')).toBeInTheDocument()
  })
})
