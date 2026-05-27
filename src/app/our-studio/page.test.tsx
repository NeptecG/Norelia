import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'

import OurStudioPage from './page'

describe('OurStudioPage', () => {
  it('renders the OUR STUDIO heading', async () => {
    render(await OurStudioPage())
    const h1 = screen.getByRole('heading', { level: 1 })
    expect(h1).toBeTruthy()
    // h1 contains "OUR" and "STUDIO" split across a <br> — check both words are present
    expect(h1.textContent).toMatch(/OUR/i)
    expect(h1.textContent).toMatch(/STUDIO/i)
  })

  it('renders address section with Preveza', async () => {
    render(await OurStudioPage())
    // "Preveza" appears in both the hero subtitle and the address block
    expect(screen.getAllByText(/Preveza/i).length).toBeGreaterThan(0)
  })

  it('renders map iframe', async () => {
    render(await OurStudioPage())
    expect(document.querySelector('iframe')).toBeTruthy()
  })
})
