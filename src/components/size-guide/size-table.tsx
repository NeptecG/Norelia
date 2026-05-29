'use client'

import { useTranslations } from 'next-intl'
import { cn } from '@/lib/utils'
import type { SizeRow } from '@/types'

interface Props {
  rows:    SizeRow[]
  gender:  string   // reserved for future use (e.g. locale-specific column labels)
  mini?:   boolean
}

const thClass = cn(
  'font-body text-[9px] tracking-[0.18em] uppercase',
  'text-on-surface-muted px-3 py-2 text-left whitespace-nowrap',
)

const tdClass = cn(
  'font-body text-xs text-on-surface px-3 py-2 whitespace-nowrap',
)

export function SizeTable({ rows, mini }: Props) {
  const t = useTranslations('SizeTable')
  const hasHip = rows.some((r) => r.hip !== undefined)

  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr>
            <th className={thClass}>{t('size')}</th>
            {!mini && (
              <>
                <th className={thClass}>{t('intl')}</th>
                <th className={thClass}>{t('eu')}</th>
                <th className={thClass}>{t('uk')}</th>
              </>
            )}
            <th className={thClass}>{t('chest')}</th>
            <th className={thClass}>{t('waist')}</th>
            {hasHip && <th className={thClass}>{t('hip')}</th>}
            <th className={thClass}>{t('length')}</th>
            <th className={thClass}>{t('sleeve')}</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={row.size} className={i % 2 === 0 ? 'bg-surface' : 'bg-surface-raised'}>
              <td className={tdClass}>{row.size}</td>
              {!mini && (
                <>
                  <td className={tdClass}>{row.intl}</td>
                  <td className={tdClass}>{row.eu}</td>
                  <td className={tdClass}>{row.uk}</td>
                </>
              )}
              <td className={tdClass}>{row.chest}</td>
              <td className={tdClass}>{row.waist}</td>
              {hasHip && <td className={tdClass}>{row.hip ?? '-'}</td>}
              <td className={tdClass}>{row.length}</td>
              <td className={tdClass}>{row.sleeve}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
