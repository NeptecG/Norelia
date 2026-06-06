'use client'

import { useState } from 'react'
import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface ShippingReturnsTabsProps {
  shippingLabel: string
  returnsLabel:  string
  shipping:      ReactNode
  returns:       ReactNode
}

// Tabbed Shipping / Returns content. Both panels stay in the DOM (one hidden) so
// the content remains crawlable; the tabs just toggle which one is shown.
export function ShippingReturnsTabs({ shippingLabel, returnsLabel, shipping, returns }: ShippingReturnsTabsProps) {
  const [active, setActive] = useState<'shipping' | 'returns'>('shipping')

  return (
    <div>
      <div role="tablist" aria-label="Shipping and Returns" className="flex gap-10 border-b border-border-subtle mb-12">
        <TabButton id="tab-shipping" panelId="panel-shipping" label={shippingLabel} active={active === 'shipping'} onSelect={() => setActive('shipping')} />
        <TabButton id="tab-returns"  panelId="panel-returns"  label={returnsLabel}  active={active === 'returns'}  onSelect={() => setActive('returns')} />
      </div>

      <div id="panel-shipping" role="tabpanel" aria-labelledby="tab-shipping" hidden={active !== 'shipping'}>{shipping}</div>
      <div id="panel-returns"  role="tabpanel" aria-labelledby="tab-returns"  hidden={active !== 'returns'}>{returns}</div>
    </div>
  )
}

interface TabButtonProps {
  id:       string
  panelId:  string
  label:    string
  active:   boolean
  onSelect: () => void
}

function TabButton({ id, panelId, label, active, onSelect }: TabButtonProps) {
  return (
    <button
      id={id}
      type="button"
      role="tab"
      aria-selected={active}
      aria-controls={panelId}
      onClick={onSelect}
      className={cn(
        'group relative pb-4 font-display text-lg md:text-xl tracking-[0.08em] transition-colors',
        active ? 'text-on-surface' : 'text-on-surface/40 hover:text-on-surface/70',
      )}
    >
      {label}
      {/* Underline: persistent when active, draws in on hover otherwise */}
      <span
        aria-hidden="true"
        className={cn(
          'absolute -bottom-px left-0 right-0 h-[2px] bg-on-surface origin-left transition-transform duration-[280ms]',
          active ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100',
        )}
      />
    </button>
  )
}
