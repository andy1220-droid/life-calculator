import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it } from 'vitest'
import { SavingsCalculator } from './SavingsCalculator'

describe('SavingsCalculator', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('shows no result before calculating', () => {
    render(<SavingsCalculator initialEntry={null} />)
    expect(screen.queryByText('만기 시 총 실수령액')).not.toBeInTheDocument()
  })

  it('computes and displays the result for the default (거치식/월복리) inputs', async () => {
    const user = userEvent.setup()
    render(<SavingsCalculator initialEntry={null} />)

    await user.click(screen.getByRole('button', { name: '계산하기' }))

    // 1천만원 / 연 3.5% / 12개월 / 월복리 / 일반과세 — lib/calculations/savings.test.ts와 별개로
    // 직접 계산해 검증된 값
    expect(screen.getByText('만기 시 총 실수령액')).toBeInTheDocument()
    expect(screen.getByText('10,300,896원')).toBeInTheDocument()
    expect(screen.getByText('10,000,000원')).toBeInTheDocument()
  })

  it('switches to 적립식 and updates the amount label', async () => {
    const user = userEvent.setup()
    render(<SavingsCalculator initialEntry={null} />)

    await user.click(screen.getByRole('button', { name: '적립식 (적금)' }))

    expect(screen.getByLabelText('월 납입액 (원)')).toBeInTheDocument()
  })
})
