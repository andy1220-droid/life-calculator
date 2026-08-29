import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it } from 'vitest'
import { DdayCalculator } from './DdayCalculator'

describe('DdayCalculator', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('shows a placeholder result and a disabled save button before a target date is picked', () => {
    render(<DdayCalculator initialEntry={null} />)
    expect(screen.getByText('-')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /기록에 저장/ })).toBeDisabled()
  })

  it('computes and shows a D-day label once a target date is picked', async () => {
    const user = userEvent.setup()
    render(<DdayCalculator initialEntry={null} />)

    await user.click(screen.getByRole('button', { name: /날짜를 선택하세요/ }))

    const dayButtons = await screen.findAllByRole('button', {
      name: /^(Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday)/,
    })
    await user.click(dayButtons[0])

    // 어떤 날짜를 고르든 결과 라벨이 D-day 형식으로 바뀌고 저장 버튼이 활성화된다
    expect(screen.getByText(/^D[-+](DAY|\d+)$/)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /기록에 저장/ })).toBeEnabled()
  })
})
