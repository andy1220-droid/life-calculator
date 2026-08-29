import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it } from 'vitest'
import { LoanCalculator } from './LoanCalculator'

describe('LoanCalculator', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('shows no result before calculating', () => {
    render(<LoanCalculator initialEntry={null} />)
    expect(screen.queryByText('월 상환액')).not.toBeInTheDocument()
  })

  it('computes and displays the result for the default (원리금균등) inputs', async () => {
    const user = userEvent.setup()
    render(<LoanCalculator initialEntry={null} />)

    await user.click(screen.getByRole('button', { name: '계산하기' }))

    // 3억원 / 연 4.5% / 360개월 원리금균등 — lib/calculations/loan.test.ts에서 검증된 값
    expect(screen.getByText('월 상환액')).toBeInTheDocument()
    expect(screen.getByText('1,520,056원')).toBeInTheDocument()
    expect(screen.getByText('247,220,145원')).toBeInTheDocument()
  })

  it('toggles the repayment schedule table', async () => {
    const user = userEvent.setup()
    render(<LoanCalculator initialEntry={null} />)

    await user.click(screen.getByRole('button', { name: '계산하기' }))
    expect(screen.queryByText('회차')).not.toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: /상환 스케줄표 보기/ }))
    expect(screen.getByText('회차')).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: /상환 스케줄표 숨기기/ }))
    expect(screen.queryByText('회차')).not.toBeInTheDocument()
  })
})
