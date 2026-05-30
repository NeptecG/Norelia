'use client'

import { useTranslations } from 'next-intl'

/**
 * Returns a function that maps a product category key (TSHIRTS, HOODIES, …)
 * to its localized singular label.
 *
 * Categories are a closed enum (see `Product['cat']`), so every key is
 * guaranteed to exist in the `Categories` namespace. This is the single
 * source of truth — do not re-inline category label maps in components.
 */
export function useCatLabel() {
  const t = useTranslations('Categories')
  return (cat: string): string => t(`catSingular${cat}` as 'catSingularTSHIRTS')
}

/**
 * Returns a function that maps a garment colour name to its localized label.
 *
 * Colours are open-ended — new ones arrive whenever a product is added — so we
 * guard with `t.has()` and fall back to the raw name when no translation
 * exists. This prevents a missing key from rendering a broken "GarmentColors.X"
 * string in the UI when new products land.
 */
export function useColorLabel() {
  const t = useTranslations('GarmentColors')
  return (name: string): string =>
    t.has(name as 'White') ? t(name as 'White') : name
}
