export function Disclaimer() {
  const year = new Date().getFullYear()

  return (
    <p className="border-t px-4 py-3 pr-20 text-center text-xs text-muted-foreground">
      본 계산 결과는 {year}년 기준 세율·요율을 참고한 단순 추정치이며 실제 금액과
      차이가 있을 수 있습니다. 정확한 금액은 관련 기관 또는 전문가를 통해
      확인해 주세요.
    </p>
  )
}
