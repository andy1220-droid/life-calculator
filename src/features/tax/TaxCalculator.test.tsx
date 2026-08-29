import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it } from 'vitest'
import { TaxCalculator } from './TaxCalculator'

describe('TaxCalculator', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('shows no result before calculating', () => {
    render(<TaxCalculator initialEntry={null} />)
    expect(screen.queryByText('예상 월 실수령액')).not.toBeInTheDocument()
  })

  it('computes the 직장인 result for the default inputs', async () => {
    const user = userEvent.setup()
    render(<TaxCalculator initialEntry={null} />)

    await user.click(screen.getByRole('button', { name: '계산하기' }))

    // 연봉 5천만원 — lib/calculations/tax.test.ts에서 검증된 값
    expect(screen.getByText('예상 월 실수령액')).toBeInTheDocument()
    expect(screen.getByText('3,472,250원')).toBeInTheDocument()
  })

  it('switches to 프리랜서 mode and computes the 3.3% deduction', async () => {
    const user = userEvent.setup()
    render(<TaxCalculator initialEntry={null} />)

    await user.click(screen.getByRole('button', { name: '프리랜서' }))
    await user.click(screen.getByRole('button', { name: '계산하기' }))

    // 건당 수령액 1,000,000원 — lib/calculations/tax.test.ts에서 검증된 값
    expect(screen.getByText('실수령액')).toBeInTheDocument()
    expect(screen.getByText('967,000원')).toBeInTheDocument()
    expect(screen.getByText('33,000원')).toBeInTheDocument()
  })
})
