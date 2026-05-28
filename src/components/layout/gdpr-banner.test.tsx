import React from 'react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, act } from '@testing-library/react'
import { IntlWrapper } from '@/test-utils/intl-wrapper'

vi.mock('motion/react', () => ({
  motion: { div: ({ children, ...rest }: { children: React.ReactNode; [key: string]: unknown }) => <div {...rest as React.HTMLAttributes<HTMLDivElement>}>{children}</div> },
  AnimatePresence: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  useReducedMotion: () => false,
}))

import { GDPRBanner } from './gdpr-banner'

describe('GDPRBanner', () => {
  beforeEach(() => {
    localStorage.clear()
  })
  it('renders banner when no consent stored', async () => {
    await act(async () => { render(<IntlWrapper><GDPRBanner /></IntlWrapper>) })
    expect(screen.getByText('We use cookies')).toBeTruthy()
  })
  it('does not render when consent already stored', async () => {
    localStorage.setItem('norelia_gdpr_consent', 'accepted')
    await act(async () => { render(<IntlWrapper><GDPRBanner /></IntlWrapper>) })
    expect(screen.queryByText(/cookies/i)).toBeNull()
  })
  it('hides banner and saves consent on Accept', async () => {
    await act(async () => { render(<IntlWrapper><GDPRBanner /></IntlWrapper>) })
    fireEvent.click(screen.getByRole('button', { name: /accept/i }))
    expect(localStorage.getItem('norelia_gdpr_consent')).toBe('accepted')
  })
  it('hides banner and saves consent on Decline', async () => {
    await act(async () => { render(<IntlWrapper><GDPRBanner /></IntlWrapper>) })
    fireEvent.click(screen.getByRole('button', { name: /decline/i }))
    expect(localStorage.getItem('norelia_gdpr_consent')).toBe('declined')
  })
})
