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

import ShippingPage from './page'

describe('Shipping & Returns page', () => {
  it('renders the combined heading', async () => {
    render(await ShippingPage())
    const h1 = screen.getByRole('heading', { level: 1 })
    expect(h1.textContent).toMatch(/combinedheading/i)
  })

  it('renders the shipping methods', async () => {
    render(await ShippingPage())
    expect(screen.getByText('method1Title')).toBeTruthy()
    expect(screen.getByText('method3Title')).toBeTruthy()
  })

  it('renders the returns sections', async () => {
    render(await ShippingPage())
    expect(screen.getByText('section1Title')).toBeTruthy()
    expect(screen.getByText('section5Title')).toBeTruthy()
  })
})
