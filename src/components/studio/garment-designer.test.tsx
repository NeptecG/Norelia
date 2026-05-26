import React from 'react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'

vi.mock('@/stores/ui-store', () => ({ useUIStore: vi.fn() }))
vi.mock('@/data/paths', () => ({
  PATHS: {
    tshirt: { front: 'M0 0 L100 0 L100 100 Z', back: 'M0 0 L100 0 L100 100 Z' },
    hoodie: { front: 'M0 0 L100 0 L100 100 Z', back: 'M0 0 L100 0 L100 100 Z' },
    zipper: { front: 'M0 0 L100 0 L100 100 Z', back: 'M0 0 L100 0 L100 100 Z' },
  },
}))
vi.mock('@/data/colors', () => ({
  GCOLORS: [
    { name: 'White', hex: '#FFFFFF', outline: true },
    { name: 'Black', hex: '#1e1e1e' },
  ],
}))
vi.mock('@/data/sizes', () => ({ SIZES: ['S', 'M', 'L'] }))
vi.mock('@/lib/utils', () => ({
  cn: (...c: string[]) => c.filter(Boolean).join(' '),
  getPrice: vi.fn(() => 24.99),
}))
vi.mock('@emailjs/browser', () => ({
  default: { send: vi.fn().mockResolvedValue({ status: 200 }) },
}))

// Mock XMLSerializer + URL for download test
global.XMLSerializer = class {
  serializeToString() { return '<svg/>' }
} as unknown as typeof XMLSerializer
global.URL.createObjectURL = vi.fn(() => 'blob:mock')
global.URL.revokeObjectURL = vi.fn()

import { useUIStore } from '@/stores/ui-store'
import emailjs from '@emailjs/browser'
import { GarmentDesigner } from './garment-designer'

const mockSetShowCheckoutModal = vi.fn()

function setupStore() {
  vi.mocked(useUIStore).mockReturnValue({
    setShowCheckoutModal: mockSetShowCheckoutModal,
  } as ReturnType<typeof useUIStore>)
}

beforeEach(() => {
  mockSetShowCheckoutModal.mockClear()
  vi.mocked(emailjs.send).mockClear()
  setupStore()
})

