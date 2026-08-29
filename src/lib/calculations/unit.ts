export type UnitCategory = 'area' | 'length' | 'weight'

export interface UnitDef {
  value: string
  label: string
}

export interface UnitCategoryDef {
  id: UnitCategory
  label: string
  units: UnitDef[]
}

export const UNIT_CATEGORIES: UnitCategoryDef[] = [
  {
    id: 'area',
    label: '면적',
    units: [
      { value: 'm2', label: '㎡' },
      { value: 'pyeong', label: '평' },
    ],
  },
  {
    id: 'length',
    label: '길이',
    units: [
      { value: 'mm', label: 'mm' },
      { value: 'cm', label: 'cm' },
      { value: 'm', label: 'm' },
      { value: 'km', label: 'km' },
      { value: 'inch', label: 'in' },
      { value: 'ft', label: 'ft' },
      { value: 'mile', label: 'mile' },
    ],
  },
  {
    id: 'weight',
    label: '무게',
    units: [
      { value: 'mg', label: 'mg' },
      { value: 'g', label: 'g' },
      { value: 'kg', label: 'kg' },
      { value: 'oz', label: 'oz' },
      { value: 'lb', label: 'lb' },
    ],
  },
]

/** 각 단위 1개가 카테고리 기준(base) 단위로 환산됐을 때의 값 (면적: ㎡, 길이: m, 무게: g) */
const FACTORS: Record<UnitCategory, Record<string, number>> = {
  area: { m2: 1, pyeong: 3.305785 },
  length: {
    mm: 0.001,
    cm: 0.01,
    m: 1,
    km: 1000,
    inch: 0.0254,
    ft: 0.3048,
    mile: 1609.344,
  },
  weight: {
    mg: 0.001,
    g: 1,
    kg: 1000,
    oz: 28.349523125,
    lb: 453.59237,
  },
}

export function convertUnit(
  category: UnitCategory,
  from: string,
  to: string,
  value: number,
): number {
  const factors = FACTORS[category]
  const base = value * factors[from]
  return base / factors[to]
}
