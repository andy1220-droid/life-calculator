import { Moon, Sun } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useThemeStore } from '@/store/themeStore'

export function Header() {
  const theme = useThemeStore((state) => state.theme)
  const toggleTheme = useThemeStore((state) => state.toggleTheme)

  return (
    <header className="flex items-center justify-between border-b px-4 py-3">
      <h1 className="text-lg font-bold">라이프 계산기</h1>
      <Button
        variant="ghost"
        size="icon"
        onClick={toggleTheme}
        aria-label="다크 모드 전환"
      >
        {theme === 'dark' ? (
          <Sun className="size-5" />
        ) : (
          <Moon className="size-5" />
        )}
      </Button>
    </header>
  )
}
