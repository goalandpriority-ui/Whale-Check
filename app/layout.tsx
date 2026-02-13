import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Base Whale Checker',
  description: 'Check Base chain whale transactions',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="bg-black text-white min-h-screen">
        {children}
      </body>
    </html>
  )
}
