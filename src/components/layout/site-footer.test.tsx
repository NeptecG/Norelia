import React from 'react'
import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'

vi.mock('next/link', () => ({
  default: ({ href, children }: { href: string; children: React.ReactNode }) =>
    <a href={href}>{children}</a>,
}))

import { SiteFooter } from './site-footer'

describe('SiteFooter', () => {
  it('renders brand name NORELIA.', () => {
    render(<SiteFooter />)
    expect(screen.getByText('NORELIA.')).toBeTruthy()
  })
  it('renders Size Guide link', () => {
    render(<SiteFooter />)
    expect(document.querySelector('a[href="/size-guide"]')).toBeTruthy()
  })
  it('renders Our Studio link', () => {
    render(<SiteFooter />)
    expect(document.querySelector('a[href="/our-studio"]')).toBeTruthy()
  })
  it('renders contact email', () => {
    render(<SiteFooter />)
    expect(screen.getByText(/hello@norelia\.com/i)).toBeTruthy()
  })
})
