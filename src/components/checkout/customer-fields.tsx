'use client'

import type { ChangeEvent } from 'react'
import type { FieldErrors, FieldValues, Path, UseFormRegister } from 'react-hook-form'
import { cn } from '@/lib/utils'
import { FIELD_INPUT, FIELD_LABEL, FIELD_ERR, Req } from './fields'

export interface CustomerFieldLabels {
  name:             string
  namePlaceholder:  string
  street:           string
  streetPlaceholder:string
  city:             string
  cityPlaceholder:  string
  postal:           string
  postalPlaceholder:string
  phone:            string
  phonePlaceholder: string
  notes:            string
  notesPlaceholder: string
  email?:           string
  emailPlaceholder?:string
}

interface CustomerFieldsProps<T extends FieldValues> {
  register: UseFormRegister<T>
  errors:   FieldErrors<T>
  // Maps the canonical slots to the parent form's own field names.
  names:    { name: Path<T>; street: Path<T>; city: Path<T>; postal: Path<T>; phone: Path<T>; notes: Path<T>; email?: Path<T> }
  labels:   CustomerFieldLabels
  idPrefix: string
}

// Shared customer-details box (full name, address, city, postal, phone, notes,
// optional email) used by the checkout delivery step and the Design Your Own
// order form. The parent owns validation; this renders the inputs, sanitizes
// postal/phone, and shows the parent's errors.
export function CustomerFields<T extends FieldValues>({ register, errors, names, labels, idPrefix }: CustomerFieldsProps<T>) {
  // RHF does not type dynamic-Path error access; one contained cast at the boundary.
  const msg = (p: Path<T>): string | undefined =>
    (errors as FieldErrors)[p as string]?.message as string | undefined

  const postalReg = register(names.postal)
  const phoneReg  = register(names.phone)
  const sanitizePostal = (e: ChangeEvent<HTMLInputElement>) => { e.target.value = e.target.value.replace(/\D/g, '').slice(0, 5); postalReg.onChange(e) }
  const sanitizePhone  = (e: ChangeEvent<HTMLInputElement>) => { e.target.value = e.target.value.replace(/[^\d+\s]/g, '').slice(0, 16); phoneReg.onChange(e) }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div className="sm:col-span-2">
        <label htmlFor={`${idPrefix}-name`} className={FIELD_LABEL}>{labels.name}<Req /></label>
        <input id={`${idPrefix}-name`} {...register(names.name)} className={FIELD_INPUT} placeholder={labels.namePlaceholder} autoComplete="name" />
        {msg(names.name) && <p className={FIELD_ERR}>{msg(names.name)}</p>}
      </div>

      {names.email && labels.email && (
        <div className="sm:col-span-2">
          <label htmlFor={`${idPrefix}-email`} className={FIELD_LABEL}>{labels.email}<Req /></label>
          <input id={`${idPrefix}-email`} type="email" {...register(names.email)} className={FIELD_INPUT} placeholder={labels.emailPlaceholder} autoComplete="email" />
          {msg(names.email) && <p className={FIELD_ERR}>{msg(names.email)}</p>}
        </div>
      )}

      <div className="sm:col-span-2">
        <label htmlFor={`${idPrefix}-street`} className={FIELD_LABEL}>{labels.street}<Req /></label>
        <input id={`${idPrefix}-street`} {...register(names.street)} className={FIELD_INPUT} placeholder={labels.streetPlaceholder} autoComplete="street-address" />
        {msg(names.street) && <p className={FIELD_ERR}>{msg(names.street)}</p>}
      </div>

      <div>
        <label htmlFor={`${idPrefix}-city`} className={FIELD_LABEL}>{labels.city}<Req /></label>
        <input id={`${idPrefix}-city`} {...register(names.city)} className={FIELD_INPUT} placeholder={labels.cityPlaceholder} autoComplete="address-level2" />
        {msg(names.city) && <p className={FIELD_ERR}>{msg(names.city)}</p>}
      </div>

      <div>
        <label htmlFor={`${idPrefix}-postal`} className={FIELD_LABEL}>{labels.postal}<Req /></label>
        <input
          id={`${idPrefix}-postal`}
          inputMode="numeric"
          maxLength={5}
          {...postalReg}
          onChange={sanitizePostal}
          className={FIELD_INPUT}
          placeholder={labels.postalPlaceholder}
          autoComplete="postal-code"
        />
        {msg(names.postal) && <p className={FIELD_ERR}>{msg(names.postal)}</p>}
      </div>

      <div className="sm:col-span-2">
        <label htmlFor={`${idPrefix}-phone`} className={FIELD_LABEL}>{labels.phone}<Req /></label>
        <input
          id={`${idPrefix}-phone`}
          inputMode="tel"
          maxLength={16}
          {...phoneReg}
          onChange={sanitizePhone}
          className={FIELD_INPUT}
          placeholder={labels.phonePlaceholder}
          autoComplete="tel"
        />
        {msg(names.phone) && <p className={FIELD_ERR}>{msg(names.phone)}</p>}
      </div>

      <div className="sm:col-span-2">
        <label htmlFor={`${idPrefix}-notes`} className={FIELD_LABEL}>{labels.notes}</label>
        <textarea id={`${idPrefix}-notes`} {...register(names.notes)} rows={3} className={cn(FIELD_INPUT, 'resize-none')} placeholder={labels.notesPlaceholder} />
      </div>
    </div>
  )
}
