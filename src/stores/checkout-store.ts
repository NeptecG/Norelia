'use client'

import { create } from 'zustand'

export type DeliveryMethod = 'home' | 'pickup' | 'store'
export type PaymentMethod  = 'iris' | 'card' | 'applepay' | 'googlepay' | 'klarna' | 'cod'

// In-memory store for the multi-step checkout. It is intentionally NOT persisted
// — selections live only for the duration of a checkout session and reset on a
// hard refresh (the payment step falls back to sensible defaults if so).
interface CheckoutStore {
  deliveryMethod: DeliveryMethod
  shippingCost:   number | null
  gift:           boolean
  paymentMethod:  PaymentMethod | null
  setDelivery:      (deliveryMethod: DeliveryMethod, shippingCost: number) => void
  setGift:          (gift: boolean) => void
  setPaymentMethod: (paymentMethod: PaymentMethod) => void
}

export const useCheckoutStore = create<CheckoutStore>((set) => ({
  deliveryMethod: 'home',
  shippingCost:   null,
  gift:           false,
  paymentMethod:  null,
  setDelivery:      (deliveryMethod, shippingCost) => set({ deliveryMethod, shippingCost }),
  setGift:          (gift) => set({ gift }),
  setPaymentMethod: (paymentMethod) => set({ paymentMethod }),
}))
