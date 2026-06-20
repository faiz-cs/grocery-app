import type { Metadata, Viewport } from 'next'
import './globals.css'
import { CartProvider } from '@/lib/cart'
import Script from 'next/script'
import IOSInstallBanner from '@/components/store/IOSInstallBanner'

const STORE_NAME = process.env.NEXT_PUBLIC_STORE_NAME || 'FreshMart'

export const metadata: Metadata = {
  title: {
    default: STORE_NAME,
    template: `%s | ${STORE_NAME}`,
  },
  description: 'Fresh groceries delivered to your door. Order via WhatsApp.',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: STORE_NAME,
    startupImage: [
      { url: '/apple-touch-icon.png' }
    ],
  },
  icons: {
    icon: [
      { url: '/favicon-16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: [{ url: '/apple-touch-icon.png', sizes: '180x180' }],
    other: [{ rel: 'mask-icon', url: '/icon.svg', color: '#16a34a' }],
  },
}

export const viewport: Viewport = {
  themeColor: '#0d2e0f',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* iOS PWA specific */}
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content={STORE_NAME} />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
      </head>
      <body className="font-sans antialiased">
        <CartProvider>
          {children}
          <IOSInstallBanner />
        </CartProvider>
        <Script id="sw-register" strategy="afterInteractive">{`
          if ('serviceWorker' in navigator) {
            window.addEventListener('load', () => {
              navigator.serviceWorker.register('/sw.js')
                .then(() => console.log('SW registered'))
                .catch(e => console.log('SW failed', e));
            });
          }
        `}</Script>
      </body>
    </html>
  )
}
