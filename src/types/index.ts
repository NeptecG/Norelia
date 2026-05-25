export type ProductCategory = 'TSHIRTS' | 'HOODIES' | 'ZIPPERS' | 'TANKTOPS'
export type Gender          = 'men' | 'women' | 'unisex'
export type GarmentType     = 'tshirt' | 'hoodie' | 'zipper'
export type SizeKey         = 'S' | 'M' | 'L' | 'XL' | '2XL' | '3XL'
export type SidePanelType   = 'cart' | 'favorites' | null
export type PrintMethod     = 'dtg' | 'embroidery'
export type FitType         = 'normal' | 'oversized'

export interface Product {
  id:          number
  name:        string
  cat:         ProductCategory
  gender:      Gender
  code:        string
  description: string
  price:       string        // "€45"
  salePrice?:  number        // plain number, no €
  tag:         'NEW' | ''
  img:         string
}

export interface CartItem extends Product {
  qty: number
}

export interface GarmentColor {
  name:     string
  hex:      string
  outline?: boolean
}

export interface SizeRow {
  size:   SizeKey
  intl:   string
  eu:     string
  uk:     string
  chest:  string
  waist:  string
  hip?:   string
  length: string
  sleeve: string
}

export type SizeData = {
  [K in GarmentType]: {
    men:   SizeRow[]
    women: SizeRow[]
  }
}

export type BasePrices = {
  [K in GarmentType]: {
    [S in SizeKey]: number
  }
}

export type StockMap = Record<number, number>

export interface GarmentPaths {
  front: string
  back:  string
}

export type AllPaths = {
  [K in GarmentType]: GarmentPaths
}

export interface ToastState {
  msg:     string
  visible: boolean
  type:    'add' | 'remove'
}

export interface DesignState {
  el:    HTMLImageElement | null
  x:     number
  y:     number
  w:     number
  h:     number
  angle: number
}
