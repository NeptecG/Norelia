import { ImageResponse } from 'next/og'

export const runtime     = 'edge'
export const alt         = 'NORELIA. Premium Streetwear'
export const size        = { width: 1200, height: 630 }
export const contentType = 'image/png'

/**
 * Default OG image served at /opengraph-image.
 * All routes that don't define their own will inherit this.
 * Product pages supply their own via generateMetadata → openGraph.images.
 */
export default function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          background: '#212121',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'system-ui, sans-serif',
          position: 'relative',
        }}
      >
        {/* Subtle inner border */}
        <div
          style={{
            position: 'absolute',
            inset: 24,
            border: '1px solid rgba(245,245,245,0.08)',
          }}
        />

        {/* Brand wordmark */}
        <div
          style={{
            fontSize: 100,
            fontWeight: 700,
            color: '#f5f5f5',
            letterSpacing: '0.18em',
            marginBottom: 20,
            lineHeight: 1,
          }}
        >
          NORELIA.
        </div>

        {/* Tagline */}
        <div
          style={{
            fontSize: 16,
            color: 'rgba(245,245,245,0.38)',
            letterSpacing: '0.34em',
            textTransform: 'uppercase',
          }}
        >
          Premium Streetwear · Preveza, Greece
        </div>
      </div>
    ),
    { ...size },
  )
}
