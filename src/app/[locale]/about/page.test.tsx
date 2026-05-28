import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'

vi.mock('next-intl/server', () => ({
  getTranslations: async () => (key: string, values?: Record<string, unknown>) => {
    if (!values) return key
    return Object.entries(values).reduce(
      (str, [k, v]) => str.replace(`{${k}}`, String(v)),
      key,
    )
  },
  getMessages: async () => ({}),
  getLocale: async () => 'en',
}))
vi.mock('next-intl', () => ({ useTranslations: () => (key: string) => key }))
vi.mock('@/navigation', () => ({
  useRouter: () => ({ push: vi.fn(), back: vi.fn() }),
  usePathname: () => '/',
  Link: ({ href, children, ...rest }: { href: string; children: React.ReactNode; [key: string]: unknown }) =>
    <a href={href} {...(rest as React.AnchorHTMLAttributes<HTMLAnchorElement>)}>{children}</a>,
}))

import AboutPage from './page'

describe('AboutPage', () => {
  it('renders the About heading', async () => {
    render(await AboutPage())
    const h1 = screen.getByRole('heading', { level: 1 })
    expect(h1).toBeTruthy()
  })

  it('renders the intro title key', async () => {
    render(await AboutPage())
    expect(screen.getByText('introTitle')).toBeTruthy()
  })

  it('renders the three pillar title keys', async () => {
    render(await AboutPage())
    expect(screen.getByText('pillar01Title')).toBeTruthy()
    expect(screen.getByText('pillar02Title')).toBeTruthy()
    expect(screen.getByText('pillar03Title')).toBeTruthy()
  })

  it('renders the closing title key', async () => {
    render(await AboutPage())
    expect(screen.getByText('closingTitle')).toBeTruthy()
  })
})
