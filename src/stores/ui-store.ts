'use client'

import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { STORAGE_TTL_MS, TOAST_DURATION_MS, RECENTLY_VIEWED_MAX } from '@/lib/constants'
import type { SidePanelType, ToastState, Product } from '@/types'

interface UIStore {
  sidePanel:            SidePanelType
  setSidePanel:         (panel: SidePanelType) => void
  toggleSidePanel:      (panel: 'cart' | 'favorites') => void

  toast:                ToastState
  showToast:            (msg: string, type: 'add' | 'remove') => void

  showSignIn:           boolean
  setShowSignIn:        (val: boolean) => void

  showCheckoutModal:    boolean
  setShowCheckoutModal: (val: boolean) => void

  recentlyViewed:       Product[]
  addToRecent:          (product: Product) => void
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

// Module-level timer ref so each new toast cancels the previous one's hide timer
let _toastTimer: ReturnType<typeof setTimeout> | null = null

export const useUIStore = create<UIStore>()(
  persist(
    (set) => ({
      sidePanel: null,
      setSidePanel:    (panel) => set({ sidePanel: panel }),
      toggleSidePanel: (panel) => set(s => ({ sidePanel: s.sidePanel === panel ? null : panel })),

      toast: { msg: '', visible: false, type: 'add' },
      showToast: (msg, type) => {
        // Cancel any in-flight hide timer so rapid toasts each get the full duration
        if (_toastTimer) { clearTimeout(_toastTimer); _toastTimer = null }
        set({ toast: { msg, visible: true, type } })
        _toastTimer = setTimeout(
          () => { set(s => ({ toast: { ...s.toast, visible: false } })); _toastTimer = null },
          TOAST_DURATION_MS,
        )
      },

      showSignIn: false,
      setShowSignIn: (val) => set({ showSignIn: val }),

      showCheckoutModal: false,
      setShowCheckoutModal: (val) => set({ showCheckoutModal: val }),

      recentlyViewed: [],
      addToRecent: (product) =>
        set(s => {
          const filtered = s.recentlyViewed.filter(p => p.id !== product.id)
          return { recentlyViewed: [product, ...filtered].slice(0, RECENTLY_VIEWED_MAX) }
        }),
    }),
    {
      name: 'norelia_ui',
      storage: createJSONStorage(makeTTLStorage),
      partialize: (s) => ({ recentlyViewed: s.recentlyViewed }),
    },
  ),
)
