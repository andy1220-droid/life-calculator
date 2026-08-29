import { TabsList, TabsTrigger } from '@/components/ui/tabs'
import { CALCULATOR_TABS } from '@/types/calculator'

/** Tabs 루트 내부에서 사용하는 가로 탭 메뉴. 모바일에서는 가로 스와이프로 스크롤됩니다. */
export function TopNavigation() {
  return (
    <TabsList className="h-11 w-full justify-start overflow-x-auto">
      {CALCULATOR_TABS.map((tab) => (
        <TabsTrigger key={tab.id} value={tab.id}>
          {tab.label}
        </TabsTrigger>
      ))}
    </TabsList>
  )
}
