"use client"

import { ReactNode } from "react"
import { WagmiConfig, createClient, configureChains } from "wagmi"
import { mainnet } from "wagmi/chains"
import { publicProvider } from "wagmi/providers/public"
import { InjectedConnector } from "wagmi/connectors/injected"

const { provider, webSocketProvider } = configureChains(
  [mainnet],
  [publicProvider()]
)

const client = createClient({
  autoConnect: true,
  connectors: [
    new InjectedConnector({
      chains: [mainnet],
    }),
  ],
  provider,
  webSocketProvider,
})

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <WagmiConfig client={client}>
      {children}
    </WagmiConfig>
  )
}
