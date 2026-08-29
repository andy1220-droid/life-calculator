import { describe, expect, it } from 'vitest'
import { convertUnit } from './unit'

describe('convertUnit', () => {
  it('converts ㎡ to 평', () => {
    expect(convertUnit('area', 'm2', 'pyeong', 1)).toBeCloseTo(1 / 3.305785, 9)
  })

  it('converts 평 to ㎡', () => {
    expect(convertUnit('area', 'pyeong', 'm2', 1)).toBeCloseTo(3.305785, 6)
  })

  it('is a no-op when converting a unit to itself', () => {
    expect(convertUnit('length', 'km', 'km', 42)).toBe(42)
  })

  it('converts km to m', () => {
    expect(convertUnit('length', 'km', 'm', 1)).toBeCloseTo(1000, 6)
  })

  it('converts inch to cm', () => {
    expect(convertUnit('length', 'inch', 'cm', 1)).toBeCloseTo(2.54, 6)
  })

  it('converts kg to lb', () => {
    expect(convertUnit('weight', 'kg', 'lb', 1)).toBeCloseTo(2.2046226, 6)
  })

  it('round-trips a value through two conversions', () => {
    const converted = convertUnit('weight', 'kg', 'oz', 5)
    const back = convertUnit('weight', 'oz', 'kg', converted)
    expect(back).toBeCloseTo(5, 9)
  })

  it('returns 0 for a 0 input', () => {
    expect(convertUnit('area', 'm2', 'pyeong', 0)).toBe(0)
  })
})
