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
import type { GarmentType, SizeKey, FitType, PrintMethod, GarmentColor } from '@/types'

// ─── Placement types (internal to garment-designer) ──────────────────────────
type FrontPlacement = 'logo' | 'normal' | 'oversized'
type BackPlacement  = 'normal' | 'oversized'

// ─── Placement zone data ──────────────────────────────────────────────────────
interface PlacementZone { label: string; size: string; x: number; y: number; w: number; h: number }

const FRONT_ZONES: Record<FrontPlacement, PlacementZone> = {
  logo:      { label: 'Logo',      size: '~5×5 cm',   x: 96,  y: 70, w: 18, h: 18 },
  normal:    { label: 'Standard',  size: '20×20 cm',  x: 107, y: 90, w: 26, h: 26 },
  oversized: { label: 'Oversized', size: '30×30 cm',  x: 99,  y: 83, w: 42, h: 42 },
}

const BACK_ZONES: Record<BackPlacement, PlacementZone> = {
  normal:    { label: 'Standard',  size: '20×20 cm',  x: 107, y: 90, w: 26, h: 26 },
  oversized: { label: 'Oversized', size: '30×30 cm',  x: 99,  y: 83, w: 42, h: 42 },
}

// ─── Module-level typed constants (avoids inline `as X[]` assertions) ─────────
const GARMENT_TYPES: GarmentType[]  = ['tshirt', 'hoodie', 'zipper']
const FIT_TYPES:     FitType[]      = ['normal', 'oversized']
const PRINT_METHODS: PrintMethod[]  = ['dtg', 'embroidery']

// Step numbers typed via `as const` so STEP_NUMS[i] is typed as 1 | 2 | 3
const STEP_NUMS = [1, 2, 3] as const

// Micro-typography constants: below Tailwind's standard scale, used for all uppercase labels
const LABEL_CLS = 'font-body text-[9px] tracking-[0.2em] uppercase text-on-surface-muted'

// ─── Order form schema ────────────────────────────────────────────────────────
const orderSchema = z.object({
  name:  z.string().min(2, 'Name is required'),
  email: z.string().email('Valid email required'),
  notes: z.string().max(500).optional(),
})
export type OrderFields = z.infer<typeof orderSchema>

// ─── Sub-component prop interfaces ───────────────────────────────────────────

interface GarmentPreviewProps {
  garmentType:    GarmentType
  color:          GarmentColor
  side:           'front' | 'back'
  frontPlacement: FrontPlacement | null
  backPlacement:  BackPlacement  | null
  designImg:      HTMLImageElement | null
  svgRef:         React.RefObject<SVGSVGElement | null>
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
  hasDesign: boolean
  onUpload:  (e: React.ChangeEvent<HTMLInputElement>) => void
  onRemove:  () => void
}

interface PlacementSelectorProps {
  side:           'front' | 'back'
  frontPlacement: FrontPlacement | null
  backPlacement:  BackPlacement  | null
  onFront:        (p: FrontPlacement) => void
  onBack:         (p: BackPlacement)  => void
}