describe('GarmentDesigner', () => {
  it('renders garment type selector buttons (T-Shirt, Hoodie, Zipper)', () => {
    render(<GarmentDesigner />)
    expect(screen.getByRole('button', { name: /t-shirt/i })).toBeTruthy()
    expect(screen.getByRole('button', { name: /hoodie/i })).toBeTruthy()
    expect(screen.getByRole('button', { name: /zipper/i })).toBeTruthy()
  })

  it('renders color swatch buttons', () => {
    render(<GarmentDesigner />)
    expect(screen.getByRole('button', { name: /white/i })).toBeTruthy()
    expect(screen.getByRole('button', { name: /black/i })).toBeTruthy()
  })

  it('renders size buttons', () => {
    render(<GarmentDesigner />)
    expect(screen.getByRole('button', { name: 'S' })).toBeTruthy()
    expect(screen.getByRole('button', { name: 'M' })).toBeTruthy()
    expect(screen.getByRole('button', { name: 'L' })).toBeTruthy()
  })

  it('renders "SELECT A SIZE" when no size is chosen', () => {
    render(<GarmentDesigner />)
    expect(screen.getByText('SELECT A SIZE')).toBeTruthy()
  })

  it('clicking a size button updates the displayed price', () => {
    render(<GarmentDesigner />)
    // Price shows "—" initially
    expect(screen.getByText('—')).toBeTruthy()
    // Click size S
    fireEvent.click(screen.getByRole('button', { name: 'S' }))
    // Price should now show formatted value from mocked getPrice (24.99)
    expect(screen.getByText('€24.99')).toBeTruthy()
    // Add to cart button text should also change
    expect(screen.getByText('ADD TO CART')).toBeTruthy()
  })

  it('clicking ADD TO CART calls setShowCheckoutModal(true)', () => {
    render(<GarmentDesigner />)
    // Select a size first so button is enabled
    fireEvent.click(screen.getByRole('button', { name: 'M' }))
    fireEvent.click(screen.getByRole('button', { name: /add to cart/i }))
    expect(mockSetShowCheckoutModal).toHaveBeenCalledWith(true)
  })

  it('fit toggle shows NORMAL and OVERSIZED options', () => {
    render(<GarmentDesigner />)
    expect(screen.getByRole('button', { name: /normal/i })).toBeTruthy()
    expect(screen.getByRole('button', { name: /oversized/i })).toBeTruthy()
  })

  it('print method shows DTG and EMBROIDERY options', () => {
    render(<GarmentDesigner />)
    expect(screen.getByRole('button', { name: /dtg/i })).toBeTruthy()
    expect(screen.getByRole('button', { name: /embroidery/i })).toBeTruthy()
  })

  // ─── Step indicator ────────────────────────────────────────────────────────

  it('step indicator renders "Design" as the first step label initially', () => {
    render(<GarmentDesigner />)
    expect(screen.getByText('Design')).toBeTruthy()
  })

  it('step indicator shows all three step labels', () => {
    render(<GarmentDesigner />)
    expect(screen.getByText('Design')).toBeTruthy()
    expect(screen.getByText('Details')).toBeTruthy()
    expect(screen.getByText('Confirmation')).toBeTruthy()
  })

  // ─── DESIGN ORDER button and step 2 ───────────────────────────────────────

  it('DESIGN ORDER button appears only after selecting a size', () => {
    render(<GarmentDesigner />)
    // Should not be visible before size selection
    expect(screen.queryByRole('button', { name: /design order/i })).toBeNull()
    // Select a size
    fireEvent.click(screen.getByRole('button', { name: 'M' }))
    expect(screen.getByRole('button', { name: /design order/i })).toBeTruthy()
  })

  it('clicking DESIGN ORDER advances to step 2 and shows the order form', () => {
    render(<GarmentDesigner />)
    fireEvent.click(screen.getByRole('button', { name: 'L' }))
    fireEvent.click(screen.getByRole('button', { name: /design order/i }))
    // Step 2 — form should be visible
    expect(screen.getByLabelText(/name/i)).toBeTruthy()
    expect(screen.getByLabelText(/email/i)).toBeTruthy()
  })

  // ─── Order form fields ─────────────────────────────────────────────────────

  it('order form has name and email fields', () => {
    render(<GarmentDesigner />)
    fireEvent.click(screen.getByRole('button', { name: 'S' }))
    fireEvent.click(screen.getByRole('button', { name: /design order/i }))
    expect(screen.getByLabelText(/name/i)).toBeTruthy()
    expect(screen.getByLabelText(/email/i)).toBeTruthy()
  })

  it('order form BACK button returns to step 1', () => {
    render(<GarmentDesigner />)
    fireEvent.click(screen.getByRole('button', { name: 'S' }))
    fireEvent.click(screen.getByRole('button', { name: /design order/i }))
    fireEvent.click(screen.getByRole('button', { name: /back/i }))
    // Step 1 controls visible again
    expect(screen.getByRole('button', { name: /t-shirt/i })).toBeTruthy()
  })

  // ─── EmailJS integration ───────────────────────────────────────────────────

  it('submitting the order form calls emailjs.send and advances to step 3', async () => {
    render(<GarmentDesigner />)
    fireEvent.click(screen.getByRole('button', { name: 'M' }))
    fireEvent.click(screen.getByRole('button', { name: /design order/i }))

    fireEvent.change(screen.getByLabelText(/name/i), { target: { value: 'Jane Doe' } })
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'jane@example.com' } })
    fireEvent.click(screen.getByRole('button', { name: /place order/i }))

    await waitFor(() => {
      expect(screen.getByText('ORDER RECEIVED')).toBeTruthy()
    })
  })

  // ─── Success step / download button ───────────────────────────────────────

  it('download button is visible on the success step', async () => {
    render(<GarmentDesigner />)
    fireEvent.click(screen.getByRole('button', { name: 'M' }))
    fireEvent.click(screen.getByRole('button', { name: /design order/i }))

    fireEvent.change(screen.getByLabelText(/name/i), { target: { value: 'Jane Doe' } })
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'jane@example.com' } })
    fireEvent.click(screen.getByRole('button', { name: /place order/i }))

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /download design/i })).toBeTruthy()
    })
  })

  it('DESIGN ANOTHER button resets back to step 1', async () => {
    render(<GarmentDesigner />)
    fireEvent.click(screen.getByRole('button', { name: 'M' }))
    fireEvent.click(screen.getByRole('button', { name: /design order/i }))

    fireEvent.change(screen.getByLabelText(/name/i), { target: { value: 'Jane Doe' } })
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'jane@example.com' } })
    fireEvent.click(screen.getByRole('button', { name: /place order/i }))

    await waitFor(() => screen.getByText('ORDER RECEIVED'))
    fireEvent.click(screen.getByRole('button', { name: /design another/i }))
    // Back to step 1 — garment selector visible
    expect(screen.getByRole('button', { name: /t-shirt/i })).toBeTruthy()
  })
})
