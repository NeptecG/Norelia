'use client'

import React, { useState, useRef } from 'react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import emailjs from '@emailjs/browser'
import { PATHS } from '@/data/paths'
import { GCOLORS } from '@/data/colors'
import { SIZES } from '@/data/sizes'
import { cn, getPrice } from '@/lib/utils'
import { useUIStore } from '@/stores/ui-store'
import type { GarmentType, SizeKey, FitType, PrintMethod, GarmentColor, DesignState } from '@/types'

// ─── EmailJS env vars (optional — UI works gracefully when empty) ─────────────
const EMAILJS_SERVICE  = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID  ?? ''
const EMAILJS_TEMPLATE = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID ?? ''
const EMAILJS_PUBLIC   = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY  ?? ''

// ─── Order form schema ────────────────────────────────────────────────────────
const orderSchema = z.object({
  name:  z.string().min(2, 'Name is required'),
  email: z.string().email('Valid email required'),
  notes: z.string().max(500).optional(),
})
export type OrderFields = z.infer<typeof orderSchema>

// ─── Sub-component prop interfaces ───────────────────────────────────────────

interface GarmentPreviewProps {
  garmentType:   GarmentType
  color:         GarmentColor
  side:          'front' | 'back'
  designState:   DesignState
  svgRef:        React.RefObject<SVGSVGElement | null>
  onDesignMove?: (dx: number, dy: number) => void
}

interface SideToggleProps {
  side: 'front' | 'back'
  onToggle: (side: 'front' | 'back') => void
}

interface GarmentTypeSelectorProps {
  garmentType: GarmentType
  onChange: (g: GarmentType) => void
}

interface ColorSwatchesProps {
  color: GarmentColor
  onChange: (c: GarmentColor) => void
}

interface FitToggleProps {
  fit: FitType
  onChange: (f: FitType) => void
}

interface PrintMethodToggleProps {
  printMethod: PrintMethod
  onChange: (p: PrintMethod) => void
}

interface SizeSelectorProps {
  size: SizeKey | null
  onChange: (s: SizeKey) => void
}

interface DesignUploadProps {
  designState: DesignState
  onUpload: (e: React.ChangeEvent<HTMLInputElement>) => void
  onRemove: () => void
}

interface PriceSummaryProps {
  price:      number | null
  size:       SizeKey | null
  onAddToCart: () => void
  onDesignOrder: () => void
}

interface DownloadButtonProps {
  svgRef: React.RefObject<SVGSVGElement | null>
}

interface OrderFormProps {
  onSubmit:  (data: OrderFields) => Promise<void>
  onBack:    () => void
  isLoading: boolean
}

interface OrderSuccessProps {
  svgRef:  React.RefObject<SVGSVGElement | null>
  onReset: () => void
}

interface StepIndicatorProps {
  step: 1 | 2 | 3
}

// ─── Sub-components (module level — never defined inside GarmentDesigner) ────

export function GarmentPreview({
  garmentType,
  color,
  side,
  designState,
  svgRef,
  onDesignMove,
}: GarmentPreviewProps) {
  return (
    <div className="relative bg-surface-raised aspect-[9/11] flex items-center justify-center overflow-hidden">
      <svg
        ref={svgRef}
        viewBox="0 0 400 460"
        className="w-full max-w-xs"
        aria-label={`${garmentType} ${side} view`}
      >
        {/* Garment fill */}
        <path
          d={PATHS[garmentType][side]}
          fill={color.hex}
          stroke={color.outline ? '#cccccc' : color.hex}
          strokeWidth="1.5"
        />
        {/* Design zone — dotted border rect where print will appear */}
        <rect
          x="150"
          y="150"
          width="100"
          height="100"
          fill="none"
          stroke="rgba(100,100,100,0.4)"
          strokeWidth="1"
          strokeDasharray="4 3"
          aria-label="Print area"
        />
        {/* Design image overlay if uploaded */}
        {designState.el && (
          <image
            href={designState.el.src}
            x={designState.x}
            y={designState.y}
            width={designState.w}
            height={designState.h}
            className="cursor-move"
            onPointerDown={(e) => {
              e.currentTarget.setPointerCapture(e.pointerId)
              const startX = e.clientX
              const startY = e.clientY
              const move = (ev: PointerEvent) => {
                onDesignMove?.(ev.clientX - startX, ev.clientY - startY)
              }
              const up = () => {
                e.currentTarget.removeEventListener('pointermove', move)
                e.currentTarget.removeEventListener('pointerup', up)
              }
              e.currentTarget.addEventListener('pointermove', move)
              e.currentTarget.addEventListener('pointerup', up)
            }}
          />
        )}
      </svg>
    </div>
  )
}

