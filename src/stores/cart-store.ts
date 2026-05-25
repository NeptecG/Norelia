'use client'

import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { STORAGE_TTL_MS } from '@/lib/constants'

interface CartStore {
  cartItems: Record<number, number>
  addToCart:      (id: number, qty?: number) => void
  removeFromCart: (id: number) => void
  decrementCart:  (id: number) => void
  clearCart:      () => void
  cartCount:      () => number
}

function makeTTLStorage() {
  return {
    getItem: (name: string): string | null => {
      if (typeof window === 'undefined') return null
      const str = localStorage.getItem(name)
      if (!str) return null
      try {
        const parsed = JSON.parse(str) as { state: unknown; expires: number }
        if (Date.now() > parsed.expires) { localStorage.removeItem(name); return null }
        return JSON.stringify({ state: parsed.state })
      } catch (_e) { return null }
    },
    setItem: (name: string, value: string) => {
      if (typeof window === 'undefined') return
      const parsed = JSON.parse(value) as { state: unknown }
      localStorage.setItem(name, JSON.stringify({ ...parsed, expires: Date.now() + STORAGE_TTL_MS }))
    },
    removeItem: (name: string) => {
      if (typeof window === 'undefined') return
      localStorage.removeItem(name)
    },
  }
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      cartItems: {},
      addToCart: (id, qty = 1) =>
        set(s => ({ cartItems: { ...s.cartItems, [id]: (s.cartItems[id] ?? 0) + qty } })),
      removeFromCart: (id) =>
        set(s => { const { [id]: _, ...rest } = s.cartItems; return { cartItems: rest } }),
      decrementCart: (id) =>
        set(s => {
          const cur = s.cartItems[id]
          if (!cur || cur <= 1) { const { [id]: _, ...rest } = s.cartItems; return { cartItems: rest } }
          return { cartItems: { ...s.cartItems, [id]: cur - 1 } }
        }),
      clearCart: () => set({ cartItems: {} }),
      cartCount: () => Object.values(get().cartItems).reduce((sum, q) => sum + q, 0),
    }),
    { name: 'norelia_cart', storage: createJSONStorage(makeTTLStorage) },
  ),
)
