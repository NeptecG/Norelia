import React from 'react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'

vi.mock('@/stores/ui-store', () => ({
  useUIStore: vi.fn(() => ({
    toast: { msg: '', visible: false, type: 'add' },
  })),
}))

vi.mock('motion/react', () => ({
  motion: {
    div: ({ children, ...rest }: { children: React.ReactNode; [key: string]: unknown }) =>
      <div {...(rest as React.HTMLAttributes<HTMLDivElement>)}>{children}</div>,
  },
  AnimatePresence: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  useReducedMotion: () => false,
}))

import { useUIStore } from '@/stores/ui-store'
import { Toast } from './toast'

describe('Toast', () => {
  beforeEach(() => {
    vi.mocked(useUIStore).mockReturnValue({
      toast: { msg: '', visible: false, type: 'add' },
    } as ReturnType<typeof useUIStore>)
  })

  it('renders nothing when toast is not visible', () => {
    const { container } = render(<Toast />)
    expect(container.querySelector('[role="status"]')).toBeNull()
  })

  it('renders message when toast is visible', () => {
    vi.mocked(useUIStore).mockReturnValue({
      toast: { msg: 'Added to cart', visible: true, type: 'add' },
    } as ReturnType<typeof useUIStore>)
    render(<Toast />)
    expect(screen.getByRole('status')).toBeTruthy()
    expect(screen.getByText('Added to cart')).toBeTruthy()
  })

  it('applies success border class on add type', () => {
    vi.mocked(useUIStore).mockReturnValue({
      toast: { msg: 'Added to cart', visible: true, type: 'add' },
    } as ReturnType<typeof useUIStore>)
    render(<Toast />)
    const toast = screen.getByRole('status')
    expect(toast.className).toContain('border-l-success')
  })

  it('applies destructive border class on remove type', () => {
    vi.mocked(useUIStore).mockReturnValue({
      toast: { msg: 'Removed', visible: true, type: 'remove' },
    } as ReturnType<typeof useUIStore>)
    render(<Toast />)
    const toast = screen.getByRole('status')
    expect(toast.className).toContain('border-l-destructive')
  })
})
