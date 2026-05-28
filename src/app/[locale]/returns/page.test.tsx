import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'

vi.mock('next-intl', () => ({ useTranslations: () => (key: string) => key }))
vi.mock('@/navigation', () => ({
  useRouter: () => ({ push: vi.fn(), back: vi.fn() }),
  usePathname: () => '/',
  Link: ({ href, children, ...rest }: { href: string; children: React.ReactNode; [key: string]: unknown }) =>
    <a href={href} {...(rest as React.AnchorHTMLAttributes<HTMLAnchorElement>)}>{children}</a>,
}))

import ReturnsPage from './page'

describe('ReturnsPage', () => {
  it('renders the RETURNS heading', async () => {
    render(await ReturnsPage())
    const h1 = screen.getByRole('heading', { level: 1 })
    expect(h1).toBeTruthy()
    expect(h1.textContent).toMatch(/RETURNS/i)
    expect(h1.textContent).toMatch(/EXCHANGES/i)
  })

  it('renders Return Policy section', async () => {
    render(await ReturnsPage())
    expect(screen.getByText('Return Policy')).toBeTruthy()
  })

  it('renders Exchanges section', async () => {
    render(await ReturnsPage())
    expect(screen.getByText('Exchanges')).toBeTruthy()
  })
})
