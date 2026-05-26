import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'

import OurStudioPage from './page'

describe('OurStudioPage', () => {
  it('renders the OUR STUDIO heading', async () => {
    render(await OurStudioPage())
    expect(screen.getByRole('heading', { level: 1 })).toBeTruthy()
    expect(screen.getByText('OUR STUDIO')).toBeTruthy()
  })

  it('renders address section with Preveza', async () => {
    render(await OurStudioPage())
    expect(screen.getByText(/Preveza/i)).toBeTruthy()
  })

  it('renders map iframe', async () => {
    render(await OurStudioPage())
    expect(document.querySelector('iframe')).toBeTruthy()
  })
})
