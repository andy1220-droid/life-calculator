import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { CopyResultButton } from './CopyResultButton'

function mockClipboard() {
  const writeText = vi.fn().mockResolvedValue(undefined)
  Object.defineProperty(navigator, 'clipboard', {
    value: { writeText },
    configurable: true,
  })
  return writeText
}

describe('CopyResultButton', () => {
  beforeEach(() => {
    mockClipboard()
  })

  it('copies the text returned by getText to the clipboard', async () => {
    // userEvent.setup() installs its own clipboard stub, so apply ours after
    // it so the component actually calls the mock we assert against.
    const user = userEvent.setup()
    const writeText = mockClipboard()
    render(<CopyResultButton getText={() => '월 상환액: 1,520,056원'} />)

    await user.click(screen.getByRole('button', { name: '결과 복사' }))

    expect(writeText).toHaveBeenCalledWith('월 상환액: 1,520,056원')
  })

  it('shows a "복사됨" confirmation after copying', async () => {
    const user = userEvent.setup()
    render(<CopyResultButton getText={() => 'hello'} />)

    await user.click(screen.getByRole('button', { name: '결과 복사' }))

    await waitFor(() =>
      expect(screen.getByRole('button', { name: '복사됨' })).toBeInTheDocument(),
    )
  })
})
