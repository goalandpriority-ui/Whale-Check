"use client"

import { ReactNode } from "react"
import { WagmiConfig, createConfig, http } from "wagmi"
import { mainnet } from "wagmi/chains"
import { injected } from "wagmi/connectors"

const config = createConfig({
  chains: [mainnet],
  connectors: [
    injected()
  ],
  transports: {
    [mainnet.id]: http()
  }
})

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <WagmiConfig config={config}>
      {children}
    </WagmiConfig>
  )
}
