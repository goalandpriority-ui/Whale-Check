import './globals.css'
import type { Metadata } from 'next'
import { Providers } from './providers'   // ✅ FIXED PATH

export const metadata: Metadata = {
  title: 'Whale Wallet Analyzer',
  description: 'Analyze Ethereum wallets and detect whale status',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
}
