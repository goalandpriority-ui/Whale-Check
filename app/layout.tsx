import './globals.css'
import type { Metadata } from 'next'
import Providers from './providers'   // ✅ default import

export const metadata: Metadata = {
  title: 'Whale Wallet Analyzer',
  description: 'Analyze Base wallet whale activity',
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
