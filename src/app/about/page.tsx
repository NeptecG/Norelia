import type { Metadata } from 'next'
export const metadata: Metadata = { title: 'About Us' }
export default function AboutPage() {
  return <main className="min-h-screen pt-20 px-8 bg-surface"><p className="font-display text-4xl text-on-surface">About (shell)</p></main>
}
