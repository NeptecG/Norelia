import React from 'react'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'

vi.mock('next-intl', () => ({
  useTranslations: () => {
    const map: Record<string, string> = {
      designFront:            'Front',
      designBack:             'Back',
      removeFront:            'Remove Front',
      removeBack:             'Remove Back',
      showMeasurements:       'Show Measurements',
      hideMeasurements:       'Hide Measurements',
      measureMen:             'Men',
      measureWomen:           'Women',
      measureLength:          'Length',
      measureChest:           'Chest',
      measureSleeve:          'Sleeve',
      measureWaist:           'Waist',
      garmentLabel:           'Garment',
      garmentTShirt:          'T-Shirt',
      garmentHoodie:          'Hoodie',
      garmentZipper:          'Zip Hoodie',
      designLabel:            'Your Design',
      uploadAriaLabel:        'Upload your design',
      uploadCta:              'Click or drop image here',
      colorLabel:             'Color',
      sizeLabel:              'Size',
      fitLabel:               'Fit',
      fitNormal:              'Normal',
      fitOversized:           'Oversized',
      fitNormalSub:           'True to size',
      fitOversizedSub:        '+1-2 sizes up',
      printMethodLabel:       'Print Method',
      printDtg:               'DTG',
      printEmbroidery:        'Embroidery',
      printDtgSub:            'Photo-quality digital',
      printEmbroiderySub:     'Premium stitched thread',
      qtyLabel:               'Qty',
      decreaseQty:            'Decrease quantity',
      qtyAriaLabel:           'Quantity',
      increaseQty:            'Increase quantity',
      selectSize:             'SELECT A SIZE',
      uploadDesign:           'UPLOAD A DESIGN',
      placeOrder:             'PLACE ORDER →',
      inclPrinting:           'Incl. printing · Free shipping over €60 · 5-7 day delivery',
      oversizedSurcharge:     '+€4 oversized',
      embroiderySurcharge:    '+€7 embroidery',
      frontAndBack:           'Front + Back',
      frontOnly:              'Front only',
      backOnly:               'Back only',
      rowGarment:             'Garment',
      rowColor:               'Color',
      rowSize:                'Size',
      rowFit:                 'Fit',
      rowPrint:               'Print',
      rowSides:               'Sides',
      rowPosFront:            'Position (Front)',
      rowPosBack:             'Position (Back)',
      rowUnitPrice:           'Unit Price',
      rowQty:                 'Qty',
      rowTotal:               'Total',
      fitOversizedFull:       'Oversized Fit',
      fitNormalFull:          'Normal Fit',
      printDtgFull:           'DTG Print',
      printEmbroideryFull:    'Embroidery',
      fieldName:              'Full Name',
      fieldPhone:             'Phone',
      fieldEmail:             'Email',
      fieldAddress:           'Street Address',
      fieldCity:              'City',
      fieldZip:               'Zip / Postcode',
      fieldNotes:             'Notes (optional)',
      placeholderName:        'Maria Papadopoulos',
      placeholderStreet:      'Street & Number',
      placeholderCity:        'Athens',
      placeholderNotes:       'Special instructions...',
      sendingOrder:           'SENDING...',
      sendOrder:              'SEND ORDER →',
      orderReceived:          'ORDER RECEIVED',
      orderConfirmBody:       'Your order details have been sent. Print-ready files have been downloaded to your computer.',
      orderIdPrefix:          'ORDER',
      designAnother:          'DESIGN ANOTHER',
      stepDesign:             'Design',
      stepDetails:            'Details',
      stepConfirmation:       'Confirmation',
      stepsAriaLabel:         'Order steps',
      designerAriaLabel:      'Garment customiser',
      backToDesigner:         'Back to Designer',
      orderSummaryHeading:    'ORDER SUMMARY',
      customerDetailsHeading: 'CUSTOMER DETAILS',
      emailjsSettings:        'EmailJS Settings',
      uploadFirst:            'Upload at least one design first.',
      printAreaGuide:         'Print Area Guide',
      presetLogo:             'Logo',
      presetStandard:         'Standard',
      presetOversized:        'Oversized',
      presetDescLeftBreast:   'Left Breast',
      presetDescCentreChest:  'Centre Chest',
      presetDescCentreBack:   'Centre Back',
      validationName:         'Name is required',
      validationPhone:        'Phone is required',
      validationEmail:        'Valid email required',
      validationAddress:      'Address is required',
      validationCity:         'City is required',
      validationZip:          'Postcode is required',
      emailPlaceholder:       'customer@email.com',
      emailjsNote:            'Sign up at emailjs.com, connect a service, create a template, then paste credentials below.',
      emailjsRecipientLabel:  'Recipient Email',
      emailjsPublicKeyLabel:  'Public Key',
      emailjsServiceLabel:    'Service ID',
      emailjsTemplateLabel:   'Template ID',
      sendErrorPrefix:        'Error',
    }
    const t = (key: string) => map[key] ?? key
    t.has = (key: string) => key in map
    return t
  },
}))
vi.mock('@/stores/ui-store', () => ({ useUIStore: vi.fn() }))
vi.mock('@/data/paths', () => ({
  PATHS: {
    tshirt: { front: 'M0 0 L100 0 L100 100 Z', back: 'M0 0 L100 0 L100 100 Z' },
    hoodie: { front: 'M0 0 L100 0 L100 100 Z', back: 'M0 0 L100 0 L100 100 Z' },
    zipper: { front: 'M0 0 L100 0 L100 100 Z', back: 'M0 0 L100 0 L100 100 Z' },
  },
}))
vi.mock('@/data/colors', () => ({
  GCOLORS: [
    { name: 'White', hex: '#FFFFFF', outline: true },
    { name: 'Black', hex: '#1e1e1e' },
  ],
}))
vi.mock('@/data/pricing', () => ({
  BP: {
    tshirt: { S: 22.99, M: 24.99, L: 24.99, XL: 26.99, '2XL': 28.99, '3XL': 30.99 },
    hoodie: { S: 42.99, M: 44.99, L: 44.99, XL: 46.99, '2XL': 49.99, '3XL': 52.99 },
    zipper: { S: 49.99, M: 52.99, L: 52.99, XL: 55.99, '2XL': 59.99, '3XL': 63.99 },
  },
}))
vi.mock('@/data/sizes', () => ({
  SIZES: ['S', 'M', 'L'],
  SIZE_DATA: {
    tshirt: {
      men:   [{ size: 'S', intl: 'S', eu: '44-46', uk: '34-36', chest: '88-92',  waist: '76-80', length: '70', sleeve: '22' }],
      women: [{ size: 'S', intl: 'S', eu: '36-38', uk: '8-10',  chest: '84-88',  waist: '68-72', length: '60', sleeve: '20' }],
    },
    hoodie: {
      men:   [{ size: 'S', intl: 'S', eu: '44-46', uk: '34-36', chest: '96-100', waist: '84-88', length: '68', sleeve: '62' }],
      women: [{ size: 'S', intl: 'S', eu: '36-38', uk: '8-10',  chest: '92-96',  waist: '76-80', length: '62', sleeve: '58' }],
    },
    zipper: {
      men:   [{ size: 'S', intl: 'S', eu: '44-46', uk: '34-36', chest: '96-100', waist: '84-88', length: '68', sleeve: '62' }],
      women: [{ size: 'S', intl: 'S', eu: '36-38', uk: '8-10',  chest: '92-96',  waist: '76-80', length: '62', sleeve: '58' }],
    },
  },
}))
vi.mock('@/lib/utils', () => ({
  cn: (...c: string[]) => c.filter(Boolean).join(' '),
  getPrice: vi.fn(() => 24.99),
}))
vi.mock('@emailjs/browser', () => ({
  default: { send: vi.fn().mockResolvedValue({ status: 200 }) },
}))

