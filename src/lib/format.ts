export function formatKRW(value: number): string {
  return `${Math.round(value).toLocaleString('ko-KR')}원`
}

export function formatNumber(value: number, maximumFractionDigits = 2): string {
  return value.toLocaleString('ko-KR', { maximumFractionDigits })
}
