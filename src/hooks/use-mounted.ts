'use client'

import { useSyncExternalStore } from 'react'

const subscribe = () => () => {}

// Returns false on the server (and the hydrating render), then true on the
// client. Gate client-only (e.g. persisted-store-dependent) UI on this to avoid
// SSR hydration mismatches. Uses useSyncExternalStore so there is no
// set-state-in-effect.
export function useMounted(): boolean {
  return useSyncExternalStore(subscribe, () => true, () => false)
}
