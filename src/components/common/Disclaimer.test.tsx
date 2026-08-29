import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { Disclaimer } from './Disclaimer'

describe('Disclaimer', () => {
  it('includes the current year in the disclaimer text', () => {
    render(<Disclaimer />)
    const year = new Date().getFullYear()
    expect(screen.getByText(new RegExp(`${year}년 기준`))).toBeInTheDocument()
  })
})
