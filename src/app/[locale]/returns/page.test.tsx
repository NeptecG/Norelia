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

import ReturnsPage from './page'

describe('ReturnsPage', () => {
  it('renders the heading key', async () => {
    render(await ReturnsPage())
    const h1 = screen.getByRole('heading', { level: 1 })
    expect(h1).toBeTruthy()
    expect(h1.textContent).toMatch(/heading/i)
  })

  it('renders section1Title key', async () => {
    render(await ReturnsPage())
    expect(screen.getByText('section1Title')).toBeTruthy()
  })

  it('renders section3Title key', async () => {
    render(await ReturnsPage())
    expect(screen.getByText('section3Title')).toBeTruthy()
  })
})
