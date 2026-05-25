import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Marquee } from './marquee'

vi.mock('@/lib/constants', () => ({ MARQUEE_TEXT: 'TEST MARQUEE TEXT' }))

describe('Marquee', () => {
  it('renders the default MARQUEE_TEXT content', () => {
    render(<Marquee />)
    const elements = screen.getAllByText(/TEST MARQUEE TEXT/)
    expect(elements.length).toBeGreaterThan(0)
  })

  it('renders custom text when passed', () => {
    render(<Marquee text="CUSTOM TEXT" />)
    const elements = screen.getAllByText(/CUSTOM TEXT/)
    expect(elements.length).toBeGreaterThan(0)
  })

  it('dark variant has bg-surface-alt class', () => {
    const { container } = render(<Marquee dark />)
    const wrapper = container.firstElementChild
    expect(wrapper?.className).toContain('bg-surface-alt')
  })

  it('light variant (default) has bg-surface class', () => {
    const { container } = render(<Marquee />)
    const wrapper = container.firstElementChild
    expect(wrapper?.className).toContain('bg-surface')
    expect(wrapper?.className).not.toContain('bg-surface-alt')
  })
})
