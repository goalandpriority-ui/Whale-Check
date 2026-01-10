"use client"

import { WagmiConfig } from "wagmi"
import { wagmiConfig } from "./wagmi"

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <WagmiConfig config={wagmiConfig}>
          {children}
        </WagmiConfig>
      </body>
    </html>
  )
}