export function SideToggle({ side, onToggle }: SideToggleProps) {
  return (
    <div className="flex gap-1 mt-3 justify-center" role="group" aria-label="View side">
      {(['front', 'back'] as const).map((s) => (
        <button
          key={s}
          onClick={() => onToggle(s)}
          aria-pressed={side === s}
          className={cn(
            'px-4 py-1.5 font-body text-[9px] tracking-[0.2em] uppercase transition-colors',
            side === s
              ? 'bg-on-surface text-surface'
              : 'bg-transparent text-on-surface-muted border border-border hover:text-on-surface',
          )}
        >
          {s}
        </button>
      ))}
    </div>
  )
}

export function GarmentTypeSelector({ garmentType, onChange }: GarmentTypeSelectorProps) {
  return (
    <fieldset>
      <legend className="font-body text-[9px] tracking-[0.2em] uppercase text-on-surface-muted mb-2">
        Garment
      </legend>
      <div className="flex gap-1">
        {(['tshirt', 'hoodie', 'zipper'] as GarmentType[]).map((g) => (
          <button
            key={g}
            onClick={() => onChange(g)}
            aria-pressed={garmentType === g}
            className={cn(
              'px-3 py-1.5 font-body text-xs tracking-[0.12em] uppercase transition-colors border',
              garmentType === g
                ? 'bg-on-surface text-surface border-on-surface'
                : 'bg-transparent text-on-surface-muted border-border hover:text-on-surface hover:border-on-surface',
            )}
          >
            {g === 'tshirt' ? 'T-Shirt' : g === 'hoodie' ? 'Hoodie' : 'Zipper'}
          </button>
        ))}
      </div>
    </fieldset>
  )
}

export function ColorSwatches({ color, onChange }: ColorSwatchesProps) {
  return (
    <fieldset>
      <legend className="font-body text-[9px] tracking-[0.2em] uppercase text-on-surface-muted mb-2">
        Color: <span className="normal-case tracking-normal">{color.name}</span>
      </legend>
      <div className="flex gap-2">
        {GCOLORS.map((c) => (
          <button
            key={c.name}
            aria-label={c.name}
            aria-pressed={color.name === c.name}
            onClick={() => onChange(c)}
            className={cn(
              'w-7 h-7 rounded-full transition-transform hover:scale-110',
              color.name === c.name && 'ring-2 ring-offset-2 ring-on-surface',
            )}
            /* dynamic color — cannot use static Tailwind class */
            style={{ backgroundColor: c.hex, border: c.outline ? '1px solid #ccc' : 'none' }}
          />
        ))}
      </div>
    </fieldset>
  )
}

export function FitToggle({ fit, onChange }: FitToggleProps) {
  return (
    <fieldset>
      <legend className="font-body text-[9px] tracking-[0.2em] uppercase text-on-surface-muted mb-2">
        Fit
      </legend>
      <div className="flex gap-1" role="group">
        {(['normal', 'oversized'] as FitType[]).map((f) => (
          <button
            key={f}
            onClick={() => onChange(f)}
            aria-pressed={fit === f}
            className={cn(
              'px-3 py-1.5 font-body text-xs tracking-[0.12em] uppercase transition-colors border',
              fit === f
                ? 'bg-on-surface text-surface border-on-surface'
                : 'bg-transparent text-on-surface-muted border-border hover:text-on-surface hover:border-on-surface',
            )}
          >
            {f === 'normal' ? 'Normal' : 'Oversized'}
          </button>
        ))}
      </div>
    </fieldset>
  )
}

