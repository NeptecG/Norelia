import React from 'react'
import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'

vi.mock('next-intl/server', () => ({
  getTranslations: async () => (key: string, values?: Record<string, unknown>) => {
    if (key === 'copyright') return `© ${values?.year ?? ''} Norelia. All rights reserved.`
    return key
  },
}))

import { SiteFooter } from './site-footer'

describe('SiteFooter', () => {
  it('renders brand name NORELIA.', async () => {
    render(await SiteFooter())
    expect(screen.getByText('NORELIA.')).toBeTruthy()
  })
  it('renders Size Guide link', async () => {
    render(await SiteFooter())
    expect(document.querySelector('a[href="/size-guide"]')).toBeTruthy()
  })
  it('renders Our Studio link', async () => {
    render(await SiteFooter())
    expect(document.querySelector('a[href="/our-studio"]')).toBeTruthy()
  })
  it('renders contact email', async () => {
    render(await SiteFooter())
    expect(screen.getByText(/hello@norelia\.com/i)).toBeTruthy()
  })
})
