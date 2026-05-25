'use client'

import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { STORAGE_TTL_MS } from '@/lib/constants'

interface FavoritesStore {
  favorites:       number[]
  toggleFavorite:  (id: number) => void
  isFavorite:      (id: number) => boolean
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

export const useFavoritesStore = create<FavoritesStore>()(
  persist(
    (set, get) => ({
      favorites: [],
      toggleFavorite: (id) =>
        set(s => ({
          favorites: s.favorites.includes(id)
            ? s.favorites.filter(x => x !== id)
            : [...s.favorites, id],
        })),
      isFavorite: (id) => get().favorites.includes(id),
    }),
    { name: 'norelia_favorites', storage: createJSONStorage(makeTTLStorage) },
  ),
)