export function PrintMethodToggle({ printMethod, onChange }: PrintMethodToggleProps) {
  return (
    <fieldset>
      <legend className="font-body text-[9px] tracking-[0.2em] uppercase text-on-surface-muted mb-2">
        Print Method
      </legend>
      <div className="flex gap-1" role="group">
        {(['dtg', 'embroidery'] as PrintMethod[]).map((p) => (
          <button
            key={p}
            onClick={() => onChange(p)}
            aria-pressed={printMethod === p}
            className={cn(
              'px-3 py-1.5 font-body text-xs tracking-[0.12em] uppercase transition-colors border',
              printMethod === p
                ? 'bg-on-surface text-surface border-on-surface'
                : 'bg-transparent text-on-surface-muted border-border hover:text-on-surface hover:border-on-surface',
            )}
          >
            {p === 'dtg' ? 'DTG' : 'Embroidery'}
          </button>
        ))}
      </div>
    </fieldset>
  )
}

export function SizeSelector({ size, onChange }: SizeSelectorProps) {
  return (
    <fieldset>
      <legend className="font-body text-[9px] tracking-[0.2em] uppercase text-on-surface-muted mb-2">
        Size
      </legend>
      <div className="flex gap-1 flex-wrap">
        {SIZES.map((s) => (
          <button
            key={s}
            aria-pressed={size === s}
            onClick={() => onChange(s)}
            className={cn(
              'w-12 h-10 font-body text-xs tracking-[0.1em] uppercase transition-colors border',
              size === s
                ? 'bg-on-surface text-surface border-on-surface'
                : 'bg-transparent text-on-surface-muted border-border hover:text-on-surface hover:border-on-surface',
            )}
          >
            {s}
          </button>
        ))}
      </div>
    </fieldset>
  )
}

export function DesignUpload({ designState, onUpload, onRemove }: DesignUploadProps) {
  return (
    <div>
      <p className="font-body text-[9px] tracking-[0.2em] uppercase text-on-surface-muted mb-2">
        Your Design
      </p>
      <div className="flex items-center gap-3">
        <label
          htmlFor="design-upload"
          className="inline-block px-4 py-2 font-body text-xs tracking-[0.12em] uppercase border border-border text-on-surface-muted hover:text-on-surface hover:border-on-surface transition-colors cursor-pointer"
        >
          {designState.el ? 'Change design' : 'Upload design (PNG / SVG)'}
          <input
            id="design-upload"
            type="file"
            accept="image/png,image/svg+xml,image/jpeg"
            className="sr-only"
            onChange={onUpload}
          />
        </label>
        {designState.el && (
          <button
            onClick={onRemove}
            aria-label="Remove design"
            className="font-body text-lg text-on-surface-muted hover:text-on-surface transition-colors leading-none"
          >
            ×
          </button>
        )}
      </div>
    </div>
  )
}

export function PriceSummary({ price, size, onAddToCart, onDesignOrder }: PriceSummaryProps) {
  return (
    <div className="mt-8 border-t border-border pt-6">
      <div className="flex justify-between mb-4">
        <span className="font-body text-sm text-on-surface-muted">Price</span>
        <span className="font-display text-2xl text-on-surface">
          {price != null ? `€${price.toFixed(2)}` : '—'}
        </span>
      </div>
      <div className="flex flex-col gap-2">
        <button
          onClick={onAddToCart}
          disabled={!size}
          aria-label="Add to cart"
          className={cn(
            'w-full py-4 font-body text-xs tracking-[0.2em] uppercase transition-opacity',
            size
              ? 'bg-on-surface text-surface hover:opacity-80'
              : 'bg-on-surface/30 text-surface/60 cursor-not-allowed opacity-50',
          )}
        >
          {size ? 'ADD TO CART' : 'SELECT A SIZE'}
        </button>
        {size && (
          <button
            onClick={onDesignOrder}
            className="w-full py-3 font-body text-xs tracking-[0.2em] uppercase border border-on-surface text-on-surface hover:bg-on-surface hover:text-surface transition-colors"
          >
            DESIGN ORDER
          </button>
        )}
      </div>
      {/* sub-caption size: smaller than any scale step — intentional */}
      <p className="mt-2 font-body text-[10px] text-on-surface-muted text-center">
        DTG · custom printing · ships in 5–7 days
      </p>
    </div>
  )
}

