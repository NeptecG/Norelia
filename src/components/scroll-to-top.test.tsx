import React from 'react'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, fireEvent, act } from '@testing-library/react'
import { IntlWrapper } from '@/test-utils/intl-wrapper'

vi.mock('motion/react', () => ({
  motion: {
    button: ({ children, onClick, className, 'aria-label': ariaLabel }: React.ButtonHTMLAttributes<HTMLButtonElement> & { 'aria-label'?: string }) =>
      <button onClick={onClick} className={className} aria-label={ariaLabel}>{children}</button>,
  },
  AnimatePresence: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  useReducedMotion: () => false,
}))

import { ScrollToTop } from './scroll-to-top'

describe('ScrollToTop', () => {
  beforeEach(() => {
    Object.defineProperty(window, 'scrollY', { writable: true, configurable: true, value: 0 })
  })
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('is not visible when scrollY is 0', () => {
    render(<IntlWrapper><ScrollToTop /></IntlWrapper>)
    expect(screen.queryByRole('button', { name: /scroll to top/i })).toBeNull()
  })

  it('becomes visible after scrolling past 300px', () => {
    render(<IntlWrapper><ScrollToTop /></IntlWrapper>)
    act(() => {
      Object.defineProperty(window, 'scrollY', { value: 400 })
      window.dispatchEvent(new Event('scroll'))
    })
    expect(screen.getByRole('button', { name: /scroll to top/i })).toBeTruthy()
  })

  it('calls window.scrollTo on click', () => {
    const scrollTo = vi.fn()
    window.scrollTo = scrollTo as typeof window.scrollTo
    render(<IntlWrapper><ScrollToTop /></IntlWrapper>)
    act(() => {
      Object.defineProperty(window, 'scrollY', { value: 400 })
      window.dispatchEvent(new Event('scroll'))
    })
    fireEvent.click(screen.getByRole('button', { name: /scroll to top/i }))
    expect(scrollTo).toHaveBeenCalledWith({ top: 0, behavior: 'smooth' })
  })
})
