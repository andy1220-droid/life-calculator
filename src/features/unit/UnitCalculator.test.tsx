import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it } from 'vitest'
import { UnitCalculator } from './UnitCalculator'

describe('UnitCalculator', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('shows the real-time conversion result for the default inputs', () => {
    render(<UnitCalculator initialEntry={null} />)
    // 기본값: 면적, 1㎡ → 평
    expect(screen.getByText('0.3025')).toBeInTheDocument()
  })

  it('recalculates the result as the value changes', async () => {
    const user = userEvent.setup()
    render(<UnitCalculator initialEntry={null} />)

    const input = screen.getByLabelText('값')
    await user.clear(input)
    await user.type(input, '10')

    expect(screen.getByText('3.025')).toBeInTheDocument()
  })

  it('swaps the from/to units and keeps the value', async () => {
    const user = userEvent.setup()
    render(<UnitCalculator initialEntry={null} />)

    await user.click(screen.getByRole('button', { name: '단위 바꾸기' }))

    // 1평 → ㎡ 이므로 결과가 3.3058 근처로 바뀐다
    expect(screen.getByText('3.3058')).toBeInTheDocument()
  })

  it('disables the save button until there is a valid result', async () => {
    const user = userEvent.setup()
    render(<UnitCalculator initialEntry={null} />)

    const input = screen.getByLabelText('값')
    await user.clear(input)

    expect(screen.getByRole('button', { name: /기록에 저장/ })).toBeDisabled()
  })
})
