import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { Tabs } from '@/components/ui/tabs'
import { TopNavigation } from './TopNavigation'

describe('TopNavigation', () => {
  it('renders a tab for each calculator', () => {
    render(
      <Tabs value="loan">
        <TopNavigation />
      </Tabs>,
    )

    for (const label of ['대출', '예적금', '세금/연봉', '단위', '디데이']) {
      expect(screen.getByRole('tab', { name: label })).toBeInTheDocument()
    }
  })

  it('marks the active tab as selected', () => {
    render(
      <Tabs value="unit">
        <TopNavigation />
      </Tabs>,
    )

    expect(screen.getByRole('tab', { name: '단위' })).toHaveAttribute(
      'aria-selected',
      'true',
    )
    expect(screen.getByRole('tab', { name: '대출' })).toHaveAttribute(
      'aria-selected',
      'false',
    )
  })
})
