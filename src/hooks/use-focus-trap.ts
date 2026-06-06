import { useEffect, type RefObject } from 'react'

const FOCUSABLE = [
  'a[href]:not([disabled])',
  'button:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(', ')

/**
 * Traps keyboard focus inside `containerRef` while `active` is true.
 *
 * - Focuses the first focusable element on activation.
 * - Wraps Tab / Shift+Tab at the boundary.
 * - Restores focus to the previously active element on deactivation.
 *
 * Satisfies WCAG 2.1 SC 2.1.2 (No Keyboard Trap — you CAN leave via Escape
 * which callers are responsible for handling) and meets the modal/dialog
 * focus-management pattern from ARIA Authoring Practices Guide.
 */
export function useFocusTrap(
  containerRef: RefObject<HTMLElement | null>,
  active: boolean,
) {
  useEffect(() => {
    if (!active || !containerRef.current) return

    const el = containerRef.current
    const previousFocus = document.activeElement as HTMLElement | null

    // Collect live list of focusable children (re-queried on each Tab press
    // so dynamically added/removed elements are always included)
    const getFocusables = (): HTMLElement[] =>
      Array.from(el.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(
        node => node.offsetParent !== null, // exclude hidden nodes
      )

    // Move focus into the container on open
    const focusables = getFocusables()
    focusables[0]?.focus()

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key !== 'Tab') return
      const items = getFocusables()
      if (items.length === 0) { e.preventDefault(); return }

      const first = items[0]
      const last  = items[items.length - 1]

      if (e.shiftKey) {
        // Shift+Tab: wrap from first → last
        if (document.activeElement === first || !el.contains(document.activeElement)) {
          e.preventDefault()
          last.focus()
        }
      } else {
        // Tab: wrap from last → first
        if (document.activeElement === last || !el.contains(document.activeElement)) {
          e.preventDefault()
          first.focus()
        }
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      // Restore focus to the element that was active before the trap opened
      previousFocus?.focus()
    }
  }, [active, containerRef])
}