export function DownloadButton({ svgRef }: DownloadButtonProps) {
  function handleDownload() {
    const svg = svgRef.current
    if (!svg) return
    const serialized = new XMLSerializer().serializeToString(svg)
    const blob = new Blob([serialized], { type: 'image/svg+xml' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'norelia-design.svg'
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <button
      onClick={handleDownload}
      className="font-body text-xs tracking-[0.12em] uppercase px-4 py-2 border border-border text-on-surface-muted hover:text-on-surface hover:border-on-surface transition-colors"
    >
      DOWNLOAD DESIGN
    </button>
  )
}

export function OrderForm({ onSubmit, onBack, isLoading }: OrderFormProps) {
  const { register, handleSubmit, formState: { errors } } = useForm<OrderFields>({
    resolver: zodResolver(orderSchema),
  })

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <div>
        <label
          htmlFor="order-name"
          className="font-body text-[9px] tracking-[0.2em] uppercase text-on-surface-muted block mb-1"
        >
          Name
        </label>
        <input
          id="order-name"
          {...register('name')}
          className="w-full px-3 py-2 font-body text-sm bg-surface border border-border text-on-surface focus:outline-none focus:border-on-surface"
          placeholder="Your name"
        />
        {errors.name && (
          <p className="font-body text-xs text-destructive mt-1">{errors.name.message}</p>
        )}
      </div>
      <div>
        <label
          htmlFor="order-email"
          className="font-body text-[9px] tracking-[0.2em] uppercase text-on-surface-muted block mb-1"
        >
          Email
        </label>
        <input
          id="order-email"
          type="email"
          {...register('email')}
          className="w-full px-3 py-2 font-body text-sm bg-surface border border-border text-on-surface focus:outline-none focus:border-on-surface"
          placeholder="your@email.com"
        />
        {errors.email && (
          <p className="font-body text-xs text-destructive mt-1">{errors.email.message}</p>
        )}
      </div>
      <div>
        <label
          htmlFor="order-notes"
          className="font-body text-[9px] tracking-[0.2em] uppercase text-on-surface-muted block mb-1"
        >
          Notes (optional)
        </label>
        <textarea
          id="order-notes"
          {...register('notes')}
          rows={3}
          className="w-full px-3 py-2 font-body text-sm bg-surface border border-border text-on-surface focus:outline-none focus:border-on-surface resize-none"
          placeholder="Any special instructions..."
        />
      </div>
      <div className="flex gap-2 mt-2">
        <button
          type="button"
          onClick={onBack}
          className="flex-1 py-3 font-body text-xs tracking-[0.2em] uppercase border border-border text-on-surface-muted hover:text-on-surface hover:border-on-surface transition-colors"
        >
          BACK
        </button>
        <button
          type="submit"
          disabled={isLoading}
          className="flex-1 py-3 font-body text-xs tracking-[0.2em] uppercase bg-on-surface text-surface hover:opacity-80 transition-opacity disabled:opacity-50"
        >
          {isLoading ? 'SENDING…' : 'PLACE ORDER'}
        </button>
      </div>
    </form>
  )
}

export function OrderSuccess({ svgRef, onReset }: OrderSuccessProps) {
  return (
    <div className="text-center py-8">
      <p className="font-display text-4xl text-on-surface mb-4">ORDER RECEIVED</p>
      <p className="font-body text-sm text-on-surface-muted mb-8">
        We&apos;ll confirm your custom order by email within 24 hours.
      </p>
      <div className="flex gap-3 justify-center">
        <DownloadButton svgRef={svgRef} />
        <button
          onClick={onReset}
          className="font-body text-xs tracking-[0.12em] uppercase px-4 py-2 bg-on-surface text-surface hover:opacity-80 transition-opacity"
        >
          DESIGN ANOTHER
        </button>
      </div>
    </div>
  )
}

export function StepIndicator({ step }: StepIndicatorProps) {
  const steps = ['Design', 'Details', 'Confirmation'] as const
  return (
    <div className="flex items-center gap-2 mb-8" aria-label="Order steps">
      {steps.map((label, i) => {
        const n = (i + 1) as 1 | 2 | 3
        const isActive = n === step
        const isDone   = n < step
        return (
          <React.Fragment key={label}>
            <div className="flex items-center gap-2">
              <span
                className={cn(
                  'w-6 h-6 rounded-full flex items-center justify-center font-body text-[10px]',
                  isActive ? 'bg-on-surface text-surface' :
                  isDone   ? 'bg-on-surface/30 text-on-surface' :
                             'bg-surface-raised text-on-surface-muted border border-border',
                )}
              >
                {n}
              </span>
              <span
                className={cn(
                  'font-body text-[9px] tracking-[0.15em] uppercase',
                  isActive ? 'text-on-surface' : 'text-on-surface-muted',
                )}
              >
                {label}
              </span>
            </div>
            {i < 2 && <div className="flex-1 h-px bg-border-subtle" />}
          </React.Fragment>
        )
      })}
    </div>
  )
}

// ─── Main GarmentDesigner component ──────────────────────────────────────────

export function GarmentDesigner() {
  const [garmentType, setGarmentType] = useState<GarmentType>('tshirt')
  const [color, setColor]             = useState<GarmentColor>(GCOLORS[1]) // Black
  const [fit, setFit]                 = useState<FitType>('normal')
  const [printMethod, setPrintMethod] = useState<PrintMethod>('dtg')
  const [size, setSize]               = useState<SizeKey | null>(null)
  const [side, setSide]               = useState<'front' | 'back'>('front')
  const [designState, setDesignState] = useState<DesignState>({
    el: null,
    x: 160,
    y: 160,
    w: 80,
    h: 80,
    angle: 0,
  })
  const [step, setStep]               = useState<1 | 2 | 3>(1)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const svgRef = useRef<SVGSVGElement | null>(null)

  const { setShowCheckoutModal } = useUIStore()

  const price = size ? getPrice(garmentType, size, fit, printMethod) : null

  function handleDesignUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    const url = URL.createObjectURL(file)
    const img = new window.Image()
    img.onload = () => {
      setDesignState({ el: img, x: 155, y: 155, w: 90, h: 90, angle: 0 })
    }
    img.src = url
  }

  function handleRemoveDesign() {
    setDesignState((s) => ({ ...s, el: null }))
  }

  function handleDesignMove(dx: number, dy: number) {
    // factor 0.5 maps screen-pixel delta to SVG-coordinate delta (approx viewport ratio)
    setDesignState((s) => ({ ...s, x: s.x + dx * 0.5, y: s.y + dy * 0.5 }))
  }

  async function handleOrderSubmit(data: OrderFields) {
    setIsSubmitting(true)
    try {
      if (EMAILJS_SERVICE && EMAILJS_TEMPLATE && EMAILJS_PUBLIC) {
        await emailjs.send(
          EMAILJS_SERVICE,
          EMAILJS_TEMPLATE,
          {
            from_name:    data.name,
            from_email:   data.email,
            garment_type: garmentType,
            color:        color.name,
            size:         size ?? '',
            fit:          fit,
            print_method: printMethod,
            notes:        data.notes ?? '',
          },
          EMAILJS_PUBLIC,
        )
      }
      setStep(3)
    } catch {
      // silently proceed to success — don't block UX on email failure
      setStep(3)
    } finally {
      setIsSubmitting(false)
    }
  }

  function handleReset() {
    setStep(1)
    setSize(null)
    setDesignState({ el: null, x: 160, y: 160, w: 80, h: 80, angle: 0 })
  }

  return (
    <section aria-label="Garment customiser" className="w-full">
      <StepIndicator step={step} />

      {step === 1 && (
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-10">
          {/* Left: SVG preview */}
          <div>
            <GarmentPreview
              garmentType={garmentType}
              color={color}
              side={side}
              designState={designState}
              svgRef={svgRef}
              onDesignMove={handleDesignMove}
            />
            <SideToggle side={side} onToggle={setSide} />
          </div>

          {/* Right: controls panel */}
          <div className="flex flex-col gap-6">
            <GarmentTypeSelector garmentType={garmentType} onChange={setGarmentType} />
            <ColorSwatches color={color} onChange={setColor} />
            <FitToggle fit={fit} onChange={setFit} />
            <PrintMethodToggle printMethod={printMethod} onChange={setPrintMethod} />
            <SizeSelector size={size} onChange={setSize} />
            <DesignUpload
              designState={designState}
              onUpload={handleDesignUpload}
              onRemove={handleRemoveDesign}
            />
            <PriceSummary
              price={price}
              size={size}
              onAddToCart={() => setShowCheckoutModal(true)}
              onDesignOrder={() => setStep(2)}
            />
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="max-w-md mx-auto">
          <OrderForm
            onSubmit={handleOrderSubmit}
            onBack={() => setStep(1)}
            isLoading={isSubmitting}
          />
        </div>
      )}

      {step === 3 && (
        <OrderSuccess svgRef={svgRef} onReset={handleReset} />
      )}
    </section>
  )
}
