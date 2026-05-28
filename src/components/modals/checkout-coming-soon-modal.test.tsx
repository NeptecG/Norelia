import React from 'react'
import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { IntlWrapper } from '@/test-utils/intl-wrapper'

vi.mock('@/stores/ui-store', () => ({ useUIStore: vi.fn() }))
vi.mock('@base-ui/react/dialog', () => ({
  Dialog: {
    Root: ({ children, open }: { children: React.ReactNode; open: boolean }) => open ? <div>{children}</div> : null,
    Trigger: ({ children }: { children: React.ReactNode }) => <>{children}</>,
    Portal: ({ children }: { children: React.ReactNode }) => <>{children}</>,
    Backdrop: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
    Popup: ({ children }: { children: React.ReactNode }) => <div role="dialog">{children}</div>,
    Close: ({ children }: { children: React.ReactNode }) => <button>{children}</button>,
    Title: ({ children }: { children: React.ReactNode }) => <h2>{children}</h2>,
    Description: ({ children }: { children: React.ReactNode }) => <p>{children}</p>,
  }
}))

import { useUIStore } from '@/stores/ui-store'
import { CheckoutComingSoonModal } from './checkout-coming-soon-modal'

describe('CheckoutComingSoonModal', () => {
  it('renders nothing when closed', () => {
    vi.mocked(useUIStore).mockReturnValue({ showCheckoutModal: false, setShowCheckoutModal: vi.fn() } as ReturnType<typeof useUIStore>)
    render(<IntlWrapper><CheckoutComingSoonModal /></IntlWrapper>)
    expect(screen.queryByRole('dialog')).toBeNull()
  })
  it('renders dialog when open', () => {
    vi.mocked(useUIStore).mockReturnValue({ showCheckoutModal: true, setShowCheckoutModal: vi.fn() } as ReturnType<typeof useUIStore>)
    render(<IntlWrapper><CheckoutComingSoonModal /></IntlWrapper>)
    expect(screen.getByRole('dialog')).toBeTruthy()
  })
})
