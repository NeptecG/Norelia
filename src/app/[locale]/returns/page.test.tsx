import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'

vi.mock('next/navigation', () => ({
  useRouter:   () => ({ back: vi.fn(), push: vi.fn() }),
  usePathname: () => '/',
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
