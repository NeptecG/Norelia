'use client'

import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

export type DeliveryMethod = 'home' | 'pickup' | 'store'
export type PaymentMethod  = 'iris' | 'card' | 'applepay' | 'googlepay' | 'klarna' | 'cod'

// Multi-step checkout selections. Persisted to sessionStorage so a page refresh
// mid-checkout keeps the shopper's delivery method, shipping cost and gift flag
// (and clears automatically when the tab closes). shippingCost stays null until
// the delivery step is completed — the payment step uses that to detect a
// shopper who skipped ahead.
interface CheckoutStore {
  deliveryMethod: DeliveryMethod
  shippingCost:   number | null
  gift:           boolean
  paymentMethod:  PaymentMethod | null
  setDelivery:      (deliveryMethod: DeliveryMethod, shippingCost: number) => void
  setGift:          (gift: boolean) => void
  setPaymentMethod: (paymentMethod: PaymentMethod) => void
}

// SSR-safe storage: sessionStorage on the client, a no-op on the server.
const noopStorage = { getItem: () => null, setItem: () => {}, removeItem: () => {} }

export const useCheckoutStore = create<CheckoutStore>()(
  persist(
    (set) => ({
      deliveryMethod: 'home',
      shippingCost:   null,
      gift:           false,
      paymentMethod:  null,
      setDelivery:      (deliveryMethod, shippingCost) => set({ deliveryMethod, shippingCost }),
      setGift:          (gift) => set({ gift }),
      setPaymentMethod: (paymentMethod) => set({ paymentMethod }),
    }),
    {
      name: 'norelia_checkout',
      storage: createJSONStorage(() => (typeof window !== 'undefined' ? sessionStorage : noopStorage)),
      // Persist data only; setter functions are recreated by the initializer.
      partialize: (s) => ({
        deliveryMethod: s.deliveryMethod,
        shippingCost:   s.shippingCost,
        gift:           s.gift,
        paymentMethod:  s.paymentMethod,
      }),
    },
  ),
)
