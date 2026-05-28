import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'

vi.mock('next-intl', () => ({ useTranslations: () => (key: string) => key }))
vi.mock('@/navigation', () => ({
  useRouter: () => ({ push: vi.fn(), back: vi.fn() }),
  usePathname: () => '/',
  Link: ({ href, children, ...rest }: { href: string; children: React.ReactNode; [key: string]: unknown }) =>
    <a href={href} {...(rest as React.AnchorHTMLAttributes<HTMLAnchorElement>)}>{children}</a>,
}))

import ShippingPage from './page'

describe('ShippingPage', () => {
  it('renders the SHIPPING heading', async () => {
    render(await ShippingPage())
    expect(screen.getByRole('heading', { level: 1 })).toBeTruthy()
    expect(screen.getByText('SHIPPING')).toBeTruthy()
  })

  it('renders Standard Shipping section', async () => {
    render(await ShippingPage())
    expect(screen.getByText('Standard Shipping')).toBeTruthy()
  })

  it('renders Express Shipping section', async () => {
    render(await ShippingPage())
    expect(screen.getByText('Express Shipping')).toBeTruthy()
  })
})