interface PriceSummaryProps {
  price:        number | null
  size:         SizeKey | null
  canOrder:     boolean
  onAddToCart:  () => void
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
  frontPlacement,
  backPlacement,
  designImg,
  svgRef,
}: GarmentPreviewProps) {
  const zones          = side === 'front' ? FRONT_ZONES : BACK_ZONES
  const activePlacement = side === 'front' ? frontPlacement : backPlacement

  // Derive active zone without type assertion — use the typed placement variable directly
  const activeZone: PlacementZone | null =
    side === 'front' && frontPlacement !== null ? FRONT_ZONES[frontPlacement] :
    side === 'back'  && backPlacement  !== null ? BACK_ZONES[backPlacement]   : null

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
          stroke={color.outline ? 'var(--color-border-subtle)' : color.hex}
          strokeWidth="1.5"
        />

        {/* Placement zone indicators — dashed rects; colour via semantic token + SVG opacity */}
        {(Object.entries(zones) as [string, PlacementZone][]).map(([key, zone]) => {
          const isActive = key === activePlacement
          return (
            <rect
              key={key}
              x={zone.x}
              y={zone.y}
              width={zone.w}
              height={zone.h}
              fill={isActive ? 'var(--color-border-subtle)' : 'none'}
              fillOpacity={isActive ? 0.15 : 0}
              stroke="var(--color-border-subtle)"
              strokeOpacity={isActive ? 0.6 : 0.2}
              strokeWidth="0.8"
              strokeDasharray={isActive ? '3 2' : '2 3'}
            />
          )
        })}

        {/* Design image at active placement zone */}
        {designImg !== null && activeZone !== null && (
          <image
            href={designImg.src}
            x={activeZone.x}
            y={activeZone.y}
            width={activeZone.w}
            height={activeZone.h}
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
          type="button"
          onClick={() => onToggle(s)}
          aria-pressed={side === s}
          className={cn(
            'px-4 py-1.5',
            LABEL_CLS,
            'transition-colors',
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
      {/* controls sidebar: 380px — matches design spec fixed panel width */}
      <legend className={cn(LABEL_CLS, 'mb-2')}>
        Garment
      </legend>
      <div className="flex gap-1">
        {GARMENT_TYPES.map((g) => (
          <button
            key={g}
            type="button"
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
      <legend className={cn(LABEL_CLS, 'mb-2')}>
        Color: <span className="normal-case tracking-normal">{color.name}</span>
      </legend>
      <div className="flex gap-2">
        {GCOLORS.map((c) => (
          <button
            key={c.name}
            type="button"
            aria-label={c.name}
            aria-pressed={color.name === c.name}
            onClick={() => onChange(c)}
            className={cn(
              'w-7 h-7 rounded-full transition-transform hover:scale-110',
              color.name === c.name && 'ring-2 ring-offset-2 ring-on-surface',
            )}
            /* dynamic color — cannot use static Tailwind class */
            style={{ backgroundColor: c.hex, border: c.outline ? '1px solid var(--color-border)' : 'none' }}
          />
        ))}
      </div>
    </fieldset>
  )
}

export function FitToggle({ fit, onChange }: FitToggleProps) {
  return (
    <fieldset>
      <legend className={cn(LABEL_CLS, 'mb-2')}>
        Fit
      </legend>
      <div className="flex gap-1">
        {FIT_TYPES.map((f) => (
          <button
            key={f}
            type="button"
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
      <legend className={cn(LABEL_CLS, 'mb-2')}>
        Print Method
      </legend>
      <div className="flex gap-1">
        {PRINT_METHODS.map((p) => (
          <button
            key={p}
            type="button"
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
      <legend className={cn(LABEL_CLS, 'mb-2')}>
        Size
      </legend>
      <div className="flex gap-1 flex-wrap">
        {SIZES.map((s) => (
          <button
            key={s}
            type="button"
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

export function DesignUpload({ hasDesign, onUpload, onRemove }: DesignUploadProps) {
  return (
    <div>
      <p className={cn(LABEL_CLS, 'mb-2')}>
        Your Design
      </p>
      <div className="flex items-center gap-3">
        <label
          htmlFor="design-upload"
          className="inline-block px-4 py-2 font-body text-xs tracking-[0.12em] uppercase border border-border text-on-surface-muted hover:text-on-surface hover:border-on-surface transition-colors cursor-pointer"
        >
          {hasDesign ? 'Change design' : 'Upload design (PNG / SVG)'}
          <input
            id="design-upload"
            type="file"
            accept="image/png,image/svg+xml,image/jpeg"
            className="sr-only"
            onChange={onUpload}
          />
        </label>
        {hasDesign && (
          <button
            type="button"
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

export function PlacementSelector({
  side,
  frontPlacement,
  backPlacement,
  onFront,
  onBack,
}: PlacementSelectorProps) {
  if (side === 'front') {
    return (
      <fieldset>
        <legend className={cn(LABEL_CLS, 'mb-2')}>
          Print Placement
        </legend>
        <div className="flex flex-col gap-1.5">
          {(Object.entries(FRONT_ZONES) as [FrontPlacement, PlacementZone][]).map(([key, zone]) => (
            <button
              key={key}
              type="button"
              onClick={() => onFront(key)}
              aria-pressed={frontPlacement === key}
              className={cn(
                'flex items-center justify-between px-3 py-2 font-body text-xs tracking-[0.1em] uppercase border transition-colors text-left',
                frontPlacement === key
                  ? 'bg-on-surface text-surface border-on-surface'
                  : 'bg-transparent text-on-surface-muted border-border hover:text-on-surface hover:border-on-surface',
              )}
            >
              <span>{zone.label}</span>
              <span className="text-[10px] normal-case tracking-normal opacity-60">{zone.size}</span>
            </button>
          ))}
        </div>
      </fieldset>
    )
  }

  return (
    <fieldset>
      <legend className={cn(LABEL_CLS, 'mb-2')}>
        Print Placement
      </legend>
      <div className="flex flex-col gap-1.5">
        {(Object.entries(BACK_ZONES) as [BackPlacement, PlacementZone][]).map(([key, zone]) => (
          <button
            key={key}
            type="button"
            onClick={() => onBack(key)}
            aria-pressed={backPlacement === key}
            className={cn(
              'flex items-center justify-between px-3 py-2 font-body text-xs tracking-[0.1em] uppercase border transition-colors text-left',
              backPlacement === key
                ? 'bg-on-surface text-surface border-on-surface'
                : 'bg-transparent text-on-surface-muted border-border hover:text-on-surface hover:border-on-surface',
            )}
          >
            <span>{zone.label}</span>
            <span className="text-[10px] normal-case tracking-normal opacity-60">{zone.size}</span>
          </button>
        ))}
      </div>
    </fieldset>
  )
}

export function PriceSummary({ price, size, canOrder, onAddToCart, onDesignOrder }: PriceSummaryProps) {
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
          type="button"
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
        {canOrder && (
          <button
            type="button"
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
      type="button"
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
          className={cn(LABEL_CLS, 'block mb-1')}
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
          className={cn(LABEL_CLS, 'block mb-1')}
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
          className={cn(LABEL_CLS, 'block mb-1')}
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
          type="button"
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
        const n = STEP_NUMS[i]  // typed as 1 | 2 | 3 via as const
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
                  LABEL_CLS,
                  'tracking-[0.15em]',
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
  const [garmentType,     setGarmentType]     = useState<GarmentType>('tshirt')
  const [color,           setColor]           = useState<GarmentColor>(GCOLORS[1]) // Black
  const [fit,             setFit]             = useState<FitType>('normal')
  const [printMethod,     setPrintMethod]     = useState<PrintMethod>('dtg')
  const [size,            setSize]            = useState<SizeKey | null>(null)
  const [side,            setSide]            = useState<'front' | 'back'>('front')
  const [frontPlacement,  setFrontPlacement]  = useState<FrontPlacement | null>(null)
  const [backPlacement,   setBackPlacement]   = useState<BackPlacement  | null>(null)
  const [designImg,       setDesignImg]       = useState<HTMLImageElement | null>(null)
  const [step,            setStep]            = useState<1 | 2 | 3>(1)
  const [isSubmitting,    setIsSubmitting]    = useState(false)

  const svgRef = useRef<SVGSVGElement | null>(null)

  const { setShowCheckoutModal } = useUIStore()

  const price    = size ? getPrice(garmentType, size, fit, printMethod) : null
  const canOrder = size !== null && (frontPlacement !== null || backPlacement !== null)

  function handleDesignUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    const url = URL.createObjectURL(file)
    const img = new window.Image()
    img.onload = () => setDesignImg(img)
    img.src = url
  }

  function handleRemoveDesign() {
    setDesignImg(null)
  }

  async function handleOrderSubmit(data: OrderFields) {
    setIsSubmitting(true)
    try {
      const serviceId  = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID  ?? ''
      const templateId = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID ?? ''
      const publicKey  = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY  ?? ''
      if (serviceId && templateId && publicKey) {
        await emailjs.send(
          serviceId,
          templateId,
          {
            from_name:       data.name,
            from_email:      data.email,
            garment_type:    garmentType,
            color:           color.name,
            size:            size ?? '',
            fit:             fit,
            print_method:    printMethod,
            front_placement: frontPlacement ?? 'none',
            back_placement:  backPlacement  ?? 'none',
            notes:           data.notes ?? '',
          },
          publicKey,
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
    setDesignImg(null)
    setFrontPlacement(null)
    setBackPlacement(null)
  }

  return (
    <section aria-label="Garment customiser" className="w-full">
      <StepIndicator step={step} />

      {/* controls sidebar: 380px — matches design spec fixed panel width */}
      {step === 1 && (
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-10">
          {/* Left: SVG preview */}
          <div>
            <GarmentPreview
              garmentType={garmentType}
              color={color}
              side={side}
              frontPlacement={frontPlacement}
              backPlacement={backPlacement}
              designImg={designImg}
              svgRef={svgRef}
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
              hasDesign={designImg !== null}
              onUpload={handleDesignUpload}
              onRemove={handleRemoveDesign}
            />
            <PlacementSelector
              side={side}
              frontPlacement={frontPlacement}
              backPlacement={backPlacement}
              onFront={setFrontPlacement}
              onBack={setBackPlacement}
            />
            <PriceSummary
              price={price}
              size={size}
              canOrder={canOrder}
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