import { useUIStore } from '@/stores/ui-store'
import emailjs from '@emailjs/browser'
import { GarmentDesigner } from './garment-designer'

function setupStore() {
  vi.mocked(useUIStore).mockReturnValue({
    sidePanel:            null,
    setSidePanel:         vi.fn(),
    toggleSidePanel:      vi.fn(),
    toast:                { msg: '', visible: false, type: 'add' },
    showToast:            vi.fn(),
    showSignIn:           false,
    setShowSignIn:        vi.fn(),
    showCheckoutModal:    false,
    setShowCheckoutModal: vi.fn(),
    recentlyViewed:       [],
    addToRecent:          vi.fn(),
  })
}

/** Simulate a design file upload so the PLACE ORDER button becomes active. */
function uploadDesign() {
  const input = document.querySelector('input[type="file"]') as HTMLInputElement
  if (!input) return
  const file = new File(['fake'], 'design.png', { type: 'image/png' })
  fireEvent.change(input, { target: { files: [file] } })
}

// Synchronous FileReader — fires onload immediately when readAsDataURL is called
class MockFileReader {
  onload: ((e: ProgressEvent<FileReader>) => void) | null = null
  readAsDataURL(_file: Blob) {
    this.onload?.({ target: { result: 'data:image/png;base64,abc' } } as unknown as ProgressEvent<FileReader>)
  }
}

