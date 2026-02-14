import './globals.css'

export const metadata = {
  title: 'Base Whale Engine',
  description: 'Analyze Base wallets',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  )
}
