import dayjs from 'dayjs'

export interface DdayResult {
  /** 목표일 - 기준일 (일 단위). 0이면 당일, 양수면 남은 일수, 음수면 지난 일수 */
  diffDays: number
  label: string
}

export function calculateDday(baseDate: string, targetDate: string): DdayResult {
  const base = dayjs(baseDate).startOf('day')
  const target = dayjs(targetDate).startOf('day')
  const diffDays = target.diff(base, 'day')

  let label: string
  if (diffDays === 0) label = 'D-DAY'
  else if (diffDays > 0) label = `D-${diffDays}`
  else label = `D+${Math.abs(diffDays)}`

  return { diffDays, label }
}
