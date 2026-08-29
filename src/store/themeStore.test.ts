import { renderHook } from '@testing-library/react'
import { beforeEach, describe, expect, it } from 'vitest'
import { useSyncTheme, useThemeStore } from './themeStore'

describe('useThemeStore', () => {
  beforeEach(() => {
    localStorage.clear()
    useThemeStore.setState({ theme: 'light' })
  })

  it('starts in light mode', () => {
    expect(useThemeStore.getState().theme).toBe('light')
  })

  it('toggles between light and dark', () => {
    useThemeStore.getState().toggleTheme()
    expect(useThemeStore.getState().theme).toBe('dark')

    useThemeStore.getState().toggleTheme()
    expect(useThemeStore.getState().theme).toBe('light')
  })
})

describe('useSyncTheme', () => {
  beforeEach(() => {
    localStorage.clear()
    useThemeStore.setState({ theme: 'light' })
    document.documentElement.classList.remove('dark')
  })

  it('adds the dark class to <html> when the theme is dark', () => {
    useThemeStore.setState({ theme: 'dark' })
    renderHook(() => useSyncTheme())

    expect(document.documentElement.classList.contains('dark')).toBe(true)
  })

  it('removes the dark class from <html> when the theme is light', () => {
    document.documentElement.classList.add('dark')
    renderHook(() => useSyncTheme())

    expect(document.documentElement.classList.contains('dark')).toBe(false)
  })
})
