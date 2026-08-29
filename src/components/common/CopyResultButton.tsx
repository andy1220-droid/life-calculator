import { useState } from 'react'
import { Check, Copy } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface CopyResultButtonProps {
  getText: () => string
}

/** 계산 결과를 텍스트로 클립보드에 복사하는 공통 버튼. */
export function CopyResultButton({ getText }: CopyResultButtonProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(getText())
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    } catch {
      // 클립보드 권한이 없는 환경에서는 조용히 무시합니다.
    }
  }

  return (
    <Button type="button" variant="outline" onClick={handleCopy}>
      {copied ? <Check className="size-4" /> : <Copy className="size-4" />}
      {copied ? '복사됨' : '결과 복사'}
    </Button>
  )
}
