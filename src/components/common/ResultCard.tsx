import { cn } from '@/lib/utils'

interface ResultCardProps {
  label: string
  value: string
  description?: string
  emphasis?: boolean
  className?: string
}

/** 계산 결과 한 항목을 보여주는 공통 카드. 핵심 수치는 emphasis로 크게 강조합니다. */
export function ResultCard({
  label,
  value,
  description,
  emphasis,
  className,
}: ResultCardProps) {
  return (
    <div className={cn('rounded-lg border bg-card p-4', className)}>
      <p className="text-sm text-muted-foreground">{label}</p>
      <p
        className={cn(
          'mt-1 font-semibold text-foreground',
          emphasis ? 'text-3xl text-primary' : 'text-xl',
        )}
      >
        {value}
      </p>
      {description && (
        <p className="mt-1 text-xs text-muted-foreground">{description}</p>
      )}
    </div>
  )
}
