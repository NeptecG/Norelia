'use client'

import React, { useState, useRef, useCallback, useEffect } from 'react'
import { z } from 'zod'
import { useForm, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import emailjs from '@emailjs/browser'
import { Upload, ArrowLeft, Check, Ruler } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { PATHS } from '@/data/paths'
import { GCOLORS } from '@/data/colors'
import { SIZES, SIZE_DATA } from '@/data/sizes'
import { BP } from '@/data/pricing'
import { cn, getPrice } from '@/lib/utils'
import { useColorLabel } from '@/hooks/use-i18n-labels'
import { useUIStore } from '@/stores/ui-store'
import type { GarmentType, SizeKey, FitType, PrintMethod, GarmentColor } from '@/types'

// ─── Types ────────────────────────────────────────────────────────────────────

type DesignStep    = 'design' | 'form' | 'success'
type FrontPresetId = 'logo' | 'standard' | 'oversized'
type BackPresetId  = 'standard' | 'oversized'

interface DesignImgState { el: HTMLImageElement | null; x: number; y: number; w: number; h: number }
interface PrintPreset    { id: string; cm: string; label: string; desc: string; descKey: string; svgX: number; svgY: number; svgW: number; svgH: number }

// ─── Constants ────────────────────────────────────────────────────────────────

// CW×CH matches NOIR's canvas dimensions — exact pixel size required for canvas overlay alignment
const CW = 272
const CH = 310

const FRONT_PRESETS: PrintPreset[] = [
  { id: 'logo',      cm: '8×8 cm',   label: 'Logo',      desc: 'Left Breast',  descKey: 'presetDescLeftBreast',  svgX: 211, svgY: 128, svgW: 62,  svgH: 62  },
  { id: 'standard',  cm: '20×20 cm', label: 'Standard',  desc: 'Centre Chest', descKey: 'presetDescCentreChest', svgX: 157, svgY: 160, svgW: 86,  svgH: 86  },
  { id: 'oversized', cm: '30×30 cm', label: 'Oversized', desc: 'Centre Chest', descKey: 'presetDescCentreChest', svgX: 132, svgY: 150, svgW: 136, svgH: 136 },
]

const BACK_PRESETS: PrintPreset[] = [
  { id: 'standard',  cm: '20×20 cm', label: 'Standard',  desc: 'Centre Back',  descKey: 'presetDescCentreBack',  svgX: 157, svgY: 155, svgW: 86,  svgH: 86  },
  { id: 'oversized', cm: '30×30 cm', label: 'Oversized', desc: 'Centre Back',  descKey: 'presetDescCentreBack',  svgX: 132, svgY: 145, svgW: 136, svgH: 136 },
]

const GARMENT_TYPES:  GarmentType[] = ['tshirt', 'hoodie', 'zipper']
const FIT_TYPES:      FitType[]     = ['normal', 'oversized']
const PRINT_METHODS:  PrintMethod[] = ['dtg', 'embroidery']

// Control labels throughout the designer (bumped up per design feedback)
const LABEL_CLS = 'font-body text-[11px] tracking-[0.2em] uppercase text-on-surface-muted'

// ─── Order schema ─────────────────────────────────────────────────────────────

// Type-only shape — used solely to infer OrderFields. The real validation
// schema (with localized messages) is built inside OrderForm via useMemo.
const _orderSchemaShape = z.object({
  name:    z.string(),
  phone:   z.string(),
  email:   z.string(),
  address: z.string(),
  city:    z.string(),
  zip:     z.string(),
  notes:   z.string().optional(),
})
export type OrderFields = z.infer<typeof _orderSchemaShape>

// ─── Sub-component interfaces ─────────────────────────────────────────────────

interface GarmentPreviewProps {
  garmentType:      GarmentType
  color:            GarmentColor
  side:             'front' | 'back'
  frontPreset:      FrontPresetId
  backPreset:       BackPresetId
  canvasRef:        React.RefObject<HTMLCanvasElement | null>
  showMeasurements: boolean
  measureGender:    'men' | 'women'
  size:             SizeKey | null
}

interface SideToggleProps {
  side:      'front' | 'back'
  hasDesign: { front: boolean; back: boolean }
  onToggle:  (s: 'front' | 'back') => void
}

interface PrintPresetSelectorProps {
  side:          'front' | 'back'
  frontPreset:   FrontPresetId
  backPreset:    BackPresetId
  onFrontChange: (id: FrontPresetId) => void
  onBackChange:  (id: BackPresetId) => void
}

interface RemoveLinksProps {
  hasDesign:     { front: boolean; back: boolean }
  onRemoveFront: () => void
  onRemoveBack:  () => void
}

interface MeasurementsPanelProps {
  show:           boolean
  gender:         'men' | 'women'
  garmentType:    GarmentType
  size:           SizeKey | null
  onToggle:       () => void
  onGenderChange: (g: 'men' | 'women') => void
}

interface GarmentTypeSelectorProps {
  value:    GarmentType
  onChange: (g: GarmentType) => void
}

interface DesignUploadZoneProps {
  side:       'front' | 'back'
  fileRef:    React.RefObject<HTMLInputElement | null>
  onFilePick: (file: File) => void
}

interface ColorSwatchesProps {
  color:    GarmentColor
  onChange: (c: GarmentColor) => void
}

interface SizeSelectorProps {
  size:     SizeKey | null
  onChange: (s: SizeKey) => void
}

interface FitSelectorProps {
  fit:      FitType
  onChange: (f: FitType) => void
}

interface PrintMethodSelectorProps {
  printMethod: PrintMethod
  onChange:    (p: PrintMethod) => void
}

interface QuantityStepperProps {
  qty:      number
  onChange: (q: number) => void
}

interface PriceDisplayProps {
  price:        number | null
  qty:          number
  fit:          FitType
  printMethod:  PrintMethod
  size:         SizeKey | null
  hasDesign:    { front: boolean; back: boolean }
  onPlaceOrder: () => void
}

interface OrderSummaryProps {
  garmentType: GarmentType
  color:       GarmentColor
  size:        SizeKey | null
  fit:         FitType
  printMethod: PrintMethod
  hasDesign:   { front: boolean; back: boolean }
  frontPreset: FrontPresetId
  backPreset:  BackPresetId
  price:       number | null
  qty:         number
}

interface OrderFormProps {
  onSubmit:  (data: OrderFields) => Promise<void>
  isLoading: boolean
}

interface OrderSuccessProps {
  orderId: string
  onReset: () => void
}

interface StepIndicatorProps {
  step: DesignStep
}

// ─── Sub-components ───────────────────────────────────────────────────────────

export function GarmentPreview({
  garmentType, color, side, frontPreset, backPreset,
  canvasRef, showMeasurements, measureGender, size,
}: GarmentPreviewProps) {
  const t = useTranslations('GarmentDesigner')
  const activePreset = (side === 'front'
    ? FRONT_PRESETS.find(p => p.id === frontPreset)
    : BACK_PRESETS.find(p => p.id === backPreset)
  ) ?? (side === 'front' ? FRONT_PRESETS[0] : BACK_PRESETS[0])

  // SVG presentation colors derived from the chosen garment color.
  // Must be inline SVG attributes — Tailwind cannot express dynamic hex values.
  const isWhite = color.hex === '#FFFFFF'
  const svgStr = isWhite ? '#CCC'  : 'rgba(255,255,255,0.18)' // garment outline
  const pgStr  = isWhite ? '#AAA'  : 'rgba(255,255,255,0.5)'  // print area guide
  const acc    = isWhite ? '#666'  : 'rgba(255,255,255,0.62)' // collar / tag accents
  const strC   = isWhite ? '#555'  : '#ddd'                   // hoodie drawstring
  const pktC   = isWhite ? '#888'  : 'rgba(255,255,255,0.68)' // pocket outline

  const isShirt  = garmentType === 'tshirt'
  const isHoodie = garmentType === 'hoodie'
  const isZipper = garmentType === 'zipper'
  const isFront  = side === 'front'

  const mData = showMeasurements && size
    ? SIZE_DATA[garmentType][measureGender].find(r => r.size === size)
    : null

  // SVG anchor points for measurement arrows (viewBox 0 0 400 460)
  const ac          = 'rgba(225,29,72,0.9)'
  const tc          = '#e11d48'
  const shoulderY   = 48,  hemY         = 440
  const bodyL       = 90,  bodyR        = 310
  const chestY      = 138
  const sleeveEndX  = isShirt ? 42 : 22
  const sleeveEndY  = isShirt ? 192 : 300
  const slvStartX   = 90
  const slvStartY   = isShirt ? 108 : 98

  return (
    // w-[272px] h-[310px] = CW×CH canvas dimensions — canvas overlay needs a pixel-exact container
    <div className="relative w-[272px] h-[310px]">
      <svg
        viewBox="0 0 400 460"
        width={CW}
        height={CH}
        xmlns="http://www.w3.org/2000/svg"
        aria-label={`${garmentType} ${side} view`}
        style={{ display: 'block' }}
      >
        {/* Garment body fill */}
        <path d={PATHS[garmentType][side]} fill={color.hex} stroke={svgStr} strokeWidth="1.5"/>

        {/* T-shirt: collar curve (front) / neck tag (back) */}
        {isShirt && isFront  && <path d="M168,35 C182,62 218,62 232,35" fill="none" stroke={pgStr} strokeWidth="1.2"/>}
        {isShirt && !isFront && <rect x="186" y="40" width="28" height="7" rx="1.5" fill={acc}/>}

        {/* Hoodie front: collar mask, drawstrings, pocket */}
        {isHoodie && isFront && <>
          <path d="M165,60 L235,60 C221,88 179,88 165,60 Z" fill="#fff" stroke="none"/>
          <path d="M165,60 C179,88 221,88 235,60" fill="none" stroke={pgStr} strokeWidth="1.2"/>
          <line x1="187" y1="100" x2="183" y2="158" stroke={strC} strokeWidth="1.5" strokeLinecap="round"/>
          <circle cx="183" cy="161" r="3" fill={strC}/>
          <line x1="213" y1="100" x2="217" y2="158" stroke={strC} strokeWidth="1.5" strokeLinecap="round"/>
          <circle cx="217" cy="161" r="3" fill={strC}/>
          <path d="M132,290 Q200,278 268,290 L268,360 L132,360 Z" fill="none" stroke={pktC} strokeWidth="1.2"/>
        </>}

        {/* Zipper front: collar mask, zipper line + tab */}
        {isZipper && isFront && <>
          <path d="M165,60 L235,60 C221,88 179,88 165,60 Z" fill="#fff" stroke="none"/>
          <path d="M165,60 C179,88 221,88 235,60" fill="none" stroke={pgStr} strokeWidth="1.2"/>
          <line x1="200" y1="88" x2="200" y2="440" stroke={strC} strokeWidth="1.5" strokeLinecap="round"/>
          <rect x="194" y="155" width="12" height="18" rx="2" fill={strC} opacity="0.9"/>
          <line x1="197" y1="164" x2="203" y2="164" stroke={color.hex} strokeWidth="1"/>
        </>}

        {/* Hoodie + Zipper back: hood drape, seam, neck tag */}
        {(isHoodie || isZipper) && !isFront && <>
          <path d="M118,40 Q200,18 282,40"  fill="none" stroke={acc} strokeWidth="1"/>
          <path d="M100,58 Q200,82 300,58"  fill="none" stroke={acc} strokeWidth="1.5"/>
          <rect x="186" y="92" width="28" height="7" rx="1.5" fill={acc}/>
        </>}

        {/* Print area guide — dashed rect for the active preset zone */}
        <rect
          x={activePreset.svgX} y={activePreset.svgY}
          width={activePreset.svgW} height={activePreset.svgH}
          fill="none" stroke={pgStr} strokeWidth="1" strokeDasharray="5,4"
        />

        {/* Measurement overlay — arrows + text annotating key dimensions */}
        {mData && <>
          <defs>
            {(['len','chs','slv'] as const).map(id => (
              <React.Fragment key={id}>
                <marker id={`ma-${id}`} markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
                  <path d="M0,0 L6,3 L0,6" fill="none" stroke={ac} strokeWidth="1.2"/>
                </marker>
                <marker id={`mb-${id}`} markerWidth="6" markerHeight="6" refX="1" refY="3" orient="auto">
                  <path d="M6,0 L0,3 L6,6" fill="none" stroke={ac} strokeWidth="1.2"/>
                </marker>
              </React.Fragment>
            ))}
          </defs>
          {/* Length — vertical right */}
          <line x1={338} y1={shoulderY} x2={338} y2={hemY} stroke={ac} strokeWidth="1.2"
            markerEnd="url(#ma-len)" markerStart="url(#mb-len)"/>
          <line x1={bodyR} y1={shoulderY} x2={344} y2={shoulderY} stroke={ac} strokeWidth="0.8" strokeDasharray="3,2"/>
          <line x1={bodyR} y1={hemY}      x2={344} y2={hemY}      stroke={ac} strokeWidth="0.8" strokeDasharray="3,2"/>
          <text x={362} y={(shoulderY + hemY) / 2 + 4} fill={tc} fontSize="11" fontFamily="sans-serif"
            fontWeight="700" textAnchor="middle" transform={`rotate(-90 362 ${(shoulderY + hemY) / 2})`}>
            {mData.length}cm
          </text>
          {/* Chest — horizontal */}
          <line x1={bodyL} y1={chestY} x2={bodyR} y2={chestY} stroke={ac} strokeWidth="1.2"
            markerEnd="url(#ma-chs)" markerStart="url(#mb-chs)"/>
          <text x={(bodyL + bodyR) / 2} y={chestY - 6} fill={tc} fontSize="11"
            fontFamily="sans-serif" fontWeight="700" textAnchor="middle">{mData.chest}cm</text>
          {/* Sleeve — diagonal */}
          <line x1={slvStartX} y1={slvStartY} x2={sleeveEndX} y2={sleeveEndY} stroke={ac} strokeWidth="1.2"
            markerEnd="url(#ma-slv)" markerStart="url(#mb-slv)"/>
          <text x={(slvStartX + sleeveEndX) / 2 - 10} y={(slvStartY + sleeveEndY) / 2 - 8}
            fill={tc} fontSize="10" fontFamily="sans-serif" fontWeight="700" textAnchor="middle">
            {mData.sleeve}cm
          </text>
        </>}
      </svg>

      {/* Canvas — transparent overlay where the uploaded design is rendered via drawImage */}
      <canvas ref={canvasRef} className="absolute top-0 left-0 pointer-events-none"/>

      {/* FRONT / BACK badge */}
      <div className="absolute top-2 right-2 bg-on-surface text-surface font-body text-[11px] tracking-[0.22em] uppercase px-2 py-0.5">
        {isFront ? t('designFront') : t('designBack')}
      </div>
    </div>
  )
}

export function SideToggle({ side, hasDesign, onToggle }: SideToggleProps) {
  const t = useTranslations('GarmentDesigner')
  const sideLabels = { front: t('designFront'), back: t('designBack') }
  return (
    <div className="flex border border-on-surface mt-2.5" role="group" aria-label="View side">
      {(['front', 'back'] as const).map((s) => (
        <button
          key={s}
          type="button"
          onClick={() => onToggle(s)}
          aria-pressed={side === s}
          className={cn(
            'flex-1 py-2.5 flex items-center justify-center gap-1.5',
            'font-body text-[11px] tracking-[0.2em] uppercase transition-colors',
            side === s
              ? 'bg-on-surface text-surface'
              : 'bg-surface text-on-surface hover:bg-on-surface/10',
          )}
        >
          {sideLabels[s]}
          {/* Green dot — signals a design has been uploaded on this side */}
          {hasDesign[s] && (
            <span className="w-1.5 h-1.5 rounded-full bg-success inline-block" aria-hidden="true"/>
          )}
        </button>
      ))}
    </div>
  )
}

export function PrintPresetSelector({
  side, frontPreset, backPreset, onFrontChange, onBackChange,
}: PrintPresetSelectorProps) {
  const t       = useTranslations('GarmentDesigner')
  const presets = side === 'front' ? FRONT_PRESETS : BACK_PRESETS
  const active  = side === 'front' ? frontPreset : backPreset

  const presetLabelMap: Record<string, string> = {
    logo:      t('presetLogo'),
    standard:  t('presetStandard'),
    oversized: t('presetOversized'),
  }

  function handleChange(id: string) {
    if (side === 'front') onFrontChange(id as FrontPresetId)
    else                  onBackChange(id as BackPresetId)
  }

  return (
    <div className="mt-2.5">
      <p className={cn(LABEL_CLS, 'mb-1.5')}>{t('printAreaGuide')}</p>
      <div className="flex gap-1">
        {presets.map((p) => (
          <button
            key={p.id}
            type="button"
            onClick={() => handleChange(p.id)}
            aria-pressed={active === p.id}
            className={cn(
              'flex-1 px-1 py-1.5 text-center border transition-colors',
              active === p.id
                ? 'bg-on-surface text-surface border-on-surface'
                : 'bg-surface text-on-surface-muted border-border-subtle hover:border-on-surface',
            )}
          >
            <span className="block font-body text-[11px] font-bold tracking-[0.16em] uppercase">{presetLabelMap[p.id] ?? p.label}</span>
            <span className="block font-body text-[10px] opacity-65 mt-0.5">{p.cm}</span>
            <span className="block font-body text-[9px] uppercase tracking-[0.06em] opacity-50 mt-0.5">{t(p.descKey as 'presetDescLeftBreast')}</span>
          </button>
        ))}
      </div>
    </div>
  )
}

export function RemoveLinks({ hasDesign, onRemoveFront, onRemoveBack }: RemoveLinksProps) {
  const t = useTranslations('GarmentDesigner')
  if (!hasDesign.front && !hasDesign.back) return null
  return (
    <div className="flex gap-3.5 mt-2 justify-end">
      {hasDesign.front && (
        <button
          type="button"
          onClick={onRemoveFront}
          className="font-body text-[11px] tracking-[0.15em] uppercase text-destructive underline decoration-destructive/40 hover:decoration-destructive transition-colors"
        >
          {t('removeFront')}
        </button>
      )}
      {hasDesign.back && (
        <button
          type="button"
          onClick={onRemoveBack}
          className="font-body text-[11px] tracking-[0.15em] uppercase text-destructive underline decoration-destructive/40 hover:decoration-destructive transition-colors"
        >
          {t('removeBack')}
        </button>
      )}
    </div>
  )
}

export function MeasurementsPanel({
  show, gender, garmentType, size, onToggle, onGenderChange,
}: MeasurementsPanelProps) {
  const t = useTranslations('GarmentDesigner')
  const mData = show && size
    ? SIZE_DATA[garmentType][gender].find(r => r.size === size)
    : null

  return (
    <div className="mt-2.5">
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={onToggle}
          className={cn(
            'flex items-center gap-1.5 font-body text-[11px] tracking-[0.16em] uppercase transition-colors',
            show ? 'text-on-surface' : 'text-on-surface-muted',
          )}
        >
          <Ruler size={14}/>
          {show ? t('hideMeasurements') : t('showMeasurements')}
        </button>
        {show && (
          <div className="flex gap-1">
            {(['men', 'women'] as const).map((g) => (
              <button
                key={g}
                type="button"
                onClick={() => onGenderChange(g)}
                className={cn(
                  'font-body text-[10px] tracking-[0.14em] uppercase px-2 py-0.5 border transition-colors',
                  gender === g
                    ? 'bg-on-surface text-surface border-on-surface'
                    : 'bg-transparent text-on-surface-muted border-border-subtle hover:border-on-surface',
                )}
              >
                {g === 'men' ? t('measureMen') : t('measureWomen')}
              </button>
            ))}
          </div>
        )}
      </div>

      {mData && (
        <div className="grid grid-cols-4 gap-1.5 mt-2">
          {[
            { key: 'measureLength', value: `${mData.length} cm` },
            { key: 'measureChest',  value: `${mData.chest} cm`  },
            { key: 'measureSleeve', value: `${mData.sleeve} cm` },
            ...(mData.waist ? [{ key: 'measureWaist', value: `${mData.waist} cm` }] : []),
          ].map(({ key, value }) => (
            <div key={key} className="border border-border-subtle p-2 text-center">
              <p className={cn(LABEL_CLS, 'text-[10px] mb-1')}>{t(key as 'measureLength')}</p>
              <p className="font-display text-lg text-on-surface">{value}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export function GarmentTypeSelector({ value, onChange }: GarmentTypeSelectorProps) {
  const t = useTranslations('GarmentDesigner')
  const garmentLabels: Record<GarmentType, string> = {
    tshirt: t('garmentTShirt'),
    hoodie: t('garmentHoodie'),
    zipper: t('garmentZipper'),
  }
  return (
    <div>
      <p className={cn(LABEL_CLS, 'mb-1.5')}>{t('garmentLabel')}</p>
      <div className="flex border border-on-surface">
        {GARMENT_TYPES.map((g) => (
          <button
            key={g}
            type="button"
            onClick={() => onChange(g)}
            aria-pressed={value === g}
            className={cn(
              'flex-1 py-2.5 text-center border-none transition-colors',
              value === g
                ? 'bg-on-surface text-surface'
                : 'bg-surface text-on-surface hover:bg-on-surface/10',
            )}
          >
            <span className="block font-body text-[12px] tracking-[0.18em] uppercase font-bold">
              {garmentLabels[g]}
            </span>
            <span className="block font-body text-[11px] opacity-50 mt-0.5">
              {t('from')} €{BP[g]['S'].toFixed(2)}
            </span>
          </button>
        ))}
      </div>
    </div>
  )
}

export function DesignUploadZone({ side, fileRef, onFilePick }: DesignUploadZoneProps) {
  const t = useTranslations('GarmentDesigner')
  return (
    <div>
      <p className={cn(LABEL_CLS, 'mb-1.5')}>
        {t('designLabel')}{' '}
        <span className="uppercase tracking-[0.12em] text-on-surface-muted">
          ({side === 'front' ? t('designFront') : t('designBack')})
        </span>
      </p>
      {/* Drop zone — click opens file picker; drag-and-drop also supported */}
      <div
        onClick={() => fileRef.current?.click()}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault()
          const f = e.dataTransfer.files[0]
          if (f) onFilePick(f)
        }}
        className="border border-dashed border-border-subtle p-6 text-center cursor-pointer hover:bg-surface-raised transition-colors"
        role="button"
        tabIndex={0}
        aria-label={t('uploadAriaLabel')}
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') fileRef.current?.click() }}
      >
        <Upload size={18} className="mx-auto mb-2 text-on-surface-muted"/>
        <p className="font-body text-[13px] text-on-surface-muted tracking-[0.08em]">
          {t('uploadCta')}
        </p>
      </div>
      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        className="sr-only"
        onChange={(e) => { if (e.target.files?.[0]) onFilePick(e.target.files[0]) }}
      />
    </div>
  )
}

export function ColorSwatches({ color, onChange }: ColorSwatchesProps) {
  const t          = useTranslations('GarmentDesigner')
  const colorLabel = useColorLabel()
  return (
    <div>
      <p className={cn(LABEL_CLS, 'mb-1.5')}>
        {t('colorLabel')}:{' '}
        <span className="normal-case tracking-normal text-on-surface">{colorLabel(color.name)}</span>
      </p>
      <div className="flex gap-2">
        {GCOLORS.map((c) => (
          <button
            key={c.name}
            type="button"
            aria-label={c.name}
            aria-pressed={color.name === c.name}
            onClick={() => onChange(c)}
            /* dynamic swatch colour — cannot use a static Tailwind class */
            style={{ '--swatch-color': c.hex } as React.CSSProperties}
            className={cn(
              'w-6 h-6 rounded-full transition-transform hover:scale-110 bg-[var(--swatch-color)]',
              c.outline && 'border border-on-surface/20',
              color.name === c.name && 'ring-2 ring-offset-2 ring-on-surface',
            )}
          />
        ))}
      </div>
    </div>
  )
}

export function SizeSelector({ size, onChange }: SizeSelectorProps) {
  const t = useTranslations('GarmentDesigner')
  return (
    <div>
      <p className={cn(LABEL_CLS, 'mb-1.5')}>
        {t('sizeLabel')}:{' '}
        <span className="normal-case tracking-normal text-on-surface">{size ?? ''}</span>
      </p>
      <div className="flex flex-wrap gap-1.5">
        {SIZES.map((s) => (
          <button
            key={s}
            type="button"
            aria-pressed={size === s}
            onClick={() => onChange(s)}
            className={cn(
              'px-3.5 py-2 font-body text-[12px] tracking-[0.15em] border transition-colors',
              size === s
                ? 'bg-on-surface text-surface border-on-surface'
                : 'bg-surface text-on-surface border-border-subtle hover:border-on-surface',
            )}
          >
            {s}
          </button>
        ))}
      </div>
    </div>
  )
}

export function FitSelector({ fit, onChange }: FitSelectorProps) {
  const t = useTranslations('GarmentDesigner')
  return (
    <div>
      <p className={cn(LABEL_CLS, 'mb-1.5')}>{t('fitLabel')}</p>
      <div className="flex border border-on-surface">
        {FIT_TYPES.map((f) => (
          <button
            key={f}
            type="button"
            onClick={() => onChange(f)}
            aria-pressed={fit === f}
            className={cn(
              'flex-1 py-2.5 text-center transition-colors',
              fit === f
                ? 'bg-on-surface text-surface'
                : 'bg-surface text-on-surface hover:bg-on-surface/10',
            )}
          >
            <span className="block font-body text-[12px] tracking-[0.15em] uppercase font-bold">
              {f === 'normal' ? t('fitNormal') : t('fitOversized')}
            </span>
            <span className="block font-body text-[11px] opacity-50 mt-0.5">
              {f === 'normal' ? t('fitNormalSub') : t('fitOversizedSub')}
            </span>
          </button>
        ))}
      </div>
    </div>
  )
}

export function PrintMethodSelector({ printMethod, onChange }: PrintMethodSelectorProps) {
  const t = useTranslations('GarmentDesigner')
  return (
    <div>
      <p className={cn(LABEL_CLS, 'mb-1.5')}>{t('printMethodLabel')}</p>
      <div className="flex border border-on-surface">
        {PRINT_METHODS.map((p) => (
          <button
            key={p}
            type="button"
            onClick={() => onChange(p)}
            aria-pressed={printMethod === p}
            className={cn(
              'flex-1 py-2.5 text-center transition-colors',
              printMethod === p
                ? 'bg-on-surface text-surface'
                : 'bg-surface text-on-surface hover:bg-on-surface/10',
            )}
          >
            <span className="block font-body text-[12px] tracking-[0.15em] uppercase font-bold">
              {p === 'dtg' ? t('printDtg') : t('printEmbroidery')}
            </span>
            <span className="block font-body text-[11px] opacity-50 mt-0.5">
              {p === 'dtg' ? t('printDtgSub') : t('printEmbroiderySub')}
            </span>
          </button>
        ))}
      </div>
    </div>
  )
}

export function QuantityStepper({ qty, onChange }: QuantityStepperProps) {
  const t = useTranslations('GarmentDesigner')
  return (
    <div>
      <p className={cn(LABEL_CLS, 'mb-2')}>{t('qtyLabel')}</p>
      <div className="inline-flex items-center border border-on-surface">
        <button
          type="button"
          onClick={() => onChange(Math.max(1, qty - 1))}
          aria-label={t('decreaseQty')}
          className={cn(
            'w-10 h-10 flex items-center justify-center font-body text-xl leading-none transition-colors',
            qty <= 1 ? 'text-on-surface-muted cursor-default' : 'text-on-surface hover:bg-on-surface/10',
          )}
        >
          −
        </button>
        <input
          type="text"
          inputMode="numeric"
          value={qty}
          onChange={(e) => {
            const raw = e.target.value.replace(/[^0-9]/g, '')
            if (!raw) { onChange(1); return }
            onChange(Math.max(1, parseInt(raw, 10)))
          }}
          aria-label={t('qtyAriaLabel')}
          className="w-12 h-10 text-center font-body text-base font-bold text-on-surface bg-transparent border-none outline-none"
        />
        <button
          type="button"
          onClick={() => onChange(qty + 1)}
          aria-label={t('increaseQty')}
          className="w-10 h-10 flex items-center justify-center font-body text-xl leading-none text-on-surface hover:bg-on-surface/10 transition-colors"
        >
          +
        </button>
      </div>
    </div>
  )
}

export function PriceDisplay({ price, qty, fit, printMethod, size, hasDesign, onPlaceOrder }: PriceDisplayProps) {
  const t          = useTranslations('GarmentDesigner')
  const total      = price !== null ? price * qty : null
  const noDesign   = !hasDesign.front && !hasDesign.back
  // Button is ready only when both a size and at least one design side are present
  const canOrder   = !!size && !noDesign
  const btnLabel   = !size
    ? t('selectSize')
    : noDesign
    ? t('uploadDesign')
    : t('placeOrder')

  return (
    <div className="pt-5 border-t border-border-subtle">
      <div className="flex items-baseline gap-2.5 mb-1">
        <span className="font-display text-5xl text-on-surface">
          {total !== null ? `€${total.toFixed(2)}` : '-'}
        </span>
        {fit === 'oversized'          && <span className="font-body text-[13px] text-on-surface-muted">{t('oversizedSurcharge')}</span>}
        {printMethod === 'embroidery' && <span className="font-body text-[13px] text-on-surface-muted">{t('embroiderySurcharge')}</span>}
      </div>
      {price !== null && qty > 1 && (
        <p className="font-body text-[12px] text-on-surface-muted mb-1">
          €{price.toFixed(2)} × {qty}
        </p>
      )}
      <p className="font-body text-[12px] text-on-surface-muted tracking-[0.06em] mb-4">
        {t('inclPrinting')}
      </p>
      <button
        type="button"
        onClick={onPlaceOrder}
        disabled={!canOrder}
        className={cn(
          'w-full py-4 font-body text-[12px] tracking-[0.22em] uppercase font-bold transition-opacity',
          canOrder
            ? 'bg-on-surface text-surface hover:opacity-80'
            : 'bg-on-surface/30 text-surface/60 cursor-not-allowed',
        )}
      >
        {btnLabel}
      </button>
    </div>
  )
}

export function OrderSummaryTable({
  garmentType, color, size, fit, printMethod, hasDesign,
  frontPreset, backPreset, price, qty,
}: OrderSummaryProps) {
  const t          = useTranslations('GarmentDesigner')
  const colorLabel = useColorLabel()
  const frontP = FRONT_PRESETS.find(p => p.id === frontPreset) ?? FRONT_PRESETS[0]
  const backP  = BACK_PRESETS.find(p => p.id === backPreset)   ?? BACK_PRESETS[0]
  const total  = price !== null && qty > 0 ? price * qty : null

  const garmentLabels: Record<GarmentType, string> = {
    tshirt: t('garmentTShirt'),
    hoodie: t('garmentHoodie'),
    zipper: t('garmentZipper'),
  }

  const presetLabelMap: Record<string, string> = {
    logo:      t('presetLogo'),
    standard:  t('presetStandard'),
    oversized: t('presetOversized'),
  }

  const sides = hasDesign.front && hasDesign.back
    ? t('frontAndBack')
    : hasDesign.front ? t('frontOnly') : t('backOnly')

  const rows: [string, string][] = [
    [t('rowGarment'),   garmentLabels[garmentType]],
    [t('rowColor'),     colorLabel(color.name)],
    [t('rowSize'),      size ?? '-'],
    [t('rowFit'),       fit === 'oversized' ? t('fitOversizedFull') : t('fitNormalFull')],
    [t('rowPrint'),     printMethod === 'dtg' ? t('printDtgFull') : t('printEmbroideryFull')],
    [t('rowSides'),     sides],
    ...(hasDesign.front ? [[t('rowPosFront'), `${presetLabelMap[frontP.id] ?? frontP.label}, ${frontP.cm}`] as [string, string]] : []),
    ...(hasDesign.back  ? [[t('rowPosBack'),  `${presetLabelMap[backP.id]  ?? backP.label}, ${backP.cm}`]  as [string, string]] : []),
    [t('rowUnitPrice'), price !== null ? `€${price.toFixed(2)}` : '-'],
    [t('rowQty'),       String(qty)],
    [t('rowTotal'),     total !== null ? `€${total.toFixed(2)}` : '-'],
  ]

  return (
    <div className="bg-surface-raised px-4 py-3.5 mb-7">
      {rows.map(([k, v], i, a) => (
        <div
          key={k}
          className={cn(
            'flex justify-between py-2 font-body text-base',
            i < a.length - 1 ? 'border-b border-border-subtle' : 'font-bold pt-3 mt-1',
          )}
        >
          <span className="font-body text-[11px] tracking-[0.18em] uppercase text-on-surface-muted">
            {k}
          </span>
          <span className="uppercase text-on-surface">{v}</span>
        </div>
      ))}
    </div>
  )
}

// Red required-field marker shown inside an empty input (top-left); hidden once
// the field has any value. pointer-events-none so it never blocks typing.
function RequiredMark({ show }: { show: boolean }) {
  if (!show) return null
  return (
    <span
      aria-hidden="true"
      className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-destructive font-body text-base leading-none"
    >
      *
    </span>
  )
}

export function OrderForm({ onSubmit, isLoading }: OrderFormProps) {
  const t = useTranslations('GarmentDesigner')
  // Schema created inside the component so validation messages are locale-aware
  const schema = React.useMemo(() => z.object({
    name:    z.string().min(2, t('validationName')),
    phone:   z.string().min(8, t('validationPhone')),
    email:   z.string().email(t('validationEmail')),
    address: z.string().min(3, t('validationAddress')),
    city:    z.string().min(2, t('validationCity')),
    zip:     z.string().min(3, t('validationZip')),
    notes:   z.string().max(500).optional(),
  }), [t])
  const { register, handleSubmit, control, formState: { errors } } = useForm<OrderFields>({
    resolver: zodResolver(schema),
  })

  // Live values drive the empty-state required asterisks (useWatch is React-Compiler safe)
  const v = useWatch({ control })

  const INPUT_CLS = 'w-full px-3 py-2.5 font-body text-base bg-surface border border-on-surface text-on-surface focus:outline-none'
  const ERR_CLS   = 'font-body text-sm text-destructive mt-1'

  // Phone: allow only digits, spaces and a leading +. Zip: digits only.
  // Sanitize before RHF reads the value so letters can never be entered (incl. paste).
  const phoneReg = register('phone')
  const zipReg   = register('zip')

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <div className="grid grid-cols-2 gap-4 mb-3.5">
        <div>
          <label htmlFor="order-name" className={cn(LABEL_CLS, 'block mb-1')}>{t('fieldName')}</label>
          <div className="relative">
            <input id="order-name" {...register('name')} className={INPUT_CLS} placeholder={t('placeholderName')}/>
            <RequiredMark show={!v.name}/>
          </div>
          {errors.name && <p className={ERR_CLS}>{errors.name.message}</p>}
        </div>
        <div>
          <label htmlFor="order-phone" className={cn(LABEL_CLS, 'block mb-1')}>{t('fieldPhone')}</label>
          <div className="relative">
            <input
              id="order-phone"
              {...phoneReg}
              onChange={(e) => { e.target.value = e.target.value.replace(/[^\d+\s]/g, ''); phoneReg.onChange(e) }}
              inputMode="tel"
              maxLength={16}
              className={INPUT_CLS}
              placeholder="+30 6940000000"
            />
            <RequiredMark show={!v.phone}/>
          </div>
          {errors.phone && <p className={ERR_CLS}>{errors.phone.message}</p>}
        </div>
      </div>
      <div className="mb-3.5">
        <label htmlFor="order-email" className={cn(LABEL_CLS, 'block mb-1')}>{t('fieldEmail')}</label>
        <div className="relative">
          <input id="order-email" type="email" {...register('email')} className={INPUT_CLS} placeholder={t('emailPlaceholder')}/>
          <RequiredMark show={!v.email}/>
        </div>
        {errors.email && <p className={ERR_CLS}>{errors.email.message}</p>}
      </div>
      <div className="mb-3.5">
        <label htmlFor="order-address" className={cn(LABEL_CLS, 'block mb-1')}>{t('fieldAddress')}</label>
        <div className="relative">
          <input id="order-address" {...register('address')} className={INPUT_CLS} placeholder={t('placeholderStreet')}/>
          <RequiredMark show={!v.address}/>
        </div>
        {errors.address && <p className={ERR_CLS}>{errors.address.message}</p>}
      </div>
      <div className="grid grid-cols-2 gap-4 mb-3.5">
        <div>
          <label htmlFor="order-city" className={cn(LABEL_CLS, 'block mb-1')}>{t('fieldCity')}</label>
          <div className="relative">
            <input id="order-city" {...register('city')} className={INPUT_CLS} placeholder={t('placeholderCity')}/>
            <RequiredMark show={!v.city}/>
          </div>
          {errors.city && <p className={ERR_CLS}>{errors.city.message}</p>}
        </div>
        <div>
          <label htmlFor="order-zip" className={cn(LABEL_CLS, 'block mb-1')}>{t('fieldZip')}</label>
          <div className="relative">
            <input
              id="order-zip"
              {...zipReg}
              onChange={(e) => { e.target.value = e.target.value.replace(/\D/g, ''); zipReg.onChange(e) }}
              inputMode="numeric"
              maxLength={5}
              className={INPUT_CLS}
              placeholder="10431"
            />
            <RequiredMark show={!v.zip}/>
          </div>
          {errors.zip && <p className={ERR_CLS}>{errors.zip.message}</p>}
        </div>
      </div>
      <div className="mb-6">
        <label htmlFor="order-notes" className={cn(LABEL_CLS, 'block mb-1')}>{t('fieldNotes')}</label>
        <textarea
          id="order-notes"
          {...register('notes')}
          rows={3}
          className={cn(INPUT_CLS, 'resize-none')}
          placeholder={t('placeholderNotes')}
        />
      </div>
      <button
        type="submit"
        disabled={isLoading}
        className="w-full py-4 bg-on-surface text-surface font-body text-[12px] tracking-[0.22em] uppercase font-bold hover:opacity-80 transition-opacity disabled:opacity-50"
      >
        {isLoading ? t('sendingOrder') : t('sendOrder')}
      </button>
    </form>
  )
}

export function OrderSuccess({ orderId, onReset }: OrderSuccessProps) {
  const t = useTranslations('GarmentDesigner')
  return (
    <div className="text-center py-16">
      {/* Black circle with checkmark */}
      <div className="w-14 h-14 bg-on-surface flex items-center justify-center mx-auto mb-6">
        <Check size={26} className="text-surface"/>
      </div>
      <h3 className="font-display text-5xl tracking-[0.1em] text-on-surface mb-2.5">
        {t('orderReceived')}
      </h3>
      <p className="font-body text-base text-on-surface-muted mb-3 leading-relaxed">
        {t('orderConfirmBody')}
      </p>
      {orderId && (
        <p className="font-body text-[13px] tracking-[0.14em] text-on-surface-muted mb-8">
          {t('orderIdPrefix')} {orderId}
        </p>
      )}
      <button
        type="button"
        onClick={onReset}
        className="px-8 py-3.5 bg-on-surface text-surface font-body text-[12px] tracking-[0.22em] uppercase font-bold hover:opacity-80 transition-opacity"
      >
        {t('designAnother')}
      </button>
    </div>
  )
}

export function StepIndicator({ step }: StepIndicatorProps) {
  const t = useTranslations('GarmentDesigner')
  const STEPS: { key: DesignStep; label: string }[] = [
    { key: 'design',  label: t('stepDesign')        },
    { key: 'form',    label: t('stepDetails')       },
    { key: 'success', label: t('stepConfirmation')  },
  ]
  const activeIdx = STEPS.findIndex(s => s.key === step)

  return (
    <div className="flex items-center gap-3 mb-10" aria-label={t('stepsAriaLabel')}>
      {STEPS.map(({ key, label }, i) => {
        const isActive = key === step
        const isDone   = i < activeIdx
        return (
          <React.Fragment key={key}>
            <div className="flex items-center gap-2.5">
              <span
                className={cn(
                  'w-9 h-9 rounded-full flex items-center justify-center font-body text-[14px] font-semibold',
                  isActive ? 'bg-on-surface text-surface'           :
                  isDone   ? 'bg-on-surface/30 text-on-surface'     :
                             'bg-surface-raised text-on-surface-muted border border-border-subtle',
                )}
              >
                {i + 1}
              </span>
              <span
                className={cn(
                  LABEL_CLS, 'text-[13px] tracking-[0.15em]',
                  isActive ? 'text-on-surface' : 'text-on-surface-muted',
                )}
              >
                {label}
              </span>
            </div>
            {i < 2 && <div className="flex-1 h-px bg-border-subtle"/>}
          </React.Fragment>
        )
      })}
    </div>
  )
}

// ─── Main GarmentDesigner ─────────────────────────────────────────────────────

export function GarmentDesigner() {
  // ── State ──────────────────────────────────────────────────────────────────
  const [garmentType,    setGarmentType]    = useState<GarmentType>('tshirt')
  const [color,          setColor]          = useState<GarmentColor>(GCOLORS[1]) // Black
  const [fit,            setFit]            = useState<FitType>('normal')
  const [printMethod,    setPrintMethod]    = useState<PrintMethod>('dtg')
  const [size,           setSize]           = useState<SizeKey | null>(null)
  const [side,           setSide]           = useState<'front' | 'back'>('front')
  const [frontPreset,    setFrontPreset]    = useState<FrontPresetId>('standard')
  const [backPreset,     setBackPreset]     = useState<BackPresetId>('standard')
  const [hasDesign,      setHasDesign]      = useState<{ front: boolean; back: boolean }>({ front: false, back: false })
  const [showMeasure,    setShowMeasure]    = useState(false)
  const [measureGender,  setMeasureGender]  = useState<'men' | 'women'>('men')
  const [qty,            setQty]            = useState(1)
  const [step,           setStep]           = useState<DesignStep>('design')
  const [orderId,        setOrderId]        = useState('')
  const [isSubmitting,   setIsSubmitting]   = useState(false)
  const [showEjs,        setShowEjs]        = useState(false)
  const [sendErr,        setSendErr]        = useState('')

  // EmailJS credentials — read from env vars, overridable via the settings panel
  const [ejsSvc,   setEjsSvc]   = useState(process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID   ?? '')
  const [ejsTpl,   setEjsTpl]   = useState(process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID  ?? '')
  const [ejsKey,   setEjsKey]   = useState(process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY   ?? '')
  const [ejsRecip, setEjsRecip] = useState(process.env.NEXT_PUBLIC_EMAILJS_RECIPIENT    ?? '')

  // ── Refs ────────────────────────────────────────────────────────────────────
  const cvRef   = useRef<HTMLCanvasElement>(null)
  const fileRef = useRef<HTMLInputElement>(null)
  // Design image state — mutable ref avoids triggering re-renders on canvas draws
  const iRef    = useRef<DesignImgState>({ el: null, x: 0, y: 0, w: 0, h: 0 })
  // Per-side persistence — saves image state when switching front/back
  const savedRef  = useRef<{ front: DesignImgState | null; back: DesignImgState | null }>({ front: null, back: null })
  const viewRef   = useRef<'front' | 'back'>('front')

  // ── Derived values ──────────────────────────────────────────────────────────
  const price      = size ? getPrice(garmentType, size, fit, printMethod) : null
  const activePreset = (side === 'front'
    ? FRONT_PRESETS.find(p => p.id === frontPreset)
    : BACK_PRESETS.find(p => p.id === backPreset)
  ) ?? (side === 'front' ? FRONT_PRESETS[0] : BACK_PRESETS[0])

  const { showToast } = useUIStore()
  const t = useTranslations('GarmentDesigner')

  // ── Canvas setup ────────────────────────────────────────────────────────────
  useEffect(() => {
    const cv = cvRef.current
    if (cv) { cv.width = CW; cv.height = CH }
  }, [])


  // draw — clears canvas and redraws the current design image at its stored position
  const draw = useCallback(() => {
    const cv = cvRef.current
    if (!cv) return
    const ctx = cv.getContext('2d')
    if (!ctx) return
    ctx.clearRect(0, 0, CW, CH)
    const img = iRef.current
    if (!img.el) return
    ctx.drawImage(img.el, img.x, img.y, img.w, img.h)
  }, [])

  // ── Design persistence (front / back switching) ─────────────────────────────
  function saveD() {
    const i = iRef.current
    savedRef.current[viewRef.current] = { el: i.el, x: i.x, y: i.y, w: i.w, h: i.h }
  }

  function loadD(v: 'front' | 'back') {
    const d = savedRef.current[v]
    if (d) Object.assign(iRef.current, { el: d.el, x: d.x, y: d.y, w: d.w, h: d.h })
    else   Object.assign(iRef.current, { el: null, x: 0, y: 0, w: 0, h: 0 })
  }

  function switchView(v: 'front' | 'back') {
    saveD()
    viewRef.current = v
    setSide(v)
    loadD(v)
    requestAnimationFrame(draw)
  }

  // ── Image loading ────────────────────────────────────────────────────────────
  function loadImg(file: File) {
    const pa = {
      x: activePreset.svgX * (CW / 400),
      y: activePreset.svgY * (CH / 460),
      w: activePreset.svgW * (CW / 400),
      h: activePreset.svgH * (CH / 460),
    }
    const r = new FileReader()
    r.onload = (ev) => {
      const img = new window.Image()
      img.onload = () => {
        const sc = Math.min(pa.w / img.width, pa.h / img.height) * 0.85
        Object.assign(iRef.current, {
          el: img,
          w:  img.width  * sc,
          h:  img.height * sc,
          x:  pa.x + (pa.w - img.width  * sc) / 2,
          y:  pa.y + (pa.h - img.height * sc) / 2,
        })
        draw()
        setHasDesign(p => ({ ...p, [viewRef.current]: true }))
        if (fileRef.current) fileRef.current.value = ''
      }
      img.src = ev.target?.result as string
    }
    r.readAsDataURL(file)
  }

  function removeSide(s: 'front' | 'back') {
    savedRef.current[s] = null
    setHasDesign(p => ({ ...p, [s]: false }))
    if (viewRef.current === s) {
      iRef.current.el = null
      draw()
    }
    if (fileRef.current) fileRef.current.value = ''
  }

  // ── Print preset change with image reposition ───────────────────────────────
  function applyPreset(s: 'front' | 'back', presetId: string) {
    const presets = s === 'front' ? FRONT_PRESETS : BACK_PRESETS
    const p = presets.find(pp => pp.id === presetId) ?? presets[0]
    const sx = CW / 400, sy = CH / 460
    const pa = { x: p.svgX * sx, y: p.svgY * sy, w: p.svgW * sx, h: p.svgH * sy }
    const img = iRef.current
    if (img.el) {
      const sc = Math.min(pa.w / img.el.naturalWidth, pa.h / img.el.naturalHeight) * 0.85
      img.w = img.el.naturalWidth  * sc
      img.h = img.el.naturalHeight * sc
      img.x = pa.x + (pa.w - img.w) / 2
      img.y = pa.y + (pa.h - img.h) / 2
      draw()
    }
  }

  function handleFrontPresetChange(id: FrontPresetId) {
    setFrontPreset(id)
    if (side === 'front') applyPreset('front', id)
  }

  function handleBackPresetChange(id: BackPresetId) {
    setBackPreset(id)
    if (side === 'back') applyPreset('back', id)
  }

  // ── Order flow ───────────────────────────────────────────────────────────────
  function handlePlaceOrder() {
    if (!hasDesign.front && !hasDesign.back) {
      showToast(t('uploadFirst'), 'remove')
      return
    }
    saveD()
    setStep('form')
  }

  async function handleOrderSubmit(data: OrderFields) {
    setIsSubmitting(true)
    setSendErr('')
    saveD()
    const oid = '#' + Date.now().toString().slice(-6)
    setOrderId(oid)
    try {
      if (ejsSvc && ejsTpl && ejsKey) {
        await emailjs.send(
          ejsSvc,
          ejsTpl,
          {
            order_id:       oid,
            to_email:       ejsRecip,
            customer_name:  data.name,
            customer_email: data.email,
            customer_phone: data.phone,
            customer_address: `${data.address}, ${data.city}, ${data.zip}`,
            order_garment:  ({ tshirt: t('garmentTShirt'), hoodie: t('garmentHoodie'), zipper: t('garmentZipper') } as Record<GarmentType, string>)[garmentType],
            order_color:    color.name,
            order_size:     size ?? '',
            order_fit:      fit,
            order_print:    printMethod,
            order_qty:      String(qty),
            order_total:    price !== null ? `€${(price * qty).toFixed(2)}` : '-',
            notes:          data.notes ?? '',
          },
          { publicKey: ejsKey },
        )
      }
      setStep('success')
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err)
      setSendErr(t('sendErrorPrefix') + ': ' + msg)
    } finally {
      setIsSubmitting(false)
    }
  }

  function handleReset() {
    setStep('design')
    setSize(null)
    setHasDesign({ front: false, back: false })
    setQty(1)
    setOrderId('')
    setSendErr('')
    iRef.current = { el: null, x: 0, y: 0, w: 0, h: 0 }
    savedRef.current = { front: null, back: null }
    draw()
  }

  // ── Render ───────────────────────────────────────────────────────────────────
  return (
    <section aria-label={t('designerAriaLabel')} className="w-full">
      <StepIndicator step={step}/>

      {/* ── STEP: SUCCESS ── */}
      {step === 'success' && (
        <OrderSuccess orderId={orderId} onReset={handleReset}/>
      )}

      {/* ── STEP: FORM ── */}
      {step === 'form' && (
        <div className="max-w-[580px]">
          <button
            type="button"
            onClick={() => setStep('design')}
            className="flex items-center gap-2 font-body text-[12px] tracking-[0.18em] uppercase text-on-surface mb-8 hover:opacity-70 transition-opacity"
          >
            <ArrowLeft size={16}/>
            {t('backToDesigner')}
          </button>

          <h3 className="font-display text-4xl tracking-[0.1em] text-on-surface border-b border-on-surface pb-3.5 mb-5">
            {t('orderSummaryHeading')}
          </h3>

          <OrderSummaryTable
            garmentType={garmentType}
            color={color}
            size={size}
            fit={fit}
            printMethod={printMethod}
            hasDesign={hasDesign}
            frontPreset={frontPreset}
            backPreset={backPreset}
            price={price}
            qty={qty}
          />

          <h3 className="font-display text-3xl tracking-[0.1em] text-on-surface mb-4">
            {t('customerDetailsHeading')}
          </h3>

          <OrderForm onSubmit={handleOrderSubmit} isLoading={isSubmitting}/>

          {/* EmailJS settings — collapsed by default */}
          <div className="mt-4">
            <button
              type="button"
              onClick={() => setShowEjs(!showEjs)}
              className="w-full flex justify-between items-center border border-on-surface px-4 py-2.5 font-body text-[12px] tracking-[0.18em] uppercase hover:bg-on-surface/5 transition-colors"
            >
              <span>{t('emailjsSettings')}</span>
              <span className="text-lg leading-none">{showEjs ? '−' : '+'}</span>
            </button>
            {showEjs && (
              <div className="border border-on-surface border-t-0 p-4 bg-surface-raised">
                <p className="font-body text-[13px] text-on-surface-muted leading-relaxed mb-3">
                  {t('emailjsNote')}
                </p>
                <div className="grid grid-cols-2 gap-3">
                  {([
                    [t('emailjsRecipientLabel'), 'shop@gmail.com',  ejsRecip, setEjsRecip],
                    [t('emailjsPublicKeyLabel'),  'xxxxxxxxxxxx',    ejsKey,   setEjsKey  ],
                    [t('emailjsServiceLabel'),    'service_xxx',     ejsSvc,   setEjsSvc  ],
                    [t('emailjsTemplateLabel'),   'template_xxx',    ejsTpl,   setEjsTpl  ],
                  ] as [string, string, string, (v: string) => void][]).map(([l, ph, v, s]) => (
                    <div key={l}>
                      <p className={cn(LABEL_CLS, 'text-[10px] mb-1')}>{l}</p>
                      <input
                        type="text"
                        placeholder={ph}
                        value={v}
                        onChange={(e) => s(e.target.value)}
                        className="w-full px-2.5 py-2 font-body text-sm bg-surface border border-on-surface text-on-surface focus:outline-none"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {sendErr && (
            <p className="font-body text-xs text-destructive mt-3">{sendErr}</p>
          )}
        </div>
      )}

      {/* ── STEP: DESIGN ── */}
      {step === 'design' && (
        <div className="flex gap-13 flex-wrap items-start justify-center lg:justify-start">

          {/* ── LEFT COLUMN: Preview ── */}
          <div className="flex-shrink-0">
            <GarmentPreview
              garmentType={garmentType}
              color={color}
              side={side}
              frontPreset={frontPreset}
              backPreset={backPreset}
              canvasRef={cvRef}
              showMeasurements={showMeasure}
              measureGender={measureGender}
              size={size}
            />

            <SideToggle side={side} hasDesign={hasDesign} onToggle={switchView}/>

            <PrintPresetSelector
              side={side}
              frontPreset={frontPreset}
              backPreset={backPreset}
              onFrontChange={handleFrontPresetChange}
              onBackChange={handleBackPresetChange}
            />

            <RemoveLinks
              hasDesign={hasDesign}
              onRemoveFront={() => removeSide('front')}
              onRemoveBack={() => removeSide('back')}
            />

            <MeasurementsPanel
              show={showMeasure}
              gender={measureGender}
              garmentType={garmentType}
              size={size}
              onToggle={() => setShowMeasure(v => !v)}
              onGenderChange={setMeasureGender}
            />
          </div>

          {/* ── RIGHT COLUMN: Controls ── */}
          <div className="flex-1 min-w-[260px] flex flex-col gap-4">
            <GarmentTypeSelector value={garmentType} onChange={setGarmentType}/>

            <DesignUploadZone
              side={side}
              fileRef={fileRef}
              onFilePick={loadImg}
            />

            <hr className="border-border-subtle"/>

            <ColorSwatches color={color} onChange={setColor}/>

            <hr className="border-border-subtle"/>

            <SizeSelector size={size} onChange={setSize}/>

            <hr className="border-border-subtle"/>

            <FitSelector fit={fit} onChange={setFit}/>

            <hr className="border-border-subtle"/>

            <PrintMethodSelector printMethod={printMethod} onChange={setPrintMethod}/>

            <hr className="border-border-subtle"/>

            <QuantityStepper qty={qty} onChange={setQty}/>

            <hr className="border-border-subtle"/>

            <PriceDisplay
              price={price}
              qty={qty}
              fit={fit}
              printMethod={printMethod}
              size={size}
              hasDesign={hasDesign}
              onPlaceOrder={handlePlaceOrder}
            />
          </div>

        </div>
      )}
    </section>
  )
}
