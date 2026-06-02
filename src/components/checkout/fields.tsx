// Shared, ramped-up form field styling. Used by the checkout delivery step and
// the Design Your Own customer details so the two boxes are visually identical.
export const FIELD_INPUT = 'w-full px-3 py-2.5 font-body text-[15px] bg-surface border border-border text-on-surface placeholder:text-on-surface/30 focus:outline-none focus:border-on-surface transition-colors'
export const FIELD_LABEL = 'block font-body text-[11px] tracking-[0.2em] uppercase text-on-surface-muted mb-1.5'
export const FIELD_ERR   = 'font-body text-[12px] text-destructive mt-1'

// Required-field marker (red asterisk shown next to the label).
export function Req() {
  return <span className="text-destructive" aria-hidden="true"> *</span>
}
