import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'

vi.mock('next-intl', () => ({ useTranslations: () => (key: string) => key }))
vi.mock('@/navigation', () => ({
  useRouter: () => ({ push: vi.fn(), back: vi.fn() }),
  usePathname: () => '/',
  Link: ({ href, children, ...rest }: { href: string; children: React.ReactNode; [key: string]: unknown }) =>
    <a href={href} {...(rest as React.AnchorHTMLAttributes<HTMLAnchorElement>)}>{children}</a>,
}))

import AboutPage from './page'

describe('AboutPage', () => {
  it('renders the About NORELIA heading', async () => {
    render(await AboutPage())
    const h1 = screen.getByRole('heading', { level: 1 })
    expect(h1).toBeTruthy()
    expect(h1.textContent).toMatch(/About/i)
    expect(h1.textContent).toMatch(/NORELIA/i)
  })

  it('renders the Born in the West of Greece intro', async () => {
    render(await AboutPage())
    expect(screen.getByText('Born in the West of Greece.')).toBeTruthy()
  })

  it('renders the three pillars', async () => {
    render(await AboutPage())
    expect(screen.getByText('Design First')).toBeTruthy()
    expect(screen.getByText('Made to Last')).toBeTruthy()
    expect(screen.getByText('Your Way')).toBeTruthy()
  })

  it('renders the closing section', async () => {
    render(await AboutPage())
    expect(screen.getByText('Still just getting started.')).toBeTruthy()
  })
})
