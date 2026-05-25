import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

interface Props { params: Promise<{ gender: string }> }

const VALID = ['men', 'women']

export function generateStaticParams() {
  return VALID.map(gender => ({ gender }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { gender } = await params
  if (!VALID.includes(gender)) return {}
  return { title: gender === 'men' ? 'Men' : 'Women' }
}

export default async function GenderPage({ params }: Props) {
  const { gender } = await params
  if (!VALID.includes(gender)) notFound()
  return (
    <main className="min-h-screen pt-20 px-8 bg-surface">
      <p className="font-display text-4xl capitalize text-on-surface">{gender} (shell)</p>
    </main>
  )
}
