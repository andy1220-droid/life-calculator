import { describe, expect, it } from 'vitest'
import { CALCULATOR_TABS } from './calculator'

describe('CALCULATOR_TABS', () => {
  it('lists the 5 calculators in the PRD-specified order', () => {
    expect(CALCULATOR_TABS.map((tab) => tab.id)).toEqual([
      'loan',
      'savings',
      'tax',
      'unit',
      'dday',
    ])
  })

  it('gives every tab a Korean label', () => {
    for (const tab of CALCULATOR_TABS) {
      expect(tab.label.length).toBeGreaterThan(0)
    }
  })
})
