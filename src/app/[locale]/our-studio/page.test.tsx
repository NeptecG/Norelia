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

import OurStudioPage from './page'

describe('OurStudioPage', () => {
  it('renders the heading key', async () => {
    render(await OurStudioPage())
    const h1 = screen.getByRole('heading', { level: 1 })
    expect(h1).toBeTruthy()
    expect(h1.textContent).toMatch(/heading/i)
  })

  it('renders address2 key (contains Preveza)', async () => {
    render(await OurStudioPage())
    expect(screen.getByText('address2')).toBeTruthy()
  })

  it('renders map iframe', async () => {
    render(await OurStudioPage())
    expect(document.querySelector('iframe')).toBeTruthy()
  })

  it('renders contact info', async () => {
    render(await OurStudioPage())
    expect(screen.getByText('hello@norelia.com')).toBeTruthy()
  })
})
