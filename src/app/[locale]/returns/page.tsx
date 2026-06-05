import { redirect } from '@/navigation'

// Returns content now lives on the combined Shipping & Returns page.
// Keep this route as a permanent redirect so old links/bookmarks still resolve.
export default async function ReturnsRedirect({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  redirect({ href: '/shipping', locale })
}