// Synchronous Image — fires onload immediately when src is set
class MockImage {
  onload:        (() => void) | null = null
  naturalWidth  = 100
  naturalHeight = 100
  width         = 100
  height        = 100
  private _src  = ''
  get src() { return this._src }
  set src(v: string) { this._src = v; this.onload?.() }
}

beforeEach(() => {
  vi.mocked(emailjs.send).mockClear()
  setupStore()
  // Replace FileReader and Image globally so loadImg() resolves synchronously in tests
  // @ts-expect-error — intentional class override for test synchrony
  global.FileReader = MockFileReader
  // @ts-expect-error — intentional class override for test synchrony
  window.Image = MockImage
})

afterEach(() => {
  vi.restoreAllMocks()
})

describe('GarmentDesigner', () => {
  // ─── Garment type selector ─────────────────────────────────────────────────

  it('renders garment type selector buttons (T-Shirt, Hoodie, Zip Hoodie)', () => {
    render(<GarmentDesigner />)
    expect(screen.getByRole('button', { name: /t-shirt/i })).toBeTruthy()
    // Use ^hoodie to match "Hoodie from €…" without also matching "Zip Hoodie from €…"
    expect(screen.getByRole('button', { name: /^hoodie/i })).toBeTruthy()
    expect(screen.getByRole('button', { name: /zip hoodie/i })).toBeTruthy()
  })

  // ─── Color swatches ────────────────────────────────────────────────────────

  it('renders color swatch buttons', () => {
    render(<GarmentDesigner />)
    expect(screen.getByRole('button', { name: /white/i })).toBeTruthy()
    expect(screen.getByRole('button', { name: /black/i })).toBeTruthy()
  })

  // ─── Size selector ─────────────────────────────────────────────────────────

  it('renders size buttons', () => {
    render(<GarmentDesigner />)
    expect(screen.getByRole('button', { name: 'S' })).toBeTruthy()
    expect(screen.getByRole('button', { name: 'M' })).toBeTruthy()
    expect(screen.getByRole('button', { name: 'L' })).toBeTruthy()
  })

  it('renders "SELECT A SIZE" when no size is chosen', () => {
    render(<GarmentDesigner />)
    expect(screen.getByText('SELECT A SIZE')).toBeTruthy()
  })

  it('clicking a size button updates price and changes CTA to UPLOAD A DESIGN', () => {
    render(<GarmentDesigner />)
    // Price shows "-" initially (no size selected yet)
    expect(screen.getByText('-')).toBeTruthy()
    // Click size S
    fireEvent.click(screen.getByRole('button', { name: 'S' }))
    // Price now shows the mocked getPrice value (24.99)
    expect(screen.getByText('€24.99')).toBeTruthy()
    // CTA changes to "UPLOAD A DESIGN" (size chosen but no design yet)
    expect(screen.getByText('UPLOAD A DESIGN')).toBeTruthy()
  })

  it('CTA shows PLACE ORDER after size selected AND design uploaded', () => {
    render(<GarmentDesigner />)
    fireEvent.click(screen.getByRole('button', { name: 'S' }))
    uploadDesign()
    expect(screen.getByText('PLACE ORDER →')).toBeTruthy()
  })

  // ─── Fit & print method selectors ──────────────────────────────────────────

  it('fit selector shows Normal and Oversized options', () => {
    render(<GarmentDesigner />)
    // Accessible name is "Normal True to size" — ^normal anchors to start
    expect(screen.getByRole('button', { name: /^normal/i })).toBeTruthy()
    // "Oversized" appears in both fit selector and print preset selector
    expect(screen.getAllByRole('button', { name: /oversized/i }).length).toBeGreaterThanOrEqual(1)
  })

  it('print method selector shows DTG and Embroidery options', () => {
    render(<GarmentDesigner />)
    expect(screen.getByRole('button', { name: /dtg/i })).toBeTruthy()
    expect(screen.getByRole('button', { name: /embroidery/i })).toBeTruthy()
  })

  // ─── Step indicator ────────────────────────────────────────────────────────

  it('step indicator renders "Design" as the first step label initially', () => {
    render(<GarmentDesigner />)
    expect(screen.getByText('Design')).toBeTruthy()
  })

  it('step indicator shows all three step labels', () => {
    render(<GarmentDesigner />)
    expect(screen.getByText('Design')).toBeTruthy()
    expect(screen.getByText('Details')).toBeTruthy()
    expect(screen.getByText('Confirmation')).toBeTruthy()
  })

  // ─── Print preset selector ─────────────────────────────────────────────────

  it('print preset selector shows 3 options on front side', () => {
    render(<GarmentDesigner />)
    // Default side is front — Logo / Standard / Oversized
    expect(screen.getByRole('button', { name: /^logo/i })).toBeTruthy()
    expect(screen.getAllByRole('button', { name: /standard/i }).length).toBeGreaterThanOrEqual(1)
    expect(screen.getAllByRole('button', { name: /oversized/i }).length).toBeGreaterThanOrEqual(1)
  })

  it('print preset selector shows 2 options on back side (no Logo)', () => {
    render(<GarmentDesigner />)
    // Switch to back side via SideToggle
    fireEvent.click(screen.getByRole('button', { name: /^back$/i }))
    // Logo is front-only — must not appear
    expect(screen.queryByRole('button', { name: /^logo/i })).toBeNull()
    // Standard and Oversized remain
    expect(screen.getAllByRole('button', { name: /standard/i }).length).toBeGreaterThanOrEqual(1)
    expect(screen.getAllByRole('button', { name: /oversized/i }).length).toBeGreaterThanOrEqual(1)
  })

  // ─── PLACE ORDER → step 2 ─────────────────────────────────────────────────

  it('clicking PLACE ORDER advances to the form step', () => {
    render(<GarmentDesigner />)
    fireEvent.click(screen.getByRole('button', { name: 'L' }))
    uploadDesign()
    fireEvent.click(screen.getByRole('button', { name: /place order/i }))
    // Form step — customer fields visible
    expect(screen.getByLabelText(/full name/i)).toBeTruthy()
    expect(screen.getByLabelText(/email/i)).toBeTruthy()
  })

  it('order form renders all required customer fields', () => {
    render(<GarmentDesigner />)
    fireEvent.click(screen.getByRole('button', { name: 'S' }))
    uploadDesign()
    fireEvent.click(screen.getByRole('button', { name: /place order/i }))
    expect(screen.getByLabelText(/full name/i)).toBeTruthy()
    expect(screen.getByLabelText(/phone/i)).toBeTruthy()
    expect(screen.getByLabelText(/email/i)).toBeTruthy()
    expect(screen.getByLabelText(/address/i)).toBeTruthy()
    expect(screen.getByLabelText(/city/i)).toBeTruthy()
    expect(screen.getByLabelText(/zip/i)).toBeTruthy()
  })

  it('"Back to Designer" button returns to the design step', () => {
    render(<GarmentDesigner />)
    fireEvent.click(screen.getByRole('button', { name: 'S' }))
    uploadDesign()
    fireEvent.click(screen.getByRole('button', { name: /place order/i }))
    fireEvent.click(screen.getByRole('button', { name: /back to designer/i }))
    // Design step controls are visible again
    expect(screen.getByRole('button', { name: /t-shirt/i })).toBeTruthy()
  })

  // ─── EmailJS integration ───────────────────────────────────────────────────

  it('submitting the order form advances to the success step showing ORDER RECEIVED', async () => {
    render(<GarmentDesigner />)
    fireEvent.click(screen.getByRole('button', { name: 'M' }))
    uploadDesign()
    fireEvent.click(screen.getByRole('button', { name: /place order/i }))

    fireEvent.change(screen.getByLabelText(/full name/i), { target: { value: 'Jane Doe' } })
    fireEvent.change(screen.getByLabelText(/phone/i),     { target: { value: '5555' } })
    fireEvent.change(screen.getByLabelText(/email/i),     { target: { value: 'jane@example.com' } })
    fireEvent.change(screen.getByLabelText(/address/i),   { target: { value: '123 Main St' } })
    fireEvent.change(screen.getByLabelText(/city/i),      { target: { value: 'Athens' } })
    fireEvent.change(screen.getByLabelText(/zip/i),       { target: { value: '10431' } })
    fireEvent.click(screen.getByRole('button', { name: /send order/i }))

    await waitFor(() => {
      expect(screen.getByText('ORDER RECEIVED')).toBeTruthy()
    })
  })

  it('calls emailjs.send when order form is submitted with env vars set', async () => {
    vi.stubEnv('NEXT_PUBLIC_EMAILJS_SERVICE_ID', 'svc-test')
    vi.stubEnv('NEXT_PUBLIC_EMAILJS_TEMPLATE_ID', 'tpl-test')
    vi.stubEnv('NEXT_PUBLIC_EMAILJS_PUBLIC_KEY', 'pub-test')

    render(<GarmentDesigner />)
    fireEvent.click(screen.getByRole('button', { name: 'M' }))
    uploadDesign()
    fireEvent.click(screen.getByRole('button', { name: /place order/i }))

    fireEvent.change(screen.getByLabelText(/full name/i), { target: { value: 'Test User' } })
    fireEvent.change(screen.getByLabelText(/phone/i),     { target: { value: '5555' } })
    fireEvent.change(screen.getByLabelText(/email/i),     { target: { value: 'test@example.com' } })
    fireEvent.change(screen.getByLabelText(/address/i),   { target: { value: '1 Test St' } })
    fireEvent.change(screen.getByLabelText(/city/i),      { target: { value: 'Athens' } })
    fireEvent.change(screen.getByLabelText(/zip/i),       { target: { value: '10431' } })
    fireEvent.click(screen.getByRole('button', { name: /send order/i }))

    await screen.findByText('ORDER RECEIVED')
    expect(vi.mocked(emailjs.send)).toHaveBeenCalled()

    vi.unstubAllEnvs()
  })

  // ─── Success step ──────────────────────────────────────────────────────────

  it('"DESIGN ANOTHER" button resets back to the design step', async () => {
    render(<GarmentDesigner />)
    fireEvent.click(screen.getByRole('button', { name: 'M' }))
    uploadDesign()
    fireEvent.click(screen.getByRole('button', { name: /place order/i }))

    fireEvent.change(screen.getByLabelText(/full name/i), { target: { value: 'Jane Doe' } })
    fireEvent.change(screen.getByLabelText(/phone/i),     { target: { value: '5555' } })
    fireEvent.change(screen.getByLabelText(/email/i),     { target: { value: 'jane@example.com' } })
    fireEvent.change(screen.getByLabelText(/address/i),   { target: { value: '123 Main St' } })
    fireEvent.change(screen.getByLabelText(/city/i),      { target: { value: 'Athens' } })
    fireEvent.change(screen.getByLabelText(/zip/i),       { target: { value: '10431' } })
    fireEvent.click(screen.getByRole('button', { name: /send order/i }))

    await waitFor(() => screen.getByText('ORDER RECEIVED'))
    fireEvent.click(screen.getByRole('button', { name: /design another/i }))

    // Back to step 1 — garment selector visible again
    expect(screen.getByRole('button', { name: /t-shirt/i })).toBeTruthy()
  })
})
