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

describe('ShippingPage', () => {
  it('renders the heading key', async () => {
    render(await ShippingPage())
    expect(screen.getByRole('heading', { level: 1 })).toBeTruthy()
    expect(screen.getByText('heading')).toBeTruthy()
  })

  it('renders method1Title key', async () => {
    render(await ShippingPage())
    expect(screen.getByText('method1Title')).toBeTruthy()
  })

  it('renders method2Title key', async () => {
    render(await ShippingPage())
    expect(screen.getByText('method2Title')).toBeTruthy()
  })
})
