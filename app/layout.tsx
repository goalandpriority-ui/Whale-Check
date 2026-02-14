import './globals.css'
import { Providers } from './Providers'

export const metadata = {
  title: 'Base Whale Engine',
  description: 'Analyze Base wallets'
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
