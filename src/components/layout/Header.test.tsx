import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it } from 'vitest'
import { useThemeStore } from '@/store/themeStore'
import { Header } from './Header'

describe('Header', () => {
  beforeEach(() => {
    localStorage.clear()
    useThemeStore.setState({ theme: 'light' })
  })

  it('renders the service title', () => {
    render(<Header />)
    expect(screen.getByText('라이프 계산기')).toBeInTheDocument()
  })

  it('toggles the theme store when the button is clicked', async () => {
    const user = userEvent.setup()
    render(<Header />)

    await user.click(screen.getByRole('button', { name: '다크 모드 전환' }))
    expect(useThemeStore.getState().theme).toBe('dark')

    await user.click(screen.getByRole('button', { name: '다크 모드 전환' }))
    expect(useThemeStore.getState().theme).toBe('light')
  })
})
