'use client'

import type { Product, GarmentType } from '@/types'
import { SIZE_DATA } from '@/data/sizes'
import { SizeTable } from '@/components/size-guide/size-table'
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog'

function catToGarment(cat: string): GarmentType {
  if (cat === 'HOODIES') return 'hoodie'
  if (cat === 'ZIPPERS') return 'zipper'
  return 'tshirt'
}

interface Props {
  product: Product
  open: boolean
  onClose: () => void
}

export function SizeMiniGuide({ product, open, onClose }: Props) {
  const garmentType = catToGarment(product.cat)
  const gender = product.gender === 'women' ? 'women' : 'men'
  const rows = SIZE_DATA[garmentType][gender]

  return (
    <Dialog open={open} onOpenChange={(isOpen) => { if (!isOpen) onClose() }}>
      <DialogContent className="dark bg-surface-alt max-w-2xl overflow-auto" showCloseButton>
        <DialogTitle className="font-display text-2xl tracking-[0.12em]">
          SIZE GUIDE
        </DialogTitle>
        <p className="font-body text-[10px] text-on-surface/50 mb-4">
          {product.name} · measurements in cm
        </p>
        <SizeTable rows={rows} gender={gender} mini />
      </DialogContent>
    </Dialog>
  )
}
