import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { ResultCard } from './ResultCard'

describe('ResultCard', () => {
  it('renders the label and value', () => {
    render(<ResultCard label="월 상환액" value="1,520,056원" />)
    expect(screen.getByText('월 상환액')).toBeInTheDocument()
    expect(screen.getByText('1,520,056원')).toBeInTheDocument()
  })

  it('renders an optional description', () => {
    render(
      <ResultCard label="원천징수 세액" value="33,000원" description="3.3%" />,
    )
    expect(screen.getByText('3.3%')).toBeInTheDocument()
  })

  it('omits the description when none is given', () => {
    render(<ResultCard label="총 이자액" value="247,220,145원" />)
    expect(screen.queryByText('3.3%')).not.toBeInTheDocument()
  })

  it('applies a larger emphasis style when emphasis is set', () => {
    render(<ResultCard label="만기 실수령액" value="121,644,488원" emphasis />)
    expect(screen.getByText('121,644,488원')).toHaveClass('text-3xl')
  })
})
