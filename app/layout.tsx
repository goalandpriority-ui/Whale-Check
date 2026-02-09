import './globals.css'
import Providers from './providers'

export const metadata = {
  title: 'Base Whale Check',
  description: 'Track whales on Base chain',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
