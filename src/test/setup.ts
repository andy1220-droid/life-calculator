import { cleanup } from '@testing-library/react'
import '@testing-library/jest-dom/vitest'
import { afterEach } from 'vitest'

afterEach(() => {
  cleanup()
})

// Base UI/Floating UI 컴포넌트(Select, Popover 등)가 트리거 위치 측정을 위해
// 사용하는 ResizeObserver/matchMedia는 jsdom에 구현되어 있지 않아 테스트용 스텁을 둡니다.
class ResizeObserverStub {
  observe() {}
  unobserve() {}
  disconnect() {}
}

Object.defineProperty(globalThis, 'ResizeObserver', {
  value: globalThis.ResizeObserver ?? ResizeObserverStub,
  writable: true,
  configurable: true,
})

Object.defineProperty(window, 'matchMedia', {
  value:
    window.matchMedia ??
    ((query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: () => {},
      removeListener: () => {},
      addEventListener: () => {},
      removeEventListener: () => {},
      dispatchEvent: () => false,
    })),
  writable: true,
  configurable: true,
})
