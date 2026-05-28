import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'

vi.mock('next/navigation', () => ({
  useRouter:   () => ({ back: vi.fn(), push: vi.fn() }),
  usePathname: () => '/',
}))

import OurStudioPage from './page'

describe('OurStudioPage', () => {
  it('renders the Our Studio heading', async () => {
    render(await OurStudioPage())
    const h1 = screen.getByRole('heading', { level: 1 })
    expect(h1).toBeTruthy()
    expect(h1.textContent).toMatch(/Our Studio/i)
  })

  it('renders address section with Preveza', async () => {
    render(await OurStudioPage())
    expect(screen.getAllByText(/Preveza/i).length).toBeGreaterThan(0)
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
